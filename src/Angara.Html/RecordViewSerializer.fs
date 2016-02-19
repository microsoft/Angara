namespace Angara.HtmlSerializers

open Angara.Serialization

type RecordViewSerializer() = 
    interface ISerializer<obj> with
        member x.TypeId = "record"

        member x.Serialize resolver o = 
            match o with
            | null -> InfoSet.Null
            | _ -> 
                let t = o.GetType()
                let sr = ArtefactSerializer.Serialize resolver
                let is_props = 
                    t.GetProperties() 
                    |> Seq.filter(fun prop -> prop.GetIndexParameters().Length = 0)
                    |> Seq.map(fun prop -> prop.Name, let v = prop.GetValue(o) in sr v)
                
                let is_items = 
                    match o with
                    | :? System.Collections.IEnumerable as items ->
                        let enm = items.GetEnumerator()
                        let items = [| while enm.MoveNext() do yield enm.Current |]
                        seq{ yield "(items)", sr items }
                    | _ -> Seq.empty
                
                let is_map = 
                    match o with
                    | :? System.Collections.IDictionary as dict ->
                        let enm = dict.GetEnumerator()
                        let items = seq{ while enm.MoveNext() do yield InfoSet.ofPairs [ "key", sr enm.Key; "value", sr enm.Value ] } |> InfoSet.Seq
                        seq{ yield "(map)", items }
                    | _ -> Seq.empty
                InfoSet.ofPairs (Seq.concat [is_props; is_items; is_map])

        member x.Deserialize _ _ = failwith "Record deserialization is not supported"