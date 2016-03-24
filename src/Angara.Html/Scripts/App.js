require.config({
    paths: {
        "Angara.Serialization.umd": "angara.serializationjs/dist/Angara.Serialization.umd",
        "Chart": "angara.chartjs/dist/Chart",
        "Table": "angara.tablejs/dist/Table",
        "angara.tablejs": "angara.tablejs/dist/angara.tablejs",
        "jquery.dataTables": "DataTables/media/js/jquery.dataTables",
        "jquery.dataTables-css": "DataTables/media/css/jquery.dataTables",
        "chartViewer.umd": "idd/dist/chartViewer.umd",
        "chartViewer-css": "idd/dist/chartViewer",
        "idd": "idd/dist/idd",
        "idd-css": "idd/dist/idd",
        "domReady": "domReady/domReady",
        "jquery": "jquery/dist/jquery.min",
        "jquery-ui": "jquery-ui/jquery-ui.min",
        "css": "require-css/css.min",
        "rx": "rxjs/dist/rx.lite.min"
    }
});

require(["Main"]);