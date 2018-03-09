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
var MxAProject = /** @class */ (function () {
    function MxAProject(username, apikey, appid) {
        this.name = username;
        this.key = apikey;
        this.id = appid;
        this.client = new mendixplatformsdk_1.MendixSdkClient(this.name, this.key);
        this.project = new mendixplatformsdk_1.Project(this.client, this.id, "");
    }
    MxAProject.prototype.getDocsFromProject = function (propertys, filterTypes, filterValues, sortcolumn, resultType) {
        var _this = this;
        var result = "";
        this.project.createWorkingCopy().then(function (workingCopy) {
            return workingCopy.model().allDocuments();
        })
            .then(function (documents) {
            documents.forEach(function (doc) {
                result += ("ID: " + doc.id + "\tName: " + doc.qualifiedName + "\tType: " + doc.structureTypeName + "\t\n");
            });
            return loadAllDocumentsAsPromise(documents);
        })
            .done(function () {
            console.log("Im Done!!!");
            if (resultType == MxAProject.TEXTFILE) {
                fs.outputFile(_this.file, result);
            }
            else {
                console.log("Wrong ResultType");
            }
        });
    };
    MxAProject.TEXTFILE = "TEXTFILE";
    MxAProject.HTMLTABLE = "HTMLTABLE";
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
