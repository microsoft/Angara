define(["require", "exports", "Angara.Show"], function (require, exports, Angara) {
    exports.Show = function (content, container) {
        require(["jquery"], function ($) {
            var buildItemHtml = function (idx, item, $container) {
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
        });
    };
});
//# sourceMappingURL=Seq.js.map