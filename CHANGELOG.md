## 0.1.2 (February 19, 2016)

Features:
* Angara.Html.Save() for an unregistered object checks whether it implements IEnumerable or IDictionary interfaces and serializes their contents as well.
* Build process of Angara.Html is improved. 

Refactoring:
* Angara.Html.UISerializers is now Angara.Html.Serializers.

Bug fix:
* Angara.Html.Save() allows to save objects with indexing properties.
