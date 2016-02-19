namespace Angara.Persistence

open Newtonsoft.Json
open System.IO
open Newtonsoft.Json.Linq
open Angara.Serialization

type internal JsonExporter () =
    interface IExportToStream with
        member x.Export(infoSet, outStream, blobWriter : IBlobWriter) =
            let token = Angara.Serialization.Json.Marshal(infoSet, Some(blobWriter))
            let writer = new JsonTextWriter(new StreamWriter(outStream))
            writer.Formatting <- Formatting.Indented
            token.WriteTo(writer)
            writer.Flush()

type internal JsonImporter () =
    interface IImportFromStream with
        member x.Import(inStream, blobReader) =
            let reader = new JsonTextReader(new StreamReader(inStream))
            let token = JToken.ReadFrom(reader)
            Angara.Serialization.Json.Unmarshal(token, Some(blobReader))