"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var XMLWriter = require("xml-writer");
//ClassContainer for a List of OutputObjects
var MxAOutputObjectList = /** @class */ (function () {
    function MxAOutputObjectList() {
        //Constants to define output target
        this.TEXTFILE = "TEXTFILE";
        this.HTMLTABLE = "HTMLTABLE";
        this.XML = "XML";
        this.JSON = "JSON";
        this.propertylength = 20; //Length of columns for TextFile Output
        this.objects = new Array();
    }
    //Add Object to Container
    MxAOutputObjectList.prototype.addObject = function (object) {
        this.objects[this.objects.length] = object;
    };
    //Sorts all Objects in Container in column order given
    MxAOutputObjectList.prototype.sort = function (sortcolumns) {
        //console.log("Sort got " + sortcolumns);
        var sortingscount = sortcolumns.length;
        for (var i = (sortingscount - 1); i >= 0; i--) {
            var column = sortcolumns[i];
            this.sortColumn(column);
        }
        //Sorting need to be implemented !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        return this;
    };
    MxAOutputObjectList.prototype.sortColumn = function (column) {
        //console.log("Sort Columns got " + column);
        for (var i = 0; i < this.objects.length; i++) {
            //console.log(this.objects[i].getPropertyValue(column));
            for (var j = 1; j < this.objects.length; j++) {
                if (this.objects[j - 1].getPropertyValue(column) > this.objects[j].getPropertyValue(column)) {
                    //Tausch
                    var temp = this.objects[j];
                    this.objects[j] = this.objects[j - 1];
                    this.objects[j - 1] = temp;
                }
            }
        }
    };
    //Serialize Container Objects for a TextFile
    MxAOutputObjectList.prototype.toTextFileString = function () {
        var _this = this;
        if (this.objects.length > 0) {
            var result_1 = "";
            this.objects.forEach(function (obj) {
                if (obj.getLongestPropertySize() > _this.propertylength - 3) {
                    _this.propertylength = obj.getLongestPropertySize() + 3;
                }
            });
            result_1 += this.objects[0].getHeaderNormalized(this.propertylength) + "\n\n";
            this.objects.forEach(function (obj) {
                result_1 += obj.toStringNormalized(_this.propertylength) + "\n";
            });
            return result_1;
        }
        else {
            return "No Entrys Found";
        }
    };
    //Serialize Container Objects for a XMLFile
    MxAOutputObjectList.prototype.toXMLFileString = function () {
        var xml = new XMLWriter();
        if (this.objects.length > 0) {
            xml.startDocument();
            xml.startElement("MxACatalog");
            this.objects.forEach(function (obj) {
                xml.startElement(obj.getType());
                xml = obj.toXMLString(xml);
                xml.endElement();
            });
            xml.endElement();
            xml.endDocument();
            return xml.toString();
        }
        else {
            return "No Entrys Found";
        }
    };
    MxAOutputObjectList.prototype.toJSONFileString = function () {
        var result = "";
        var objectcounter = 0;
        if (this.objects.length > 0) {
            result += "{\n";
            result += "\"MxACatalog\": {\n";
            for (var i = 0; i < this.objects.length; i++) {
                result += "\"" + this.objects[i].getType() + objectcounter + "\": {";
                objectcounter += 1;
                result += this.objects[i].toJSONString();
                if (i < this.objects.length - 1) {
                    result += "},\n";
                }
                else {
                    result += "}\n";
                }
            }
            result += "}\n";
            result += "}\n";
            return result;
        }
        else {
            return "No Entrys Found";
        }
    };
    //Gives out OutputObjectList
    MxAOutputObjectList.prototype.returnResult = function (resultType, target) {
        if (resultType == this.TEXTFILE) {
            fs.outputFile(target, this.toTextFileString());
        } //Add ResultTypes Here
        else if (resultType == this.XML) {
            fs.outputFile(target, this.toXMLFileString());
        }
        else if (resultType == this.HTMLTABLE) {
            fs.outputFile(target, "ReturnFormat HTML not implemented yet");
        }
        else if (resultType == this.JSON) {
            //fs.outputFile(target, "ReturnFormat JSON not implemented yet");
            fs.outputFile(target, this.toJSONFileString());
        }
        else {
            console.log("Wrong ResultType");
        }
    };
    return MxAOutputObjectList;
}());
exports.MxAOutputObjectList = MxAOutputObjectList;
//Container for a single MendixObject
var MxAOutputObject = /** @class */ (function () {
    function MxAOutputObject(propertys, type) {
        this.propertys = propertys;
        this.type = type;
    }
    //Add Property to Object
    MxAOutputObject.prototype.addProperty = function (name, value) {
        var prop = new MxAOutputObjectProperty(name, value);
        this.propertys[this.propertys.length] = prop;
    };
    //Get Value of given property
    MxAOutputObject.prototype.getPropertyValue = function (name) {
        var value = "Property not found";
        this.propertys.forEach(function (prop) {
            if (prop.getName() == name) {
                value = prop.toString();
            }
        });
        return value;
    };
    MxAOutputObject.prototype.getType = function () {
        return this.type;
    };
    //Serialize ObjectData
    MxAOutputObject.prototype.toString = function () {
        var result = "";
        this.propertys.forEach(function (prop) {
            result += prop.toString() + "\t";
        });
        return result;
    };
    //Serialzie ObjectData to XML
    MxAOutputObject.prototype.toXMLString = function (xml) {
        this.propertys.forEach(function (prop) {
            xml.startElement(prop.getName());
            xml.text(prop.toString());
            xml.endElement();
        });
        return xml;
    };
    MxAOutputObject.prototype.toJSONString = function () {
        var result = "";
        result;
        for (var i = 0; i < this.propertys.length; i++) {
            if (i < this.propertys.length - 1) {
                result += "\"" + this.propertys[i].getName() + "\": \"" + this.propertys[i].toString() + "\",";
            }
            else {
                result += "\"" + this.propertys[i].getName() + "\": \"" + this.propertys[i].toString() + "\"";
            }
        }
        return result;
    };
    //Serialize ObjectData with Column length size for TextFile Output
    MxAOutputObject.prototype.toStringNormalized = function (size) {
        var result = "";
        this.propertys.forEach(function (prop) {
            var delta = size - prop.toString().length;
            var str = prop.toString();
            for (var i = 0; i < delta; i++) {
                str += ' ';
            }
            result += str;
        });
        return result;
    };
    //Serialize Object Property Names
    MxAOutputObject.prototype.getHeader = function () {
        var result = "";
        this.propertys.forEach(function (prop) {
            result += prop.getName() + "\t";
        });
        return result;
    };
    //Serialize Object Property Names with Column length size for TextFile Output
    MxAOutputObject.prototype.getHeaderNormalized = function (size) {
        var result = "";
        this.propertys.forEach(function (prop) {
            var delta = size - prop.getName().length;
            var str = prop.getName();
            for (var i = 0; i < delta; i++) {
                str += ' ';
            }
            result += str;
        });
        return result;
    };
    //gets Length of the longest property in the Object
    MxAOutputObject.prototype.getLongestPropertySize = function () {
        var size = 0;
        this.propertys.forEach(function (prop) {
            if (prop.toString().length > size) {
                size = prop.toString().length;
            }
        });
        return size;
    };
    return MxAOutputObject;
}());
exports.MxAOutputObject = MxAOutputObject;
//Container for a single MendixProperty
var MxAOutputObjectProperty = /** @class */ (function () {
    function MxAOutputObjectProperty(name, value) {
        this.name = name;
        this.value = value;
    }
    //getName of Property
    MxAOutputObjectProperty.prototype.getName = function () {
        return this.name;
    };
    //getValue of Property
    MxAOutputObjectProperty.prototype.toString = function () {
        return this.value;
    };
    return MxAOutputObjectProperty;
}());
exports.MxAOutputObjectProperty = MxAOutputObjectProperty;
