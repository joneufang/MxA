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
var mendixplatformsdk_1 = require("mendixplatformsdk");
var when = require("when");
var MxAO = require("./MxAOutputObject");
var MxAA = require("./MxAObjectAdapter");
//Mendix Analytics Project without specified Output Type
var MxAProject = (function () {
    //Standard Constructor creates Mendix SDK Client and Project
    function MxAProject(username, apikey, appid) {
        this.name = username;
        this.key = apikey;
        this.id = appid;
        this.client = new mendixplatformsdk_1.MendixSdkClient(this.name, this.key);
        this.project = new mendixplatformsdk_1.Project(this.client, this.id, "");
    }
    /*
    Gets Documents from whole Project
    Parameter: qrypropertys : string[]      Array of property constants of wanted propertys
    Parameter: qryfiltertypes : string[]    Array of filter constants of propertys to filter
    Parameter: qryfiltervalues : string[]   Array of Values for the filters
    Parameter: qrysortcolumns : number[]    Array of Columnnumbers for sorting
    Parameter: qryresulttype : string       Constant which ResultType should be used
    */
    MxAProject.prototype.getDocsFromProject = function (qrypropertys, qryfiltertypes, qryfiltervalues, qrysortcolumns, qryresulttype) {
        var _this = this;
        var outputobjects = new MxAO.MxAOutputObjectList();
        this.project.createWorkingCopy().then(function (workingCopy) {
            return workingCopy.model().allDocuments();
        })
            .then(function (documents) {
            return _this.loadAllDocumentsAsPromise(documents);
        })
            .done(function (loadeddocs) {
            //Get filtered Documents
            loadeddocs.forEach(function (doc) {
                if (doc instanceof mendixmodelsdk_1.projects.Document) {
                    var documentadapter = new MxAA.MxADocumentAdapter();
                    var propertys = new Array();
                    var mxaobj;
                    propertys = documentadapter.getPropertys(doc, qrypropertys);
                    mxaobj = new MxAO.MxAOutputObject(propertys);
                    //filter
                    if (documentadapter.filter(mxaobj, qryfiltertypes, qryfiltervalues)) {
                        outputobjects.addObject(mxaobj);
                    }
                }
                else {
                    console.log("Got Document which is not instance of projects.Document");
                }
            });
            //Sort Objects
            outputobjects = outputobjects.sort(qrysortcolumns);
            //Return As Output Type
            outputobjects.returnResult(qryresulttype, _this.target);
            console.log("Im Done!!!");
        });
    };
    MxAProject.prototype.loadAllDocumentsAsPromise = function (documents) {
        return when.all(documents.map(function (doc) { return mendixplatformsdk_1.loadAsPromise(doc); }));
    };
    return MxAProject;
}());
//Constants to define output target
MxAProject.TEXTFILE = "TEXTFILE";
MxAProject.HTMLTABLE = "HTMLTABLE";
MxAProject.XML = "XML";
MxAProject.JSON = "JSON";
//Mendix Analytics Project with HTMLElement as ResultType
var MxAToHtmlTable = (function (_super) {
    __extends(MxAToHtmlTable, _super);
    function MxAToHtmlTable(username, apikey, appid, htmlresultfield) {
        var _this = _super.call(this, username, apikey, appid) || this;
        _this.target = htmlresultfield;
        return _this;
    }
    MxAToHtmlTable.prototype.getDocumentsFromProject = function (propertys, filterTypes, filterValues, sortcolumn) {
        _super.prototype.getDocsFromProject.call(this, propertys, filterTypes, filterValues, sortcolumn, MxAProject.HTMLTABLE);
    };
    return MxAToHtmlTable;
}(MxAProject));
exports.MxAToHtmlTable = MxAToHtmlTable;
//Mendix Analytics Project with TextFile as ResultType
var MxAToTextFile = (function (_super) {
    __extends(MxAToTextFile, _super);
    function MxAToTextFile(username, apikey, appid, textfile) {
        var _this = _super.call(this, username, apikey, appid) || this;
        _this.target = textfile;
        return _this;
    }
    MxAToTextFile.prototype.getDocumentsFromProject = function (propertys, filterTypes, filterValues, sortcolumn) {
        _super.prototype.getDocsFromProject.call(this, propertys, filterTypes, filterValues, sortcolumn, MxAProject.TEXTFILE);
    };
    return MxAToTextFile;
}(MxAProject));
exports.MxAToTextFile = MxAToTextFile;
//Mendix Analytics Project with XMLFile as ResultType
var MxAToXMLFile = (function (_super) {
    __extends(MxAToXMLFile, _super);
    function MxAToXMLFile(username, apikey, appid, xmlfile) {
        var _this = _super.call(this, username, apikey, appid) || this;
        _this.target = xmlfile;
        return _this;
    }
    MxAToXMLFile.prototype.getDocumentsFromProject = function (propertys, filterTypes, filterValues, sortcolumn) {
        _super.prototype.getDocsFromProject.call(this, propertys, filterTypes, filterValues, sortcolumn, MxAProject.XML);
    };
    return MxAToXMLFile;
}(MxAProject));
exports.MxAToXMLFile = MxAToXMLFile;
