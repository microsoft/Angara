/// <reference path="../../../typings/requirejs/require.d.ts" />
/// <reference path="../../../typings/jquery/jquery.d.ts" />

import $ = require("jquery");

var endsWith = function (searchString, position) {
    var subjectString = this.toString();
    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
};

type ContentDescription = {
    module: string;
    type: string;
}

var descr = function(module: string, type: string){
    return { module: module, type: type };
}

var describeContent = function (content: any, typeIdPropertyName: string): ContentDescription {
    if (content === undefined || content === null)
        return descr("Primitive", "");
    if (typeof content[typeIdPropertyName] === "string") {
        var typeId = <string>content[typeIdPropertyName];
        return descr(typeId, typeId);
    }
    if (Array.isArray(content))
        return descr("Seq", "array");
    var tp = typeof (content);
    if (tp === "boolean" || tp === "number" || tp === "string")
        return descr("Primitive", tp)
    if (content instanceof Date)
        return descr("Primitive", "date");
    return descr("Record", "record");
}

var errFailedToLoad = function (err: any, module: string) {
    var errorMessage = "Failed to load a viewer module \"" + module + "\"";
    if (err.requireType)
        errorMessage += " (" + err.requireType + ")";
    return errorMessage;
}

export var Show = function (content: any, container: HTMLElement) {
    $(container).addClass("angara-show-content").html("Loading...");
    var dsc = describeContent(content, "__angara_typeId");
    require([dsc.module], function (viewer) {
        $(container).html("");
        return viewer.Show(content, container);
    }, function (err) {
        // There are no custom viewer found for the content.
        var module2 = null;
        if (Array.isArray(content)) // Show it as an array?
            module2 = "Seq";
        else
            module2 = "Record"; // Using generic viewer
        require([module2], function (viewer) {
            $(container).html("");
            return viewer.Show(content, container);
        }, function (err) {
            $(container).html(errFailedToLoad(err, dsc.module)).addClass("angara-show-errormessage");
        });
    });
    return dsc.type;
}
