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
