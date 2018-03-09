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
    MxAObjectList.prototype.toTextFileString = function () {
        if (this.objects.length > 0) {
            var result_1 = "";
            result_1 += this.objects[0].getHeaderNormalized() + "\n\n";
            this.objects.forEach(function (obj) {
                result_1 += obj.toStringNormalized() + "\n";
            });
            return result_1;
        }
        else {
            return "No Entrys Found";
        }
    };
    return MxAObjectList;
}());
exports.MxAObjectList = MxAObjectList;
//Container for a single MendixObject
var MxAObject = /** @class */ (function () {
    function MxAObject(propertys) {
        this.normalizedLength = 60;
        this.propertys = propertys;
    }
    //Add Property to Object
    MxAObject.prototype.addProperty = function (name, value) {
        var prop = new MxAProperty(name, value);
        this.propertys[this.propertys.length] = prop;
    };
    MxAObject.prototype.getPropertyValue = function (name) {
        var value = "Property not found";
        this.propertys.forEach(function (prop) {
            if (prop.getName() == name) {
                value = prop.toString();
            }
        });
        return value;
    };
    //Serialize ObjectData
    MxAObject.prototype.toString = function () {
        var result = "";
        this.propertys.forEach(function (prop) {
            result += prop.toString() + "\t";
        });
        return result;
    };
    MxAObject.prototype.toStringNormalized = function () {
        var _this = this;
        var result = "";
        this.propertys.forEach(function (prop) {
            var delta = _this.normalizedLength - prop.toString().length;
            var str = prop.toString();
            for (var i = 0; i < delta; i++) {
                str += ' ';
            }
            result += str;
        });
        return result;
    };
    //Serialize Object Property Names
    MxAObject.prototype.getHeader = function () {
        var result = "";
        this.propertys.forEach(function (prop) {
            result += prop.getName() + "\t";
        });
        return result;
    };
    MxAObject.prototype.getHeaderNormalized = function () {
        var _this = this;
        var result = "";
        this.propertys.forEach(function (prop) {
            var delta = _this.normalizedLength - prop.getName().length;
            var str = prop.getName();
            for (var i = 0; i < delta; i++) {
                str += ' ';
            }
            result += str;
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
