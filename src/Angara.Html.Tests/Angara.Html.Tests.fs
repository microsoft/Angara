module Angara.Html.Tests

open NUnit.Framework
open Angara.Data
open Angara

[<Test; Category("CI")>]
let ``Bug fix - stack overflow when saving a table as a record``() =
    let ch_data = Table.Load("1.ChAreaApproximated.csv")
    let html = Html.MakeEmbeddable "400px" ch_data
    Assert.IsTrue(html.Length > 0)
