define(["require", "exports", "./Angara.Serialization.umd", "Angara.Show"], function (require, exports, Serialization, Angara) {
    exports.Show = function (content, container) {
        require(["jquery"], function ($) {
            var $container = $(container);
            var $value = $("<div></div>").addClass("angara-show-record").appendTo($container);
            for (var prop in content) {
                if (prop == Serialization.TypeIdPropertyName)
                    continue;
                var $el = $("<section></section>").addClass("angara-show-seq-item").appendTo($value);
                var $head = $("<div></div>").addClass("angara-show-seq-item-header").appendTo($el);
                var $head_name = $("<span></span>").addClass("angara-show-caption").appendTo($head);
                $head_name.text(prop);
                var $item = $("<div></div>").addClass("angara-show-seq-item-content").appendTo($el);
                var itemType = Angara.Show(content[prop], $item[0]);
                if (itemType) {
                    var $head_type = $("<span></span>").addClass("angara-show-caption-type").appendTo($head);
                    $head_type.text(itemType);
                }
            }
        });
    };
});
//# sourceMappingURL=Record.js.map