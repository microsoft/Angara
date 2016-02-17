/// <reference path="../typings/requirejs/require.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../.Web/angara.serializationjs/dist/Angara.Serialization.umd.d.ts" />

import $ = require("jquery");
import Angara = require("../.Web/angara.serializationjs/dist/Angara.Serialization.umd");

var endsWith = function (searchString, position) {
    var subjectString = this.toString();
    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
};

var isPrimitiveType = function (obj: any) {
    return typeof (obj) === "boolean" || typeof (obj) === "number" || typeof (obj) === "string" || obj instanceof Date;
}

var moduleOf = function (content: any) {
    if (content === undefined || content === null)
        return "Primitive";
    if (typeof content[Angara.TypeIdPropertyName] === "string")
        return <string>content[Angara.TypeIdPropertyName];
    if (Array.isArray(content))
        return "Seq";
    if (isPrimitiveType(content))
        return "Primitive";
    return "Record";
}

var errFailedToLoad = function (err: any, module: string) {
    var errorMessage = "Failed to load a viewer module \"" + module + "\"";
    if (err.requireType)
        errorMessage += " (" + err.requireType + ")";
    return errorMessage;
}

export var Show = function (content: any, container: HTMLElement) {
    $(container).addClass("angara-show-content").html("Loading...");
    var module = moduleOf(content);
    require([module], function (viewer) {
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
            $(container).html(errFailedToLoad(err, module)).addClass("angara-show-errormessage");
        });
    });
}
