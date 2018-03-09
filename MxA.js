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
var mendixplatformsdk_1 = require("mendixplatformsdk");
var when = require("when");
var fs = require("fs-extra");
var MxAO = require("./MxAObject");
var qrycons = require("./QueryConstants");
var MxAProject = /** @class */ (function () {
    function MxAProject(username, apikey, appid) {
        this.name = username;
        this.key = apikey;
        this.id = appid;
        this.client = new mendixplatformsdk_1.MendixSdkClient(this.name, this.key);
        this.project = new mendixplatformsdk_1.Project(this.client, this.id, "");
    }
    MxAProject.prototype.getDocsFromProject = function (qrypropertys, qryfilterTypes, qryfilterValues, qrysortcolumn, qryresultType) {
        var _this = this;
        var result = new MxAO.MxAObjectList();
        this.project.createWorkingCopy().then(function (workingCopy) {
            return workingCopy.model().allDocuments();
        })
            .then(function (documents) {
            documents.forEach(function (doc) {
                var propertys = new Array();
                var filtered = false;
                var filtercount = 0;
                var mxaobj;
                qrypropertys.forEach(function (qryprop) {
                    if (qryprop == qrycons.documents.propertys.ID) {
                        propertys[propertys.length] = new MxAO.MxAProperty("ID", doc.id);
                    }
                    else if (qryprop == qrycons.documents.propertys.NAME) {
                        propertys[propertys.length] = new MxAO.MxAProperty("Name", doc.qualifiedName);
                    }
                    else if (qryprop == qrycons.documents.propertys.TYPE) {
                        propertys[propertys.length] = new MxAO.MxAProperty("Type", doc.structureTypeName);
                    }
                    else if (qryprop == qrycons.documents.propertys.CONTAINER) {
                        propertys[propertys.length] = new MxAO.MxAProperty("Container", "Platzhalter");
                    }
                    else {
                        propertys[propertys.length] = new MxAO.MxAProperty("Unknown Property", "Value of Unknown Property");
                    }
                });
                mxaobj = new MxAO.MxAObject(propertys);
                qryfilterTypes.forEach(function (qryfilter) {
                    var regex = qryfilterValues[filtercount];
                    var value = mxaobj.getPropertyValue(qryfilter);
                    if (!(value.match(regex) || regex == value)) {
                        filtered = true;
                    }
                    filtercount++;
                });
                if (!filtered) {
                    result.addObject(mxaobj);
                }
            });
            return loadAllDocumentsAsPromise(documents);
        })
            .done(function () {
            console.log("Im Done!!!");
            if (qryresultType == MxAProject.TEXTFILE) {
                fs.outputFile(_this.file, result.toTextFileString());
            }
            else {
                console.log("Wrong ResultType");
            }
        });
    };
    MxAProject.TEXTFILE = "TEXTFILE";
    MxAProject.HTMLTABLE = "HTMLTABLE";
    MxAProject.XML = "XML";
    MxAProject.JSON = "JSON";
    return MxAProject;
}());
var MxAToHtmlTable = /** @class */ (function (_super) {
    __extends(MxAToHtmlTable, _super);
    function MxAToHtmlTable(username, apikey, appid, htmlresultfield, htmlerrorfield) {
        var _this = _super.call(this, username, apikey, appid) || this;
        _this.htmlresult = htmlresultfield;
        if (htmlerrorfield) {
            _this.htmlerror = htmlerrorfield;
        }
        return _this;
    }
    MxAToHtmlTable.prototype.getDocumentsFromProject = function (propertys, filterTypes, filterValues, sortcolumn) {
        _super.prototype.getDocsFromProject.call(this, propertys, filterTypes, filterValues, sortcolumn, MxAProject.HTMLTABLE);
    };
    return MxAToHtmlTable;
}(MxAProject));
exports.MxAToHtmlTable = MxAToHtmlTable;
var MxAToTextFile = /** @class */ (function (_super) {
    __extends(MxAToTextFile, _super);
    function MxAToTextFile(username, apikey, appid, textfile) {
        var _this = _super.call(this, username, apikey, appid) || this;
        _this.file = textfile;
        return _this;
    }
    MxAToTextFile.prototype.getDocumentsFromProject = function (propertys, filterTypes, filterValues, sortcolumn) {
        _super.prototype.getDocsFromProject.call(this, propertys, filterTypes, filterValues, sortcolumn, MxAProject.TEXTFILE);
    };
    return MxAToTextFile;
}(MxAProject));
exports.MxAToTextFile = MxAToTextFile;
function loadAllDocumentsAsPromise(documents) {
    return when.all(documents.map(function (doc) { return mendixplatformsdk_1.loadAsPromise(doc); }));
}
