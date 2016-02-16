namespace Angara.HtmlSerializers

open Angara.Serialization

type RecordViewSerializer() = 
    interface ISerializer<obj> with
        member x.TypeId = "record"

        member x.Serialize resolver o = 
            match o with
            | null -> InfoSet.Null
            | _ -> 
                let t = o.GetType();
                let is = 
                    t.GetProperties() 
                    |> Seq.map(fun prop -> prop.Name, let v = prop.GetValue(o) in ArtefactSerializer.Serialize resolver v)
                    |> InfoSet.ofPairs
                is

        member x.Deserialize _ _ = failwith "Record deserialization is not supported"


