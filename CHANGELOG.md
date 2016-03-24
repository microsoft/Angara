## 0.1.5 (March 24, 2016)

* Uses recent version of angara.tablejs (v0.1.1).

## 0.1.4 (March 24, 2016)

Features:
* The repository exposes a bower component `Angara.Html` which includes basic scripts
required by HTML code produced by `Angara.Html.MakeEmbeddable`. 
* `Angara.Html.MakeEmbeddable` doesn't require `origin` parameter and the produced HTML code 
uses github as cdn for Angara scripts. 
* Angara.Html supports for `Angara.Data.Table` type.
* `Angara.Base.Init()` registers serializers of the `Angara.Table` package as well.

Fixes:
* Bower for Angara.Html has explicit resolution for `jquery` to version 2.1.4.

## 0.1.3 (March 18, 2016)

* New method `Angara.Html.MakeEmbeddable` which generates HTML text displaying the object given
as the argument. The HTML text loads all required resources from an origin CDN and can be
embedded to an HTML page without any additional files required.
* Nuget package Angara.Base depends on Angara.Statistics.

## 0.1.2 (February 19, 2016)

Features:
* `Angara.Html.Save()` for an unregistered object checks whether it implements `IEnumerable` or `IDictionary` interfaces and serializes their contents as well.
* Build process of Angara.Html is improved. 

Refactoring:
* `Angara.Html.UISerializers` is now `Angara.Html.Serializers`.

Bug fix:
* `Angara.Html.Save()` allows to save objects with indexing properties.
