"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MxAObjectList = /** @class */ (function () {
    function MxAObjectList() {
        this.objects = new Array();
    }
    MxAObjectList.prototype.addObject = function (propertys) {
        var obj = new MxAObject();
        propertys.forEach(function (prop) {
            obj.addProperty(prop.getName(), prop.toString());
        });
        this.objects[this.objects.length] = obj;
    };
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
var MxAObject = /** @class */ (function () {
    function MxAObject() {
        this.propertys = new Array();
    }
    MxAObject.prototype.addProperty = function (name, value) {
        var prop = new MxAProperty(name, value);
        this.propertys[this.propertys.length] = prop;
    };
    MxAObject.prototype.toString = function () {
        var result = "";
        this.propertys.forEach(function (prop) {
            result += prop.toString() + "\t";
        });
        return result;
    };
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
var MxAProperty = /** @class */ (function () {
    function MxAProperty(name, value) {
        this.name = name;
        this.value = value;
    }
    MxAProperty.prototype.getName = function () {
        return this.name;
    };
    MxAProperty.prototype.toString = function () {
        return this.value;
    };
    return MxAProperty;
}());
exports.MxAProperty = MxAProperty;
