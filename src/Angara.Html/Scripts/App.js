require.config({
    paths: {
        "Angara.Serialization.umd": "angara.serializationjs/dist/Angara.Serialization.umd",
        "Chart": "angara.chartjs/dist/Chart",
        "Table": "angara.tablejs/dist/Table",
        "TableView": "angara.tablejs/dist/TableView",
        "angara.tablejs": "angara.tablejs/dist/angara.tablejs",
        "jquery.dataTables": "datatables.net-dt/media/js/jquery.dataTables",
        "jquery.dataTables-css": "datatables.net-dt/media/css/jquery.dataTables",
        "idd": "interactive-data-display/dist/idd.umd",
        "idd.umd": "interactive-data-display/dist/idd.umd",
        "idd-css": "interactive-data-display/dist/idd.umd",
        "domReady": "domReady/domReady",
        "jquery": "jquery/dist/jquery.min",
        "jquery-ui": "jqueryui/jquery-ui.min",
        "css": "require-css/css.min",
        "rx": "rx/dist/rx.lite.min",
        "svg": "svg.js/dist/svg.min",
        "filesaver": "file-saver/FileSaver.min",
        "jquery-mousewheel": "jquery-mousewheel/jquery.mousewheel"
    }
});

require(["Main"]);