/// <reference path="../typings/requirejs/require.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />

import Angara = require("Angara.Show")
declare var Utils;

export var Show = function (content: any[], container: HTMLElement) {  
    require(["jquery"], function ($: JQueryStatic) {
        var buildItemHtml = function (idx: number, item: any, $container: JQuery) {
            var $el = $("<section></section>").addClass("angara-show-seq-item").appendTo($container);
            var $head = $("<div></div>").addClass("angara-show-seq-item-header").addClass("angara-show-caption").appendTo($el);
            $head.append(idx.toString());
            var $item = $("<div></div>").addClass("angara-show-seq-item-content").appendTo($el);
            Angara.Show(item, $item[0]);
        };

        var $container = $(container);
        for (var i = 0; i < content.length; i++) {
            buildItemHtml(i, content[i], $container);
        }
    });
}
