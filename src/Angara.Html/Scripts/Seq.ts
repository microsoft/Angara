/// <reference path="../../../typings/jquery/jquery.d.ts" />

import $ = require("jquery");
import Angara = require("Angara.Show")
declare var Utils;

export var Show = function (content: any[], container: HTMLElement) {  
    var buildItemHtml = function (idx: number, item: any, $container: JQuery) {
        var $el = $("<section></section>").addClass("angara-show-seq-item").appendTo($container);
        var $head = $("<div></div>").addClass("angara-show-seq-item-header").appendTo($el);
        var $head_name = $("<span></span>").addClass("angara-show-caption").appendTo($head);
        $head_name.text(idx.toString());
        var $item = $("<div></div>").addClass("angara-show-seq-item-content").appendTo($el);
        var itemType = Angara.Show(item, $item[0]);
        if (itemType) {
            var $head_type = $("<span></span>").addClass("angara-show-caption-type").appendTo($head);
            $head_type.text(itemType);
        }
    };

    var $container = $(container);
    for (var i = 0; i < content.length; i++) {
        buildItemHtml(i, content[i], $container);
    }
}
