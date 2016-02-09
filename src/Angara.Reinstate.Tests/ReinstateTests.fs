module CheckPointTests

open NUnit.Framework
open Angara
open Swensen.Unquote
open System.IO
open Angara.Serialization

[<Test; Category("CI")>]
let ``Reinstate primitive values``() = 
    let name = "primitive_chkpoint"
    if Directory.Exists name then Directory.Delete(name, true)
    let v = (1,3.1415, "Hello, World!", true)

    // Checkpoint creation
    let v' = Angara.ReinstateServices.Reinstate name (fun () -> v)
    Assert.AreEqual(v, v')
    // Checkpoint created
    Assert.IsTrue(Directory.Exists name) 
    // Checkpoint restored without computations
    let v'' = Angara.ReinstateServices.Reinstate name (fun() -> (failwith "Should not execute this"; v))
    Assert.AreEqual(v, v'')

type Vector2d = { x : int; y : int }

type Vector2dSerializer() =
    interface ISerializer<Vector2d> with
        member x.TypeId = "Vector2d"
        member x.Serialize _ v = InfoSet.EmptyMap.AddInt("x", v.x).AddInt("y", v.y)
        member x.Deserialize _ si = let map = InfoSet.toMap si in { x = map.["x"].ToInt(); y = map.["y"].ToInt() }       

[<Test; Category("CI")>]
let ``Reinstate artefact with custom serializer``() = 
    let name = "artefact_chkpoint"
    if Directory.Exists name then Directory.Delete(name, true)

    // Register serializer
    Angara.ReinstateServices.Serializers.Register(new Vector2dSerializer())

    let v = [| { x = 1; y = -1 }; { x = 2; y = -2 } |]
    // Checkpoint creation
    let v' = Angara.ReinstateServices.Reinstate name (fun () -> v)
    Assert.AreEqual(v, v')
    // Checkpoint created
    Assert.IsTrue(Directory.Exists name) 
    // Checkpoint restored without computations
    let v'' = Angara.ReinstateServices.Reinstate name (fun() -> (failwith "Should not execute this"; v))
    Assert.AreEqual(v, v'')