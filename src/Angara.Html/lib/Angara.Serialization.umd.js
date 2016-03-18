(function(window, undefined) {
    (function(factory) {
        // Define as an AMD module if possible
        if ( typeof define === 'function' && define.amd )
        {
            // RequireJS
            define([], factory);
        }
        else if (typeof exports === 'object') {
            // Node, CommonJS-like
            module.exports = factory();
        }
        else 
            console.error("Angara.InfoSet.umd.js cannot be used without RequireJS or CommonJS");
    })
    (function() { // factory, returns map of components

var Angara;
(function (Angara) {
    var Guid = (function () {
        function Guid(id) {
            if (id.length != 36)
                throw new Error("String format must be 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' format");
            this.id = id.toLowerCase();
        }
        Guid.prototype.ToString = function () { return this.id; };
        Guid.Empty = function () {
            return Guid.emptyGuid;
        };
        Guid.NewGuid = function () {
            return new Guid(Guid.s4() + Guid.s4() + '-' + Guid.s4() + '-4' + Guid.s4().substr(0, 3) + '-' +
                Guid.s4() + '-' + Guid.s4() + Guid.s4() + Guid.s4());
        };
        Guid.s4 = function () {
            return Math
                .floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        Guid.emptyGuid = new Guid("00000000-0000-0000-0000-000000000000");
        return Guid;
    })();
    Angara.Guid = Guid;
    (function (InfoSetType) {
        InfoSetType[InfoSetType["Null"] = 0] = "Null";
        InfoSetType[InfoSetType["Bool"] = 1] = "Bool";
        InfoSetType[InfoSetType["Int"] = 2] = "Int";
        InfoSetType[InfoSetType["Double"] = 3] = "Double";
        InfoSetType[InfoSetType["String"] = 4] = "String";
        InfoSetType[InfoSetType["Raw"] = 5] = "Raw";
        InfoSetType[InfoSetType["Artefact"] = 6] = "Artefact";
        InfoSetType[InfoSetType["Map"] = 7] = "Map";
        InfoSetType[InfoSetType["DateTime"] = 8] = "DateTime";
        InfoSetType[InfoSetType["Guid"] = 9] = "Guid";
        InfoSetType[InfoSetType["BoolArray"] = 10] = "BoolArray";
        InfoSetType[InfoSetType["IntArray"] = 11] = "IntArray";
        InfoSetType[InfoSetType["DoubleArray"] = 12] = "DoubleArray";
        InfoSetType[InfoSetType["StringArray"] = 13] = "StringArray";
        InfoSetType[InfoSetType["DateTimeArray"] = 14] = "DateTimeArray";
        InfoSetType[InfoSetType["Seq"] = 15] = "Seq";
    })(Angara.InfoSetType || (Angara.InfoSetType = {}));
    var InfoSetType = Angara.InfoSetType;
    var Base64 = (function () {
        function Base64() {
        }
        Base64.b64ToUint6 = function (nChr) {
            return nChr > 64 && nChr < 91 ? nChr - 65 : nChr > 96 && nChr < 123 ? nChr - 71 : nChr > 47 && nChr < 58 ?
                nChr + 4 : nChr === 43 ? 62 : nChr === 47 ? 63 : 0;
        };
        Base64.Decode = function (base64) {
            var s = window.atob(base64);
            var result = new Uint8Array(s.length);
            for (var i = 0; i < result.byteLength; i++)
                result[i] = s.charCodeAt(i);
            return result;
        };
        Base64.Encode = function (arr) {
            var view = new DataView(arr.buffer);
            var binary = '';
            for (var i = 0; i < view.byteLength; i++)
                binary += String.fromCharCode(view.getUint8(i));
            return window.btoa(binary);
        };
        return Base64;
    })();
    Angara.TypeIdPropertyName = "__angara_typeId";
    var InfoSet = (function () {
        function InfoSet(t, v) {
            this.t = t;
            this.v = v;
        }
        Object.defineProperty(InfoSet.prototype, "Type", {
            get: function () { return this.t; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InfoSet, "EmptyMap", {
            get: function () { return new InfoSet(InfoSetType.Map, {}); },
            enumerable: true,
            configurable: true
        });
        InfoSet.prototype.AddInfoSet = function (p, i) {
            if (this.t == InfoSetType.Map) {
                this.v[p] = i;
                return this;
            }
            else
                throw new Error("Can add properties only to Map or Artefact");
        };
        InfoSet.prototype.AddInt = function (p, n) { return this.AddInfoSet(p, InfoSet.Int(n)); };
        InfoSet.prototype.AddString = function (p, s) { return this.AddInfoSet(p, InfoSet.String(s)); };
        InfoSet.prototype.AddBool = function (p, b) { return this.AddInfoSet(p, InfoSet.Bool(b)); };
        InfoSet.prototype.AddDateTime = function (p, d) { return this.AddInfoSet(p, InfoSet.DateTime(d)); };
        InfoSet.prototype.AddDouble = function (p, n) { return this.AddInfoSet(p, InfoSet.Double(n)); };
        InfoSet.prototype.AddGuid = function (p, g) { return this.AddInfoSet(p, InfoSet.Guid(g)); };
        InfoSet.prototype.AddIntArray = function (p, inta) { return this.AddInfoSet(p, InfoSet.IntArray(inta)); };
        InfoSet.prototype.AddStringArray = function (p, sa) { return this.AddInfoSet(p, InfoSet.StringArray(sa)); };
        InfoSet.prototype.AddBoolArray = function (p, ba) { return this.AddInfoSet(p, InfoSet.BoolArray(ba)); };
        InfoSet.prototype.AddDateTimeArray = function (p, da) { return this.AddInfoSet(p, InfoSet.DateTimeArray(da)); };
        InfoSet.prototype.AddDoubleArray = function (p, da) { return this.AddInfoSet(p, InfoSet.DoubleArray(da)); };
        InfoSet.prototype.AddSeq = function (p, s) { return this.AddInfoSet(p, InfoSet.Seq(s)); };
        InfoSet.prototype.ToNull = function () {
            if (this != null && this.t != InfoSetType.Null)
                throw new Error("Null value expected");
            return null;
        };
        InfoSet.prototype.ToBool = function () {
            if (this.t != InfoSetType.Bool)
                throw new Error("Boolean value expected");
            return this.v;
        };
        InfoSet.prototype.ToInt = function () {
            if (this.t != InfoSetType.Int)
                throw new Error("Int value expected");
            return this.v;
        };
        InfoSet.prototype.ToDouble = function () {
            if (this.t != InfoSetType.Int && this.t != InfoSetType.Double)
                throw new Error("Double value expected");
            return this.v;
        };
        InfoSet.prototype.ToString = function () {
            if (this.t != InfoSetType.String)
                throw new Error("String value expected");
            return this.v;
        };
        InfoSet.prototype.ToRaw = function () {
            switch (this.t) {
                case InfoSetType.Artefact:
                    throw new Error("Cannot convert InfoSet with Artefacts to raw representation because it loses type information");
                case InfoSetType.Map:
                    var result = {};
                    var map = (this.v);
                    for (var p in map)
                        result[p] = map[p].ToRaw();
                    return result;
                case InfoSetType.Seq:
                    var arr = (this.v);
                    return arr.map(function (v) { return v.ToRaw(); });
                case InfoSetType.Guid:
                    var guid = (this.v);
                    return guid.ToString();
                default:
                    return this.v;
            }
        };
        InfoSet.prototype.ToGuid = function () {
            if (this.t != InfoSetType.Guid)
                throw new Error("Guid value expected");
            return this.v;
        };
        InfoSet.prototype.ToMap = function () {
            if (this.t != InfoSetType.Map)
                throw new Error("Map value expected");
            return this.v;
        };
        InfoSet.prototype.ToArtefact = function () {
            if (this.t != InfoSetType.Artefact)
                throw new Error("Artefact value expected");
            var typeId = (this.v[0]);
            var content = (this.v[1]);
            return { TypeId: typeId, Content: content };
        };
        InfoSet.prototype.ToDateTime = function () {
            if (this.t != InfoSetType.DateTime)
                throw new Error("DateTime value expected");
            return this.v;
        };
        InfoSet.prototype.ToBoolArray = function () {
            if (this.t != InfoSetType.BoolArray)
                throw new Error("Array of booleans expected");
            return this.v;
        };
        InfoSet.prototype.ToIntArray = function () {
            if (this.t != InfoSetType.IntArray)
                throw new Error("Array of integers expected");
            return this.v;
        };
        InfoSet.prototype.ToDoubleArray = function () {
            if (this.t != InfoSetType.DoubleArray && this.t != InfoSetType.IntArray)
                throw new Error("Array of doubles expected");
            return this.v;
        };
        InfoSet.prototype.ToStringArray = function () {
            if (this.t != InfoSetType.StringArray)
                throw new Error("Array of strings expected");
            return this.v;
        };
        InfoSet.prototype.ToDateTimeArray = function () {
            if (this.t != InfoSetType.DateTimeArray)
                throw new Error("Array of DateTime expected");
            return this.v;
        };
        InfoSet.prototype.ToSeq = function () {
            if (this.t != InfoSetType.Seq)
                throw new Error("Sequence expected");
            return this.v;
        };
        Object.defineProperty(InfoSet.prototype, "IsBool", {
            get: function () { return this.t == InfoSetType.Bool; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InfoSet.prototype, "IsInt", {
            get: function () { return this.t == InfoSetType.Int; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InfoSet.prototype, "IsDouble", {
            get: function () { return this.t == InfoSetType.Double; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InfoSet.prototype, "IsString", {
            get: function () { return this.t == InfoSetType.String; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InfoSet.prototype, "IsRaw", {
            get: function () { return this.t == InfoSetType.Raw; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InfoSet.prototype, "IsGuid", {
            get: function () { return this.t == InfoSetType.Guid; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InfoSet.prototype, "IsArtefact", {
            get: function () { return this.t == InfoSetType.Artefact; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InfoSet.prototype, "IsMap", {
            get: function () { return this.t == InfoSetType.Map; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InfoSet.prototype, "IsDateTime", {
            get: function () { return this.t == InfoSetType.DateTime; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InfoSet.prototype, "IsBoolArray", {
            get: function () { return this.t == InfoSetType.BoolArray; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InfoSet.prototype, "IsIntArray", {
            get: function () { return this.t == InfoSetType.IntArray; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InfoSet.prototype, "IsDoubleArray", {
            get: function () { return this.t == InfoSetType.DoubleArray; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InfoSet.prototype, "IsStringArray", {
            get: function () { return this.t == InfoSetType.StringArray; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InfoSet.prototype, "IsDateTimeArray", {
            get: function () { return this.t == InfoSetType.DateTimeArray; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InfoSet.prototype, "IsSeq", {
            get: function () { return this.t == InfoSetType.Seq; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InfoSet.prototype, "IsNull", {
            get: function () { return this.t == InfoSetType.Null; },
            enumerable: true,
            configurable: true
        });
        InfoSet.Null = function () { return new InfoSet(InfoSetType.Null, null); };
        InfoSet.Bool = function (b) { return new InfoSet(InfoSetType.Bool, b); };
        InfoSet.Int = function (n) { return new InfoSet(InfoSetType.Int, n); };
        InfoSet.Double = function (n) { return new InfoSet(InfoSetType.Double, n); };
        InfoSet.DoubleArray = function (d) { return new InfoSet(InfoSetType.DoubleArray, d); };
        InfoSet.String = function (s) { return new InfoSet(InfoSetType.String, s); };
        InfoSet.Raw = function (r) { return new InfoSet(InfoSetType.Raw, r); };
        InfoSet.Guid = function (g) { return new InfoSet(InfoSetType.Guid, g); };
        InfoSet.Artefact = function (typeId, content) { return new InfoSet(InfoSetType.Artefact, [typeId, content]); };
        InfoSet.Map = function (m) { return new InfoSet(InfoSetType.Map, m); };
        InfoSet.DateTime = function (d) { return new InfoSet(InfoSetType.DateTime, d); };
        InfoSet.BoolArray = function (b) { return new InfoSet(InfoSetType.BoolArray, b); };
        InfoSet.IntArray = function (n) { return new InfoSet(InfoSetType.IntArray, n); };
        InfoSet.StringArray = function (s) { return new InfoSet(InfoSetType.StringArray, s); };
        InfoSet.DateTimeArray = function (d) { return new InfoSet(InfoSetType.DateTimeArray, d); };
        InfoSet.Seq = function (s) { return new InfoSet(InfoSetType.Seq, s); };
        InfoSet.EncodeNameAndType = function (n, t) {
            n = n.replace(":", "::");
            return t == null ? n : n + ":" + t;
        };
        InfoSet.DecodeNameAndType = function (s) {
            var idx = s.lastIndexOf(":");
            if (idx == 0 || idx > 0 && s[idx - 1] != ':')
                return [s.substr(0, idx).replace("::", ":"), s.substr(idx + 1)];
            else
                return [s.replace("::", ":"), null];
        };
        InfoSet.Encode = function (i) {
            if (i == null || i.IsNull)
                return [null, null];
            if (i.IsBool)
                return [i.v, null];
            else if (i.IsDateTime)
                return [i.v, "datetime"];
            else if (i.IsInt)
                return [i.v, "int"];
            else if (i.IsDouble)
                return [i.v, null];
            else if (i.IsString)
                return [i.v, null];
            else if (i.IsRaw)
                return [i.v, null];
            else if (i.IsGuid)
                return [i.v.ToString(), "guid"];
            else if (i.IsArtefact) {
                var result = i.v;
                return [InfoSet.Encode(result[1])[0], result[0]];
            }
            else if (i.IsBoolArray) {
                var arr = new Array();
                var boolarr = i.v;
                for (var k = 0; k < boolarr.length; k++)
                    arr[k] = boolarr[k] ? 1 : 0;
                return [Base64.Encode(typeof i.v == "Int8Array" ? i.v : new Int8Array(arr)), "bool array"];
            }
            else if (i.IsIntArray)
                return [Base64.Encode(typeof i.v == "Int32Array" ? i.v : new Int32Array(i.v)), "int array"];
            else if (i.IsDoubleArray)
                return [Base64.Encode(typeof i.v == "Float64Array" ? i.v : new Float64Array(i.v)), "double array"];
            else if (i.IsStringArray) {
                return [i.v, i.v.length == 0 ? "string array" : null];
            }
            else if (i.IsDateTimeArray) {
                var arr = new Array();
                var datearr = i.v;
                for (var k = 0; k < datearr.length; k++)
                    arr[k] = datearr[k].valueOf();
                return [Base64.Encode(typeof i.v == "Float64Array" ? i.v : new Float64Array(arr)), "datetime array"];
            }
            else if (i.IsSeq) {
                var seq = i.v;
                return [seq.map(function (i) { return InfoSet.Marshal(i); }), null];
            }
            else if (i.IsMap) {
                var res = {};
                for (var p in i.v) {
                    var encoded = InfoSet.Encode(i.v[p]);
                    var key = InfoSet.EncodeNameAndType(p, encoded[1]);
                    res[key] = encoded[0];
                }
                return [res, null];
            }
        };
        InfoSet.Marshal = function (i) {
            var encoded = InfoSet.Encode(i);
            if (encoded[1] == null)
                return encoded[0];
            else {
                var r = {};
                r[InfoSet.EncodeNameAndType("", encoded[1])] = encoded[0];
                return r;
            }
        };
        InfoSet.Unmarshal = function (t) {
            var infoSet = InfoSet.Decode([t, null]);
            if (infoSet.IsMap) {
                var map = infoSet.ToMap();
                var names = [];
                var k = 0;
                for (var p in map) {
                    names[k] = p;
                    k++;
                }
                if (names.length == 1 && names[0] == "") {
                    return map[""];
                }
                else {
                    return infoSet;
                }
            }
            else
                return infoSet;
        };
        InfoSet.DecodeMap = function (json) {
            var map = InfoSet.EmptyMap;
            for (var p in json) {
                var nameType = InfoSet.DecodeNameAndType(p);
                map = map.AddInfoSet(nameType[0], InfoSet.Decode([json[p], nameType[1]]));
            }
            return map;
        };
        InfoSet.Decode = function (t) {
            var json = t[0];
            var typeId = t[1];
            if (json == null)
                return InfoSet.Null();
            else if (typeId == "int")
                return InfoSet.Int(json);
            else if (typeId == "datetime")
                return InfoSet.DateTime(json);
            else if (typeId == "guid")
                return InfoSet.Guid(new Guid(json));
            else if (typeId == "int array")
                return InfoSet.IntArray(new Int32Array(Base64.Decode(json).buffer));
            else if (typeId == "string array")
                return InfoSet.StringArray(json);
            else if (typeId == "datetime array") {
                var arrd = new Array();
                var int32arr = new Float64Array(Base64.Decode(json).buffer);
                for (var k = 0; k < int32arr.length; k++)
                    arrd[k] = new Date(int32arr[k]);
                return InfoSet.DateTimeArray(arrd);
            }
            else if (typeId == "bool array") {
                var arr = new Array();
                var int8arr = new Int8Array(Base64.Decode(json).buffer);
                for (var k = 0; k < int8arr.length; k++)
                    arr[k] = int8arr[k] == 1 ? true : false;
                return InfoSet.BoolArray(arr);
            }
            else if (typeId == "double array")
                return InfoSet.DoubleArray(new Float64Array(Base64.Decode(json).buffer));
            else if (typeId == "array") {
                var length = json.length;
                var a = new Array(length);
                for (var i = 0; i < length; i++)
                    a[i] = InfoSet.Unmarshal(json[i]);
                return InfoSet.Seq(a);
            }
            else if (typeId != null) {
                var typeEnd = typeId.split(" ");
                if (typeEnd.length > 0 && typeEnd[typeEnd.length - 1] == "array") {
                    return InfoSet.Artefact(typeId, InfoSet.Decode([json, "array"]));
                }
                else
                    return InfoSet.Artefact(typeId, InfoSet.Decode([json, null]));
            }
            else if (typeof json == "boolean")
                return InfoSet.Bool(json);
            else if (typeof json == "number")
                return InfoSet.Double(json);
            else if (typeof json == "string")
                return InfoSet.String(json);
            else if (json instanceof Array) {
                var objs = json;
                var allStrings = objs.every(function (s) { return typeof (s) === "string"; });
                if (allStrings && objs.length > 0)
                    return InfoSet.StringArray(objs);
                else
                    return InfoSet.Seq(objs.map(function (i) { return InfoSet.Unmarshal(i); }));
            }
            else if (typeof json == "object") {
                return InfoSet.DecodeMap(json);
            }
            else
                throw new Error("Unsupported object type " + typeof json);
        };
        InfoSet.Deserialize = function (is) {
            if (is.IsNull) {
                return null;
            }
            if (is.IsBool) {
                return is.ToBool();
            }
            if (is.IsDouble) {
                return is.ToDouble();
            }
            if (is.IsInt) {
                return is.ToInt();
            }
            if (is.IsString) {
                return is.ToString();
            }
            if (is.IsDateTime) {
                return is.ToDateTime();
            }
            if (is.IsRaw) {
                return is.ToRaw();
            }
            if (is.IsGuid) {
                return is.ToGuid().ToString();
            }
            if (is.IsBoolArray) {
                return is.ToBoolArray();
            }
            if (is.IsDoubleArray) {
                return is.ToDoubleArray();
            }
            if (is.IsIntArray) {
                return is.ToIntArray();
            }
            if (is.IsStringArray) {
                return is.ToStringArray();
            }
            if (is.IsDateTimeArray) {
                return is.ToDateTimeArray();
            }
            if (is.IsMap) {
                var map = is.ToMap();
                var obj = {};
                for (var key in map) {
                    obj[key] = InfoSet.Deserialize(map[key]);
                }
                return obj;
            }
            if (is.IsArtefact) {
                var artefact = is.ToArtefact();
                var artCont = InfoSet.Deserialize(artefact.Content);
                artCont[Angara.TypeIdPropertyName] = artefact.TypeId;
                return artCont;
            }
            if (is.IsSeq) {
                var seq = is.ToSeq();
                var objArr = new Array(seq.length);
                for (var i = 0; i < seq.length; i++) {
                    objArr[i] = InfoSet.Deserialize(seq[i]);
                }
                return objArr;
            }
            throw "Unknown type of InfoSet";
        };
        return InfoSet;
    })();
    Angara.InfoSet = InfoSet;
})(Angara || (Angara = {}));

      return {
          "Guid" : Angara.Guid, 
          "InfoSetType" : Angara.InfoSetType,
          "InfoSet" : Angara.InfoSet,
          "TypeIdPropertyName" : Angara.TypeIdPropertyName };
   }); // end of the factory function
}(window));