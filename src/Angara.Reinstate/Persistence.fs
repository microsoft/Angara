namespace Angara

open Angara.Persistence
open Angara.Serialization

type ReinstateServices private () = 

    static let library = SerializerLibrary("Reinstate")
    static let resolver = SerializerCompositeResolver([ CoreSerializerResolver.Instance; library])
    
    static member SnapshotFileName = "snapshot.json"

    static member Serializers with get() : ISerializerLibrary = upcast library

    /// <summary>Reinstates a value either from the storage or recomputing a value from the function.
    /// In the latter case, stores the computed value before returning it to the caller.</summary>
    /// <param name="path">A folder that stores or will store a value.</param>
    /// <param name="compute">A function that recomputes a value.</param>
    static member Reinstate<'t> path (compute : unit -> 't) = 
        let exportImport = FolderExportImport<JsonImporter, JsonExporter>(ReinstateServices.SnapshotFileName)        
        let r = 
            if exportImport.CanImportFrom path then 
                try 
                    Some(exportImport.ImportFrom(path).ToMap().["snapshot"] |> Angara.Serialization.ArtefactSerializer.Deserialize resolver :?> 't)
                with e -> 
                    printfn "Cannot restore snapshot %s: %s" path e.Message
                    None
            else None
        match r with
        | Some(a) -> a
        | None -> 
            let a = compute()
            try 
                let infoSet = a |> Angara.Serialization.ArtefactSerializer.Serialize resolver
                exportImport.Export(InfoSet.EmptyMap.AddInfoSet("snapshot", infoSet), path)
            with e -> printfn "Cannot save snapshot %s: %s" path e.Message
            a
