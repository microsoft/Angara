module Angara.Html

open System.IO
open Angara.Serialization
open Angara.HtmlSerializers

type internal SnippetAttributes = Map<string, string>

let internal attributes (attrs:(string*string) seq) = Map.ofSeq attrs

let internal xa = System.Reflection.Assembly.GetExecutingAssembly()

let internal unwrapWebFolder (targetDir : string) : string = 
    let dir = Path.Combine(targetDir, ".Web")
    use webZipStream = "web.zip" |> xa.GetManifestResourceStream
    use webZip = Ionic.Zip.ZipFile.Read(webZipStream)
    webZip.ExtractAll(dir, Ionic.Zip.ExtractExistingFileAction.OverwriteSilently)
    dir

let internal applySnippet (snippetName : string) (attributes: SnippetAttributes) : string =
    let replace (placeholder : string) (snippet : string) = 
        match attributes |> Map.tryFind placeholder with
        | Some attr -> snippet.Replace("@" + placeholder, attr)
        | None when snippet.Contains("@" + placeholder) -> failwithf "No value for the snippet attribute '@%s' is given" placeholder
        | None -> snippet
    
    let snippet = 
        use src = snippetName |> xa.GetManifestResourceStream
        use reader = new StreamReader(src)
        reader.ReadToEnd()
    
    attributes |> Map.toSeq |> Seq.fold (fun s (key,_) -> replace key s) snippet
    

let internal prepareHtml (path : string) (content : string) = 
    let title = Path.GetFileNameWithoutExtension(path)
    let page = applySnippet "index.cshtml" (attributes [ "Title", title; "Content", content ])
    File.WriteAllText(path, page)


/// The library to be filled dynamically with serializers of types for which there are viewers (e.g. Table, Chart).
let Serializers : ISerializerLibrary = upcast Angara.Serialization.SerializerLibrary("Html")
/// Keeps a serializer for any object when its public properties are serialized.
let internal RecordSerializer = Angara.Serialization.SerializerLibrary.CreateEmpty()

/// The last item of the composition must be the RecordSerializer for it is a fallback serializer if none of others is suitable.
let internal UIResolver = SerializerCompositeResolver([ Angara.Serialization.CoreSerializerResolver.Instance; AssignableSerializerResolver(Serializers); AssignableSerializerResolver(RecordSerializer) ])

/// <summary>Generates an HTML page that displays the given object.</summary>
/// <param name="fileName">A file name to save the HTML page.</param>
/// <param name="artefact">An object to display.</param>
let Save (fileName : string) (artefact : obj) = 
    let targetDir = Path.GetDirectoryName fileName
    let json = Angara.Serialization.Json.FromObject (UIResolver, artefact)
    let content = json.ToString(Newtonsoft.Json.Formatting.Indented)       
    let webDir = unwrapWebFolder targetDir
    prepareHtml fileName content
    ()

/// <summary>Generates an HTML page that displays a value previously stored using
/// <see cref="Angara.ReinstateServices.Reinstate">Angara.ReinstateServices.Reinstate</see> method.</summary>
/// <param name="path">A folder that was provided to the Reinstate method call.</param>
let Make (path:string) = 
    let value = Angara.ReinstateServices.Reinstate<obj> path (fun () -> failwith "Cannot reinstate a value from the storage")
    let lastChar = path.Chars(path.Length-1)
    let fileName = (if lastChar = Path.DirectorySeparatorChar || lastChar = Path.AltDirectorySeparatorChar then path.Substring(0, path.Length-1) else path) + ".html";
    Save fileName value

let MakeEmbeddable (height: string) (artefact : obj) =
    let json = Angara.Serialization.Json.FromObject (UIResolver, artefact)
    let content = json.ToString(Newtonsoft.Json.Formatting.Indented)      
    let viewerId = System.Guid.NewGuid().ToString("N")
    let origin = sprintf "https://cdn.rawgit.com/predictionmachines/Angara/%s/dist" AssemblyInfo.Const.Version;
    applySnippet "embeddableIndex.cshtml" (attributes [ "Content", content; "Origin", origin; "ViewerId", viewerId; "Height", height ])

