#I __SOURCE_DIRECTORY__
#r "bin/Debug/Angara.Serialization.dll"
#r "bin/Debug/System.Collections.Immutable.dll"
#r "bin/Debug/Suave.dll"
#r "bin/Debug/Angara.Html.dll"
#r "bin/Debug/Angara.Chart.dll"
#r "bin/Debug/Angara.Table.dll"


open Angara
open Angara.Charting
open Angara.Data
open Angara.Html

Angara.Charting.Serializers.Register [Angara.Html.Serializers]
Angara.Data.TableSerializers.Register [Angara.Html.Serializers]


let x = [| 0..1000 |] |> Array.map (fun i -> float(i) / 200.0)
let y = x |> Array.map sin

let chart = Chart.ofList [ Plot.line(x, y, displayName = "sine") ]

Console.WriteHtml "<H1>This is a chart:</H1>"

Console.Write "400px" chart

let table = Table.OfColumns
                [ Column.Create ("x", x);
                  Column.Create ("sinx", y) ]

Console.WriteHtml "<H1>This is a table:</H1>" 

Console.Write "600px" table

async {
    let mutable p = 0.0
    while true do
        do! Async.Sleep 1000
        let x = [| 0..1000 |] |> Array.map (fun i -> float(i) / 200.0)
        let y = x |> Array.map (fun x -> sin (x+p))
        let chart = Chart.ofList [ Plot.line(x, y, displayName = "sine") ]
        p <- p + 0.1
        Console.WriteWithId "chart" "400px" chart

} |> Async.RunSynchronously