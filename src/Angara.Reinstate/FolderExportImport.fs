namespace Angara.Persistence

open System.IO
open Angara.Serialization

type internal FolderExportImport<'i,'e> when 'i :> IImportFromStream and 'e :> IExportToStream (fileName : string) =
    inherit ExportImport<'i,'e>()

    override x.CanImportFrom folder =
        Directory.Exists(folder) && File.Exists(Path.Combine(folder, fileName))

    override x.Export(content, folder) =

        let rec hasBlobsWithoutNamespace infoSet = match infoSet with
                                                   | Blob(_,_) -> true
                                                   | Artefact(_, content) -> hasBlobsWithoutNamespace content
                                                   | Map(m) -> m |> Map.toSeq |> Seq.exists(fun pair -> snd pair |> hasBlobsWithoutNamespace)
                                                   | Seq(s) -> s |> Seq.exists(fun e -> hasBlobsWithoutNamespace e)
                                                   | _ -> false

        let exp = x.GetExporter()
        let blobWriter = new FolderBlobWriter(folder)
        use outs = File.OpenWrite(Path.Combine(folder, fileName))
        let content = if hasBlobsWithoutNamespace content then InfoSet.Namespace([ Path.GetFileNameWithoutExtension(fileName) ], content)
                                                          else content
        exp.Export(content, outs, blobWriter)

    override x.ImportFrom folder =
        let imp = x.GetImporter()
        if not(File.Exists(Path.Combine(folder, fileName))) then failwith("No entry " + fileName + " found in the folder " + folder)
        let reader = new FolderBlobReader(folder)
        use ins = File.OpenRead(Path.Combine(folder, fileName))
        match imp.Import(ins, reader) with
        | Namespace(_, content) -> content
        | content -> content