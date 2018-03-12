"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//ClassContainer for a List of OutputObjects
var MxAOutputObjectList = /** @class */ (function () {
    function MxAOutputObjectList() {
        this.propertylength = 20; //Length of columns for TextFile Output
        this.objects = new Array();
    }
    //Add Object to Container
    MxAOutputObjectList.prototype.addObject = function (object) {
        this.objects[this.objects.length] = object;
    };
    //Serialize Container Objects
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
    return MxAOutputObjectList;
}());
exports.MxAOutputObjectList = MxAOutputObjectList;
//Container for a single MendixObject
var MxAOutputObject = /** @class */ (function () {
    function MxAOutputObject(propertys) {
        this.propertys = propertys;
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
    //Serialize ObjectData
    MxAOutputObject.prototype.toString = function () {
        var result = "";
        this.propertys.forEach(function (prop) {
            result += prop.toString() + "\t";
        });
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
