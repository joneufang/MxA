import {ModelSdkClient, IModel, IModelUnit, domainmodels, utils, pages, customwidgets, projects, documenttemplates} from "mendixmodelsdk";
import {MendixSdkClient, Project, OnlineWorkingCopy, loadAsPromise} from "mendixplatformsdk";
import when = require("when");
import * as MxAO from "./MxAOutputObject";
import * as MxAA from "./MxAObjectAdapter";
import * as qrycons from "./QueryConstants";

//Mendix Analytics Project without specified Output Type
export class MxAProject {

    //Constants to define output target
    protected static readonly TEXTFILE = "TEXTFILE";            
    protected static readonly HTMLTABLE = "HTMLTABLE";
    protected static readonly XML = "XML";
    protected static readonly JSON = "JSON";

    protected name : string;        //username for Mendix SDK
    protected key : string;         //API-Key for Mendix SDK
    protected id : string;          //AppID for Mendix SDK

    
  

    protected client : MendixSdkClient;     //Mendix SDK client
    protected project : Project;            //Mendix SDK Project

    
    //Standard Constructor creates Mendix SDK Client and Project
    public constructor(username : string, apikey : string, appid: string) {
        this.name = username;
        this.key = apikey;
        this.id = appid;

        this.client = new MendixSdkClient(this.name, this.key);
        this.project = new Project(this.client, this.id, "");
    }

    /*
    Gets Documents from whole Project
    Parameter: qrypropertys : string[]      Array of property constants of wanted propertys
    Parameter: qryfiltertypes : string[]    Array of filter constants of propertys to filter
    Parameter: qryfiltervalues : string[]   Array of Values for the filters
    Parameter: qrysortcolumns : number[]    Array of Columnnumbers for sorting
    Parameter: qryresulttype : string       Constant which ResultType should be used
    */
    protected getProjectDocuments(qrypropertys : string[], filter : Filter[], qrysortcolumns : string[], qryresulttype : string, filename: string) {
        var outputobjects : MxAO.MxAOutputObjectList = new MxAO.MxAOutputObjectList();
        
        this.project.createWorkingCopy().then((workingCopy) => {
            return workingCopy.model().allDocuments();
        })
        .then((documents) => { 
            return this.loadAllDocumentsAsPromise(documents);
        })
        .done((loadeddocs) => {
            loadeddocs.forEach((doc) => {
                if(doc instanceof projects.Document){
                    var documentadapter : MxAA.MxADocumentAdapter = new MxAA.MxADocumentAdapter();
                    var propertys : MxAO.MxAOutputObjectProperty[] = new Array();
                    var mxaobj : MxAO.MxAOutputObject;
                    propertys = documentadapter.getPropertys(doc, qrypropertys);
                    mxaobj = new MxAO.MxAOutputObject(propertys,"Document");                   //Get filtered Documents
                    if(documentadapter.filter(mxaobj,filter))
                    {
                        outputobjects.addObject(mxaobj);                        //filter object
                    }
                }
                else
                {
                    console.log("Got Document which is not instance of projects.Document");
                }
            });
            outputobjects = outputobjects.sort(qrysortcolumns);         //Sort Objects
            outputobjects.returnResult(qryresulttype,filename);       //Return As Output Type
            console.log("Im Done!!!");
        });
    }

    public getProjectDocumentsAsHTML(propertys : string[], filter : Filter[], sortcolumn : string[], filename : string) {
        this.getProjectDocuments(propertys, filter, sortcolumn, MxAProject.HTMLTABLE, filename);
    }

    public getProjectDocumentsAsXML(propertys : string[], filter : Filter[], sortcolumn : string[], filename : string) {
        this.getProjectDocuments(propertys, filter, sortcolumn, MxAProject.XML, filename);
    }

    public getProjectDocumentsAsTXT(propertys : string[], filter : Filter[], sortcolumn : string[], filename : string) {
        this.getProjectDocuments(propertys, filter, sortcolumn, MxAProject.TEXTFILE, filename);
    }

    protected loadAllDocumentsAsPromise(documents: projects.IDocument[]): when.Promise<projects.Document[]> {
        return when.all<projects.Document[]>(documents.map( doc => loadAsPromise(doc)));
    }
    
}    

export class Filter {
    private filtertype : string;
    private filtervalue : string;

    public constructor(filtertype : string, filtervalue : string){
        this.filtertype = filtertype;
        this.filtervalue = filtervalue;
    }

    public getType() {
        return this.filtertype;
    }

    public getValue() {
        return this.filtervalue;
    }
}

