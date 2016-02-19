namespace Angara.Persistence

open Angara.Serialization
open Angara.Persistence

// Exports a SerializationInfo to a stream with possible extra data containers.
type internal IExportToStream =
    abstract member Export: InfoSet * System.IO.Stream * IBlobWriter -> unit

// Imports a SerializationInfo from a stream with possible extra data containers.
type internal IImportFromStream =
    abstract member Import: System.IO.Stream * IBlobReader -> InfoSet

