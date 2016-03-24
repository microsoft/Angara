open Angara.Charting
open Angara.Data
open System.Windows

type Person =
    {
        Name: string;
        Dogs: string[];
        Age: int
    }


type SupportedTypesRecord =
    { 
        Null: obj;
        Real: float;
        Integer: int;
        String: string;
        Boolean: bool;
        DateTime: System.DateTime;
        Array: obj[];
        EmptyArray: obj[];
        List: int list;
        Tuple: string*int;
        Record: Person;
        Table: Table;
        Chart: Chart;
    }


[<EntryPoint>]
let main argv = 
    let x = [| 0..50 |]
    let y = x|> Array.map (fun x -> cos((float x) / 180.0 * System.Math.PI))

    (*   Tables   *)
    let tableXY = Table.OfColumns([Column.Create("x", x); Column.Create("y", y)])

    (*   Charts   *)
    let plots = 
        [ Plot.line(x |> Array.map float, y, stroke = "orange", thickness = 2.0)
        ; Plot.markers(x |> Array.map float, y, color = MarkersColor.Value "blue", shape = MarkersShape.Circle) ]
    
    let chart = Chart.ofList plots


    let supportedTypes = 
        { Null = null
        ; Real = System.Math.PI
        ; Integer = 2015
        ; String = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in mauris ullamcorper, porttitor lorem ac, finibus lectus. Nullam et ex tortor. Vestibulum eleifend justo erat, eu convallis tellus elementum eu. Nam vestibulum vehicula justo, eget rhoncus diam vehicula ac. Aenean sit amet sollicitudin leo, cursus tincidunt nibh. Nam lacinia dolor ut metus tristique eleifend. Vestibulum felis mauris, dapibus vel mauris vel, consectetur condimentum urna. Proin vulputate, velit nec fermentum consequat, lectus sapien hendrerit tellus, vitae vulputate sem odio ut quam. Mauris eget pulvinar lacus. Praesent elementum accumsan sapien, in accumsan augue. Vestibulum consectetur volutpat arcu vel varius. Vivamus venenatis mi eget velit pellentesque aliquam at eget lectus. Nam at ex purus. Nullam a dui a urna pellentesque rutrum a faucibus sapien.

Donec a orci sodales, porttitor nulla eget, euismod tellus. Proin vel neque ullamcorper ex consectetur ullamcorper. Donec hendrerit efficitur est, eget congue augue condimentum id. Phasellus non purus at diam feugiat convallis sed a sem. Phasellus in elit sagittis, aliquam lorem id, tincidunt dui. Nam nec leo neque. Praesent pulvinar vel leo nec fringilla. Phasellus cursus convallis metus ac ullamcorper. Sed tempus, odio et tempus pharetra, leo velit convallis nisi, molestie mollis enim magna rhoncus felis. Pellentesque venenatis dui magna, sed hendrerit turpis lacinia eget. Fusce in justo ac justo rutrum scelerisque sit amet nec metus. Ut fringilla massa sed quam gravida congue vulputate ut justo. Morbi vel condimentum tellus, a ultricies leo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.

Fusce ornare non risus quis sodales. Pellentesque dapibus semper eleifend. Nullam eu feugiat leo. Etiam semper massa id ipsum feugiat bibendum. Mauris nec lacus porta, dapibus orci eu, pretium ex. Nulla ornare, velit ac mollis tincidunt, tellus mi porta nisi, et luctus massa lorem non sem. Vivamus ullamcorper tincidunt quam, in ultricies urna malesuada non. Cras venenatis facilisis dignissim. Nam commodo dapibus pharetra. Curabitur dui ipsum, tincidunt posuere dapibus at, dignissim a ex. Maecenas eu diam libero. Integer et ante interdum, sollicitudin magna ut, consectetur nisi. Proin egestas est sed mauris rhoncus egestas.

Nullam nec molestie urna. Nullam purus nisl, elementum ac nisl pulvinar, blandit pharetra augue. Praesent finibus pellentesque egestas. Pellentesque pellentesque commodo lacus a congue. Integer malesuada massa vitae felis malesuada, id viverra nulla semper. Etiam tristique elit massa, nec molestie orci blandit id. Integer vehicula dapibus lorem, eu efficitur magna lacinia vel. Ut in elementum elit, sit amet lacinia tortor.

Vestibulum vitae enim sed dui pharetra tristique. Donec maximus elementum maximus. Fusce scelerisque enim ex, quis aliquam nibh scelerisque eu. Nullam lacinia diam felis. Fusce laoreet tortor quis ex pellentesque finibus. Suspendisse sit amet augue mauris. In libero diam, hendrerit pharetra justo at, cursus aliquam justo."
        ; Boolean = true
        ; DateTime = System.DateTime(2015, 1, 1)
        ; Array = [| (*tableXY;*) null; System.Math.PI :> obj; { Name = "Adam"; Dogs = [| "Alba"; "Eva" |]; Age = 25 } :> obj; [|1;2;3|] :> obj |]
        ; EmptyArray = Array.empty
        ; List = [ 1..10 ]
        ; Tuple = "Hello World!", 42
        ; Record = { Name = "Adam"; Dogs = [| "Alba"; "Eva" |]; Age = 25 }
        ; Table = Table.OfColumns([Column.Create("x",[| 0..50 |]); Column.Create("y", [| for x in 0..50 do yield sin((float x) / 180.0 * System.Math.PI) |])])
        ; Chart = chart
        }

    Angara.Base.Init()
    Angara.Html.Save "sample chart.html" chart
    Angara.Html.Save "sample table.html" tableXY
    //Angara.Html.Save "sample tables.html" [| tableXY; Tables.Empty |> Tables.Add "c" [| 0..50 |] |> Tables.Add "t" [| for x in 0..50 do yield System.DateTime(2015,1,1).AddHours(float x) |] |]
    Angara.Html.Save "supported types.html" supportedTypes
    System.Diagnostics.Process.Start("sample chart.html") |> ignore

    let htmlChart = chart |> Angara.Html.MakeEmbeddable "450px"
    System.IO.File.WriteAllText("emb.html", htmlChart)
    printfn "Html is in the emb.html"

    0