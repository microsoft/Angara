define(['./Angara.Show', './angara.serializationjs/Angara.Serialization.umd', 'domReady!'], function (Angara, Marshalling, document) {
    var viewer = document.getElementById("viewer");    
    var content_is = Marshalling.InfoSet.Unmarshal(content);
    var content_des = Marshalling.InfoSet.Deserialize(content_is);
    return Angara.Show(content_des, viewer);
});