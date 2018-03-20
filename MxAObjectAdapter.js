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
//Adapter to get propertys and filter Mendix Objects
var MxAStructureAdapter = /** @class */ (function () {
    function MxAStructureAdapter() {
    }
    //Get Id of Mendix Object
    MxAStructureAdapter.prototype.getId = function (structure) {
        var property;
        property = new MxAO.MxAOutputObjectProperty("ID", structure.id);
        return property;
    };
    //Get Type of Mendix Object
    MxAStructureAdapter.prototype.getType = function (structure) {
        var property;
        property = new MxAO.MxAOutputObjectProperty("TYPE", structure.structureTypeName);
        return property;
    };
    //Get Container of Mendix Object
    MxAStructureAdapter.prototype.getContainer = function (structure) {
        var property;
        var container = "Kein Container";
        try {
            var fbase = structure.container;
            if (fbase instanceof mendixmodelsdk_1.projects.Folder) {
                var folder = fbase;
                container = folder.name;
            }
            else if (fbase instanceof mendixmodelsdk_1.projects.Module) {
                var modul = fbase;
                container = modul.name;
            }
        }
        catch (error) {
        }
        property = new MxAO.MxAOutputObjectProperty("CONTAINER", container);
        return property;
    };
    //Filters Output Object
    //Returns true if Object passes all filters
    MxAStructureAdapter.prototype.filter = function (mxaobject, qryfilterTypes, qryfilterValues) {
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
    return MxAStructureAdapter;
}());
exports.MxAStructureAdapter = MxAStructureAdapter;
//Adapter to get propertys of Mendix Documents
var MxADocumentAdapter = /** @class */ (function (_super) {
    __extends(MxADocumentAdapter, _super);
    function MxADocumentAdapter() {
        return _super.call(this) || this;
    }
    //Gets all wanted propertys from a Mendix Document
    //Returns Array of Output Object Properties
    MxADocumentAdapter.prototype.getPropertys = function (document, qrypropertys) {
        var _this = this;
        var propertys = new Array();
        if (qrypropertys[0] == qrycons.documents.ALL) {
            propertys[propertys.length] = this.getId(document);
            propertys[propertys.length] = this.getName(document);
            propertys[propertys.length] = this.getType(document);
            propertys[propertys.length] = this.getContainer(document);
            propertys[propertys.length] = this.getDocumentation(document);
        }
        else {
            qrypropertys.forEach(function (qryprop) {
                if (qryprop == qrycons.documents.ID) {
                    propertys[propertys.length] = _this.getId(document);
                }
                else if (qryprop == qrycons.documents.NAME) {
                    propertys[propertys.length] = _this.getName(document);
                }
                else if (qryprop == qrycons.documents.TYPE) {
                    propertys[propertys.length] = _this.getType(document);
                }
                else if (qryprop == qrycons.documents.CONTAINER) {
                    propertys[propertys.length] = _this.getContainer(document);
                }
                else if (qryprop == qrycons.documents.DOCUMENTATION) {
                    propertys[propertys.length] = _this.getDocumentation(document);
                }
                else {
                    propertys[propertys.length] = new MxAO.MxAOutputObjectProperty("Unknown Property", "Value of Unknown Property");
                }
            });
        }
        return propertys;
    };
    //gets Name of a Mendix Document
    MxADocumentAdapter.prototype.getName = function (document) {
        var property;
        property = new MxAO.MxAOutputObjectProperty("NAME", document.qualifiedName);
        return property;
    };
    //gets Documentation of a Mendix Document
    MxADocumentAdapter.prototype.getDocumentation = function (document) {
        var property;
        property = new MxAO.MxAOutputObjectProperty("DOCUMENTATION", "No Value loaded"); //Muss noch richtig implementiert werden aktuell überall No Value muss mit .load(callback) geladen werden.
        if (document.isLoaded) {
            var docu = document.documentation;
            docu = docu.replace(/\r/g, "");
            docu = docu.replace(/\n/g, "\t");
            if (docu == "") {
                property = new MxAO.MxAOutputObjectProperty("DOCUMENTATION", "No Documentation");
            }
            else {
                property = new MxAO.MxAOutputObjectProperty("DOCUMENTATION", docu);
            }
        }
        return property;
    };
    return MxADocumentAdapter;
}(MxAStructureAdapter));
exports.MxADocumentAdapter = MxADocumentAdapter;
