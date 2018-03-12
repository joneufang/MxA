"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var mendixmodelsdk_1 = require("mendixmodelsdk");
var MxAO = require("./MxAOutputObject");
var qrycons = require("./QueryConstants");
var MxAObjectAdapter = /** @class */ (function () {
    function MxAObjectAdapter() {
    }
    MxAObjectAdapter.prototype.getId = function (object) {
        var property;
        property = new MxAO.MxAOutputObjectProperty("ID", object.id);
        return property;
    };
    MxAObjectAdapter.prototype.getType = function (object) {
        var property;
        property = new MxAO.MxAOutputObjectProperty("Type", object.structureTypeName);
        return property;
    };
    MxAObjectAdapter.prototype.getContainer = function (object) {
        var property;
        var container = "Kein Container";
        try {
            var fbase = object.container;
            if (fbase instanceof mendixmodelsdk_1.projects.Folder) {
                var folder = fbase;
                container = folder.name;
            }
            else if (fbase instanceof mendixmodelsdk_1.projects.Module) {
                var modul = fbase;
                container = modul.name;
            }
        }
        catch (_a) {
        }
        property = new MxAO.MxAOutputObjectProperty("Container", container);
        return property;
    };
    MxAObjectAdapter.prototype.filter = function (mxaobject, qryfilterTypes, qryfilterValues) {
        var filtered = true;
        var filtercount = 0;
        qryfilterTypes.forEach(function (qryfilter) {
            var regex = qryfilterValues[filtercount];
            var value = mxaobject.getPropertyValue(qryfilter);
            if (!(value.match(regex) || regex == value)) {
                filtered = false;
            }
            filtercount++;
        });
        return filtered;
    };
    return MxAObjectAdapter;
}());
exports.MxAObjectAdapter = MxAObjectAdapter;
var MxADocumentAdapter = /** @class */ (function (_super) {
    __extends(MxADocumentAdapter, _super);
    function MxADocumentAdapter() {
        return _super.call(this) || this;
    }
    MxADocumentAdapter.prototype.getPropertys = function (document, qrypropertys) {
        var _this = this;
        var propertys = new Array();
        qrypropertys.forEach(function (qryprop) {
            if (qryprop == qrycons.documents.propertys.ID) {
                propertys[propertys.length] = _this.getId(document);
            }
            else if (qryprop == qrycons.documents.propertys.NAME) {
                propertys[propertys.length] = _this.getName(document);
            }
            else if (qryprop == qrycons.documents.propertys.TYPE) {
                propertys[propertys.length] = _this.getType(document);
            }
            else if (qryprop == qrycons.documents.propertys.CONTAINER) {
                propertys[propertys.length] = _this.getContainer(document);
            }
            else if (qryprop == qrycons.documents.propertys.DOCUMENTATION) {
                propertys[propertys.length] = _this.getDocumentation(document);
            }
            else {
                propertys[propertys.length] = new MxAO.MxAOutputObjectProperty("Unknown Property", "Value of Unknown Property");
            }
        });
        return propertys;
    };
    MxADocumentAdapter.prototype.getName = function (document) {
        var property;
        property = new MxAO.MxAOutputObjectProperty("Name", document.qualifiedName);
        return property;
    };
    MxADocumentAdapter.prototype.getDocumentation = function (document) {
        var property;
        property = new MxAO.MxAOutputObjectProperty("Documentation", "No Value");
        if (document.isLoaded) {
            property = new MxAO.MxAOutputObjectProperty("Documentation", document.documentation);
        }
        return property;
    };
    return MxADocumentAdapter;
}(MxAObjectAdapter));
exports.MxADocumentAdapter = MxADocumentAdapter;
