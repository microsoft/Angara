module Angara.Html


/// Generates an HTML string which contains an element having given height (e.g. "1oo%", "200px"),
/// which displays the given object.
/// All the referenced resources are located at CRNs. 
/// The Angara.Html.Serializers must contain a serializer for the given object.
val MakeEmbeddable : height:string -> artefact:obj -> string

/// Generates an HTML page that displays the given object.
/// The Angara.Html.Serializers must contain a serializer for the given object.
val Save : fileName:string -> artefact:obj -> unit

/// Generates an HTML page that displays a value previously stored using
/// Angara.ReinstateServices.Reinstate method.
/// Parameter `path` is a path to a folder that was provided to the Reinstate method call.</param>
/// The Angara.Html.Serializers must contain a serializer for the given object.
val Make : path:string -> unit


/// Allows to display .NET objects using a dynamic html page.
module Console =
    
    /// Display the given object on the HTML page in a browser.
    /// `height` determines the CSS height for the HTML element (e.g. "1oo%", "200px").
    val Write : height:string -> artefact:obj -> unit

    /// Display the given html code on the HTML page in a browser.
    val WriteHtml : html:string -> unit

    /// Display the given object on the HTML page in a browser;
    /// if the object with same ID was already displayed, it is updated.
    /// `height` determines the CSS height for the HTML element (e.g. "1oo%", "200px").
    val WriteWithId : id:string -> height:string -> artefact:obj -> unit

    /// Display the given html code on the HTML page in a browser;
    /// if the element with same ID was already displayed, it is updated.
    val WriteHtmlWithId : id:string -> html:string -> unit

    /// Save the console content to a file.
    val Save : path:string -> unit



open Angara.Serialization

/// The library to be filled dynamically with type serializers for which there are viewers (e.g. Table, Chart).
val Serializers : ISerializerLibrary