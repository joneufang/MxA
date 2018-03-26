"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mendixmodelsdk_1 = require("mendixmodelsdk");
var mendixplatformsdk_1 = require("mendixplatformsdk");
var when = require("when");
var fs = require("fs-extra");
var MMDAO = require("./MMDAOutputObject");
var MMDAA = require("./MMDAObjectAdapter");
//Mendix Analytics Project without specified Output Type
var MMDAProject = /** @class */ (function () {
    //Standard Constructor creates Mendix SDK Client and Project
    function MMDAProject(username, apikey, appid) {
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
    MMDAProject.prototype.getProjectDocuments = function (qrypropertys, filter, qrysortcolumns, qryresulttype, filename) {
        var _this = this;
        var outputobjects = new MMDAO.OutputObjectList();
        this.project.createWorkingCopy().then(function (workingCopy) {
            return workingCopy.model().allDocuments();
        })
            .then(function (documents) {
            return _this.loadAllDocumentsAsPromise(documents);
        })
            .done(function (loadeddocs) {
            loadeddocs.forEach(function (doc) {
                if (doc instanceof mendixmodelsdk_1.projects.Document) {
                    var documentadapter = new MMDAA.DocumentAdapter();
                    var propertys = new Array();
                    var MMDAobj;
                    propertys = documentadapter.getDocumentPropertys(doc, qrypropertys);
                    MMDAobj = new MMDAO.OutputObject(propertys, "Document"); //Get filtered Documents
                    if (documentadapter.filter(MMDAobj, filter)) {
                        outputobjects.addObject(MMDAobj); //filter object
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
    MMDAProject.prototype.getProjectDocumentsAsHTML = function (propertys, filter, sortcolumn, filename) {
        this.getProjectDocuments(propertys, filter, sortcolumn, MMDAProject.HTMLTABLE, filename);
    };
    MMDAProject.prototype.getProjectDocumentsAsXML = function (propertys, filter, sortcolumn, filename) {
        this.getProjectDocuments(propertys, filter, sortcolumn, MMDAProject.XML, filename);
    };
    MMDAProject.prototype.getProjectDocumentsAsTXT = function (propertys, filter, sortcolumn, filename) {
        this.getProjectDocuments(propertys, filter, sortcolumn, MMDAProject.TEXTFILE, filename);
    };
    MMDAProject.prototype.getProjectDocumentsAsJSON = function (propertys, filter, sortcolumn, filename) {
        this.getProjectDocuments(propertys, filter, sortcolumn, MMDAProject.JSON, filename);
    };
    MMDAProject.prototype.getModuleDocuments = function (modulename, qrypropertys, filter, qrysortcolumns, qryresulttype, filename) {
        var outputobjects = new MMDAO.OutputObjectList();
        this.project.createWorkingCopy().then(function (workingCopy) {
            return workingCopy.model().findModuleByQualifiedName(modulename);
        })
            .done(function (modul) {
            modul.documents.forEach(function (doc) {
                if (doc instanceof mendixmodelsdk_1.projects.Document) {
                    var documentadapter = new MMDAA.DocumentAdapter();
                    var propertys = new Array();
                    var MMDAobj;
                    propertys = documentadapter.getDocumentPropertys(doc, qrypropertys);
                    MMDAobj = new MMDAO.OutputObject(propertys, "Document"); //Get filtered Documents
                    if (documentadapter.filter(MMDAobj, filter)) {
                        outputobjects.addObject(MMDAobj); //filter object
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
    MMDAProject.prototype.getModuleDocumentsAsTXT = function (modulename, propertys, filter, sortcolumn, filename) {
        this.getModuleDocuments(modulename, propertys, filter, sortcolumn, MMDAProject.TEXTFILE, filename);
    };
    MMDAProject.prototype.getModuleDocumentsAsHTML = function (modulename, propertys, filter, sortcolumn, filename) {
        this.getModuleDocuments(modulename, propertys, filter, sortcolumn, MMDAProject.HTMLTABLE, filename);
    };
    MMDAProject.prototype.getModuleDocumentsAsXML = function (modulename, propertys, filter, sortcolumn, filename) {
        this.getModuleDocuments(modulename, propertys, filter, sortcolumn, MMDAProject.XML, filename);
    };
    MMDAProject.prototype.getModuleDocumentsAsJSON = function (modulename, propertys, filter, sortcolumn, filename) {
        this.getModuleDocuments(modulename, propertys, filter, sortcolumn, MMDAProject.JSON, filename);
    };
    MMDAProject.prototype.getFolderDocuments = function (foldername, qrypropertys, filter, qrysortcolumns, qryresulttype, filename) {
        var outputobjects = new MMDAO.OutputObjectList();
        var folderfound = false;
        this.project.createWorkingCopy().then(function (workingCopy) {
            return workingCopy.model().allFolders();
        })
            .done(function (folders) {
            folders.forEach(function (folder) {
                if (folder.name == foldername) {
                    folderfound = true;
                    folder.documents.forEach(function (doc) {
                        if (doc instanceof mendixmodelsdk_1.projects.Document) {
                            var documentadapter = new MMDAA.DocumentAdapter();
                            var propertys = new Array();
                            var MMDAobj;
                            propertys = documentadapter.getDocumentPropertys(doc, qrypropertys);
                            MMDAobj = new MMDAO.OutputObject(propertys, "Document"); //Get filtered Documents
                            if (documentadapter.filter(MMDAobj, filter)) {
                                outputobjects.addObject(MMDAobj); //filter object
                            }
                        }
                        else {
                            console.log("Got Document which is not instance of projects.Document");
                        }
                    });
                    outputobjects = outputobjects.sort(qrysortcolumns); //Sort Objects
                    outputobjects.returnResult(qryresulttype, filename); //Return As Output Type
                    console.log("Im Done!!!");
                }
            });
            if (!folderfound) {
                fs.outputFile(filename, "Ordner mit dem Namen " + foldername + " wurde nicht gefunden");
            }
        });
    };
    MMDAProject.prototype.getFolderDocumentsAsHTML = function (foldername, propertys, filter, sortcolumn, filename) {
        this.getFolderDocuments(foldername, propertys, filter, sortcolumn, MMDAProject.HTMLTABLE, filename);
    };
    MMDAProject.prototype.getFolderDocumentsAsTXT = function (foldername, propertys, filter, sortcolumn, filename) {
        this.getFolderDocuments(foldername, propertys, filter, sortcolumn, MMDAProject.TEXTFILE, filename);
    };
    MMDAProject.prototype.getFolderDocumentsAsXML = function (foldername, propertys, filter, sortcolumn, filename) {
        this.getFolderDocuments(foldername, propertys, filter, sortcolumn, MMDAProject.XML, filename);
    };
    MMDAProject.prototype.getFolderDocumentsAsJSON = function (foldername, propertys, filter, sortcolumn, filename) {
        this.getFolderDocuments(foldername, propertys, filter, sortcolumn, MMDAProject.JSON, filename);
    };
    MMDAProject.prototype.loadAllDocumentsAsPromise = function (documents) {
        return when.all(documents.map(function (doc) { return mendixplatformsdk_1.loadAsPromise(doc); }));
    };
    //Constants to define output target
    MMDAProject.TEXTFILE = "TEXTFILE";
    MMDAProject.HTMLTABLE = "HTMLTABLE";
    MMDAProject.XML = "XML";
    MMDAProject.JSON = "JSON";
    return MMDAProject;
}());
exports.MMDAProject = MMDAProject;
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
