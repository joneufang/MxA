"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//ClassContainer for a List of MendixObjects
var MxAObjectList = /** @class */ (function () {
    function MxAObjectList() {
        this.objects = new Array();
    }
    //Add Object to Container
    MxAObjectList.prototype.addObject = function (object) {
        this.objects[this.objects.length] = object;
    };
    //Serialize Container Objects
    MxAObjectList.prototype.toString = function () {
        var result = "";
        result += this.objects[0].getheader() + "\n";
        this.objects.forEach(function (obj) {
            result += obj.toString() + "\n";
        });
        return result;
    };
    return MxAObjectList;
}());
exports.MxAObjectList = MxAObjectList;
//Container for a single MendixObject
var MxAObject = /** @class */ (function () {
    function MxAObject(propertys) {
        this.propertys = propertys;
    }
    //Add Property to Object
    MxAObject.prototype.addProperty = function (name, value) {
        var prop = new MxAProperty(name, value);
        this.propertys[this.propertys.length] = prop;
    };
    //Serialize ObjectData
    MxAObject.prototype.toString = function () {
        var result = "";
        this.propertys.forEach(function (prop) {
            result += prop.toString() + "\t";
        });
        return result;
    };
    //Serialize Object Property Names
    MxAObject.prototype.getheader = function () {
        var result = "";
        this.propertys.forEach(function (prop) {
            result += prop.getName() + "\t";
        });
        return result;
    };
    return MxAObject;
}());
exports.MxAObject = MxAObject;
//Container for a single MendixProperty
var MxAProperty = /** @class */ (function () {
    function MxAProperty(name, value) {
        this.name = name;
        this.value = value;
    }
    //getName of Property
    MxAProperty.prototype.getName = function () {
        return this.name;
    };
    //getValue of Property
    MxAProperty.prototype.toString = function () {
        return this.value;
    };
    return MxAProperty;
}());
exports.MxAProperty = MxAProperty;
