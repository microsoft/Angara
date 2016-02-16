require.config({
    paths: {
        "tableViewer": "TableViewer/tableViewer",
        "jquery.dataTables": "DataTables/jquery.dataTables",
        "jquery.dataTables-css": "DataTables/jquery.dataTables",
        "chartViewer.umd": "idd/chartViewer.umd",
        "chartViewer-css": "idd/chartViewer",
        "idd": "idd/idd",
        "idd-css": "idd/idd",
        "domReady": "domReady/domReady",
        "jquery": "jquery/jquery",
        "jquery-ui": "jquery-ui/jquery-ui",
        "css": "require-css/css",
        "rx": "rxjs/rx.lite.min"
    }
});

require(["Main"]);