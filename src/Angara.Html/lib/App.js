require.config({
    paths: {
        "Chart": "angara.chartjs/dist/Chart",
        "tableViewer": "TableViewer/tableViewer",
        "jquery.dataTables": "DataTables/jquery.dataTables",
        "jquery.dataTables-css": "DataTables/jquery.dataTables",
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