$(function () {

    function updateConsole() {
        var content = $("#html-console-content");
        var timestamp = parseInt(content.attr("data-timestamp"));
        $.ajax({
            url: "updates?t=" + timestamp,
            cache: false
        }).done(function (updates) {
            //window.alert("updates?t=" + timestamp + "; " + updates.length);
            for (var i = 0; i < updates.length; i++) {
                var id = updates[i].id;
                var text = updates[i].text;
                var div = $("#" + id);
                if (div.length == 0)
                    content.append($("<div>" + text + "</div>").attr("id", id));
                else
                    div.html(text);
            }
            content.attr("data-timestamp", timestamp + updates.length);            
            window.setTimeout(updateConsole, 1000);
        }).fail(function (jqXHR, statusText) {
            if (jqXHR.readyState == 0 && jqXHR.status == 0) {
                $("#html-console-errorPopup").show();
            } else {
                console.log(statusText);            
                window.setTimeout(updateConsole, 1000);
            }
        });
    }

    updateConsole();
})
