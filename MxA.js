"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mendixmodelsdk_1 = require("mendixmodelsdk");
var mendixplatformsdk_1 = require("mendixplatformsdk");
var when = require("when");
var MxAO = require("./MxAOutputObject");
var MxAA = require("./MxAObjectAdapter");
//Mendix Analytics Project without specified Output Type
var MxAProject = /** @class */ (function () {
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
    MxAProject.prototype.getProjectDocuments = function (qrypropertys, filter, qrysortcolumns, qryresulttype, filename) {
        var _this = this;
        var outputobjects = new MxAO.MxAOutputObjectList();
        this.project.createWorkingCopy().then(function (workingCopy) {
            return workingCopy.model().allDocuments();
        })
            .then(function (documents) {
            return _this.loadAllDocumentsAsPromise(documents);
        })
            .done(function (loadeddocs) {
            loadeddocs.forEach(function (doc) {
                if (doc instanceof mendixmodelsdk_1.projects.Document) {
                    var documentadapter = new MxAA.MxADocumentAdapter();
                    var propertys = new Array();
                    var mxaobj;
                    propertys = documentadapter.getPropertys(doc, qrypropertys);
                    mxaobj = new MxAO.MxAOutputObject(propertys, "Document"); //Get filtered Documents
                    if (documentadapter.filter(mxaobj, filter)) {
                        outputobjects.addObject(mxaobj); //filter object
                    }
                }
                else {
                    console.log("Got Document which is not instance of projects.Document");
                }
            });
            outputobjects = outputobjects.sort(qrysortcolumns); //Sort Objects
            outputobjects.returnResult(qryresulttype, filename); //Return As Output Type
            console.log("Im Done!!!");
        });
    };
    MxAProject.prototype.getProjectDocumentsAsHTML = function (propertys, filter, sortcolumn, filename) {
        this.getProjectDocuments(propertys, filter, sortcolumn, MxAProject.HTMLTABLE, filename);
    };
    MxAProject.prototype.getProjectDocumentsAsXML = function (propertys, filter, sortcolumn, filename) {
        this.getProjectDocuments(propertys, filter, sortcolumn, MxAProject.XML, filename);
    };
    MxAProject.prototype.getProjectDocumentsAsTXT = function (propertys, filter, sortcolumn, filename) {
        this.getProjectDocuments(propertys, filter, sortcolumn, MxAProject.TEXTFILE, filename);
    };
    MxAProject.prototype.getModuleDocuments = function (modulename, qrypropertys, filter, qrysortcolumns, qryresulttype, filename) {
        var outputobjects = new MxAO.MxAOutputObjectList();
        this.project.createWorkingCopy().then(function (workingCopy) {
            return workingCopy.model().findModuleByQualifiedName(modulename);
        })
            .done(function (module) {
            module.documents.forEach(function (doc) {
                if (doc instanceof mendixmodelsdk_1.projects.Document) {
                    var documentadapter = new MxAA.MxADocumentAdapter();
                    var propertys = new Array();
                    var mxaobj;
                    propertys = documentadapter.getPropertys(doc, qrypropertys);
                    mxaobj = new MxAO.MxAOutputObject(propertys, "Document"); //Get filtered Documents
                    if (documentadapter.filter(mxaobj, filter)) {
                        outputobjects.addObject(mxaobj); //filter object
                    }
                }
                else {
                    console.log("Got Document which is not instance of projects.Document");
                }
            });
            outputobjects = outputobjects.sort(qrysortcolumns); //Sort Objects
            outputobjects.returnResult(qryresulttype, filename); //Return As Output Type
            console.log("Im Done!!!");
        });
    };
    MxAProject.prototype.getModuleDocumentsAsTXT = function (modulename, propertys, filter, sortcolumn, filename) {
        this.getModuleDocuments(modulename, propertys, filter, sortcolumn, MxAProject.TEXTFILE, filename);
    };
    MxAProject.prototype.loadAllDocumentsAsPromise = function (documents) {
        return when.all(documents.map(function (doc) { return mendixplatformsdk_1.loadAsPromise(doc); }));
    };
    //Constants to define output target
    MxAProject.TEXTFILE = "TEXTFILE";
    MxAProject.HTMLTABLE = "HTMLTABLE";
    MxAProject.XML = "XML";
    MxAProject.JSON = "JSON";
    return MxAProject;
}());
exports.MxAProject = MxAProject;
var Filter = /** @class */ (function () {
    function Filter(filtertype, filtervalue) {
        this.filtertype = filtertype;
        this.filtervalue = filtervalue;
    }
    Filter.prototype.getType = function () {
        return this.filtertype;
    };
    Filter.prototype.getValue = function () {
        return this.filtervalue;
    };
    return Filter;
}());
exports.Filter = Filter;
