define(["require", "exports", "jquery", "Angara.Serialization.umd"], function (require, exports, $, Angara) {
    var endsWith = function (searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
    var descr = function (module, type) {
        return { module: module, type: type };
    };
    var describeContent = function (content) {
        if (content === undefined || content === null)
            return descr("Primitive", "");
        if (typeof content[Angara.TypeIdPropertyName] === "string") {
            var typeId = content[Angara.TypeIdPropertyName];
            return descr(typeId, typeId);
        }
        if (Array.isArray(content))
            return descr("Seq", "array");
        var tp = typeof (content);
        if (tp === "boolean" || tp === "number" || tp === "string")
            return descr("Primitive", tp);
        if (content instanceof Date)
            return descr("Primitive", "date");
        return descr("Record", "record");
    };
    var errFailedToLoad = function (err, module) {
        var errorMessage = "Failed to load a viewer module \"" + module + "\"";
        if (err.requireType)
            errorMessage += " (" + err.requireType + ")";
        return errorMessage;
    };
    exports.Show = function (content, container) {
        $(container).addClass("angara-show-content").html("Loading...");
        var dsc = describeContent(content);
        require([dsc.module], function (viewer) {
            $(container).html("");
            return viewer.Show(content, container);
        }, function (err) {
            var module2 = null;
            if (Array.isArray(content))
                module2 = "Seq";
            else
                module2 = "Record";
            require([module2], function (viewer) {
                $(container).html("");
                return viewer.Show(content, container);
            }, function (err) {
                $(container).html(errFailedToLoad(err, dsc.module)).addClass("angara-show-errormessage");
            });
        });
        return dsc.type;
    };
});
//# sourceMappingURL=Angara.Show.js.map