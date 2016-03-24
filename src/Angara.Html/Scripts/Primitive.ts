/// <reference path="../../../typings/jquery/jquery.d.ts" />

import $ = require("jquery");
import Angara = require("Angara.Show")
declare var Utils;

/// content is of a primitive type (bool, datetime, double, int, guid, string, null, undefined)
export var Show = function (content: any, container: HTMLElement) {
    var $value = $("<div></div>").addClass("angara-show-primitive").appendTo($(container));
    if (content === undefined)
        $value.text("The value is <undefined>");
    else if (content === null)
        $value.text("The value is <null>");
    else if (typeof (content) === "boolean")
        $value.text(<boolean>content);
    else if (content instanceof Date)
        $value.text((<Date>content).toLocaleString());
    else if (typeof (content) === "number")
        $value.text(<number>content);
    else if (typeof (content) === "string")
        $value.addClass("angara-show-string").text(<string>content);
    else
        $value.addClass("angara-show-errormessage").text("Unsupported data type");
}
