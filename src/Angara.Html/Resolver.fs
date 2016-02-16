namespace Angara.HtmlSerializers

open Angara.Serialization


/// Finds a serializer for a type which is assignable from a given object type.
type internal AssignableSerializerResolver(r : ISerializerResolver) = 
    interface ISerializerResolver with        
        member x.TryResolveType lib t = 
            match r.TryResolveType lib t with
            | NotFound _ -> 
                match t.GetInterfaces() |> Array.tryPick (fun i -> 
                                               match (x :> ISerializerResolver).TryResolveType lib i with
                                               | NotFound _ -> None
                                               | result -> Some(result)) with
                | None -> 
                    match t.BaseType with
                    | null -> NotFound("")
                    | baseType -> (x :> ISerializerResolver).TryResolveType lib baseType
                | Some(result) -> result
            | result -> result
        
        member x.TryResolveTypeId lib id = failwith "Not supported"