module Console =
    open Suave
    open Suave.Filters
    open Suave.Operators
    open Suave.Successful

    module internal GS = 
        let private Delta = 128
        let empty<'t> = (0, Array.zeroCreate<'t> Delta)
    
        let add item gs : int * 't [] = 
            let count = fst gs
            let items = snd gs
        
            let items = 
                if Array.length items < count then items
                else 
                    Array.concat [ items
                                   Array.zeroCreate Delta ]
            items.[count] <- item
            (count + 1, items)
    
        let toSeq start (gs : int * 't []) = 
            let items = snd gs
            seq { 
                for i in start..(fst gs) - 1 do
                    yield items.[i]
            }

    let mutable internal contents = GS.empty<string * string>

    let encodeJS (s : string) = 
        let sb = System.Text.StringBuilder()
        s |> Seq.iter (fun c -> (match c with
                                 | '\"' -> sb.Append("\\\"")
                                 | '\\' -> sb.Append("\\\\")
                                 | '\f' -> sb.Append("\\f")
                                 | '\n' -> sb.Append("\\n")
                                 | '\r' -> sb.Append("\\r")
                                 | '\t' -> sb.Append("\\t")
                                 | '\v' -> sb.Append("\\v")
                                 | '\b' -> sb.Append("\\b")
                                 | c -> let code = int c 
                                        if code < 32 || code > 127 then sb.AppendFormat("\\u{0:X04}", code) else sb.Append(c)) |> ignore)
        sb.ToString()

    let private nl = System.Environment.NewLine


    let internal documentTemplate =
        use sr = new System.IO.StreamReader(System.Reflection.Assembly.GetExecutingAssembly().GetManifestResourceStream("console.html"))
        sr.ReadToEnd()

    let rec appendOrReplace (id,elt) list =
        match list with
        | [] -> [ id, elt ]
        | (id',_) :: tail when id' = id -> (id,elt) :: tail
        | head :: tail -> head :: appendOrReplace (id,elt) tail
 
    let internal getUpdates t = 
        let items = contents 
                    |> GS.toSeq t 
                    |> Seq.fold(fun updates (id,t) -> updates |> appendOrReplace (id, sprintf "{ \"id\": \"%s\", \"text\": \"%s\" }" (id |> encodeJS) (t |> encodeJS))) []
                    |> Seq.map snd
                    |> String.concat "," 
        sprintf "[%s]" items
    
    let internal getDocument () = 
        let updates = contents |> GS.toSeq 0 |> Array.ofSeq
        let divs = updates
                   |> Seq.fold (fun updates (id,t) -> updates |> appendOrReplace (id, sprintf "<div id=\"%s\">%s</div>" id t)) []
                   |> Seq.map snd
                   |> String.concat nl
        documentTemplate
            .Replace("{{content}}", divs)
            .Replace("{{timestamp}}", updates.Length.ToString())

    /// Sample server that we want to host
    let app = 
        choose 
          [ GET >=> choose 
                    [ path "/" >=> request(fun _ -> OK (getDocument()));
                      path "/console.js" >=> Writers.setMimeType "application/javascript"
                                         >=> Embedded.sendResource (System.Reflection.Assembly.GetExecutingAssembly()) "console.js" false
                      path "/updates" >=> Writers.setMimeType "application/json"
                                      >=> request(fun r -> let t = match r.queryParam "t" with
                                                                   | Choice1Of2 t -> match System.Int32.TryParse t with
                                                                                     | true, t -> t
                                                                                     | false, _ -> 0
                                                                   | _ -> 0
                                                           OK (getUpdates t))] ]
        
    /// Start server on the first available port in the range 8000..10000
    /// and return the port number once the server is started (asynchronously)
    let private startSuaveServer() = 
        Async.FromContinuations(fun (cont, _, _) -> 
            let startedEvent = Event<_>()
            startedEvent.Publish.Add(cont)
            async { 
                // Try random ports until we find one that works
                let rnd = System.Random()
                while true do
                    let port = 8000 + rnd.Next(2000)
                    let local = Suave.Http.HttpBinding.mkSimple HTTP "127.0.0.1" port
                    let logger = Suave.Logging.Loggers.saneDefaultsFor Logging.LogLevel.Error
                
                    let config = 
                        { defaultConfig with bindings = [ local ]
                                             logger = logger }
                
                    let started, start = startWebServerAsync config app
                    // If it starts OK, we get TCP binding & report success via event
                    async { let! running = started
                            startedEvent.Trigger(running) } |> Async.Start
                    // Try starting the server and handle SocketException
                    try 
                        do! start
                    with :? System.Net.Sockets.SocketException -> ()
            }
            |> Async.Start)

    let mutable isOpened = false

    let Open() = 
        if not isOpened then 
            isOpened <- true
            async {
                let! s = startSuaveServer()
                let binding = s.[0].Value.binding.ToString()
                System.Diagnostics.Process.Start ("http://" + binding) |> ignore
            } |> Async.RunSynchronously

    
    let WriteHtmlWithId id html = 
        Open()
        contents <- GS.add (id, html) contents

    let WriteHtml html = WriteHtmlWithId (System.Guid.NewGuid().ToString()) html

    let WriteWithId id height (artefact:obj) = MakeEmbeddable height artefact |> WriteHtmlWithId id

    let Write height (artefact:obj) = WriteWithId (System.Guid.NewGuid().ToString()) height artefact


    let Save (path : string) =
        use sw = new System.IO.StreamWriter(path)
        sw.Write(getDocument())

do 
    RecordSerializer.Register(Angara.HtmlSerializers.RecordViewSerializer())
