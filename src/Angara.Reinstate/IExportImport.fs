namespace Angara.Persistence

open Angara.Serialization

type internal IExport =
    // Exports the given InfoSet to the given resource.
    abstract member Export: InfoSet * string -> unit

type internal IImport =
    // Imports an InfoSet from the given resource.
    abstract member ImportFrom: string -> InfoSet
    // Checks whether this instance can import from the given resource.
    abstract member CanImportFrom: string -> bool

[<AbstractClass>]
type internal ExportImport<'i, 'e> when 'i :> IImportFromStream and 'e :> IExportToStream () =
    let locker = new System.Object()
    let mutable import = Option.None 
    let mutable export = Option.None

    abstract member CanImportFrom: string -> bool

    abstract member Export: InfoSet * string -> unit

    abstract member ImportFrom: string -> InfoSet

    member x.GetExporter() =
        match export with
        | Some(e) -> e
        | None -> lock locker (fun () -> match export with
                                         | Some(e) -> e
                                         | None -> export <- Some(System.Activator.CreateInstance<'e>())
                                                   export.Value)

    member x.GetImporter() =
        match import with
        | Some(i) -> i
        | None -> lock locker (fun () -> match import with
                                         | Some(i) -> i
                                         | None -> import <- Some(System.Activator.CreateInstance<'i>())
                                                   import.Value)