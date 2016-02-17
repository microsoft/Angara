/// <reference path="../typings/requirejs/require.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />

import Serialization = require("../.Web/angara.serializationjs/dist/Angara.Serialization.umd")
import Angara = require("Angara.Show")
declare var Utils;

export var Show = function (content: Object, container: HTMLElement) {
    require(["jquery"], function ($: JQueryStatic) {
        var $container = $(container);
        var $value = $("<div></div>").addClass("angara-show-record").appendTo($container);
        for (var prop in content) {
            if (prop == Serialization.TypeIdPropertyName) continue;
            var $el = $("<section></section>").addClass("angara-show-seq-item").appendTo($value);
            var $head = $("<div></div>").addClass("angara-show-seq-item-header").addClass("angara-show-caption").appendTo($el);
            $head.text(prop);
            var $item = $("<div></div>").addClass("angara-show-seq-item-content").appendTo($el);
            Angara.Show(content[prop], $item[0]);
        }
    });
}
