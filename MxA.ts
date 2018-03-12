import {ModelSdkClient, IModel, IModelUnit, domainmodels, utils, pages, customwidgets, projects, documenttemplates} from "mendixmodelsdk";
import {MendixSdkClient, Project, OnlineWorkingCopy, loadAsPromise} from "mendixplatformsdk";
import when = require("when");
import fs = require("fs-extra");
import * as MxAO from "./MxAOutputObject";
import * as MxAA from "./MxAObjectAdapter";
import * as qrycons from "./QueryConstants";


class MxAProject {

    protected static readonly TEXTFILE = "TEXTFILE";
    protected static readonly HTMLTABLE = "HTMLTABLE";
    protected static readonly XML = "XML";
    protected static readonly JSON = "JSON";

    protected name : string;
    protected key : string;
    protected id : string;

    protected file : string;
    protected htmlresult;
    protected htmlerror;

    protected client : MendixSdkClient;
    protected project : Project;

    

    protected constructor(username : string, apikey : string, appid: string) {
        this.name = username;
        this.key = apikey;
        this.id = appid;

        this.client = new MendixSdkClient(this.name, this.key);
        this.project = new Project(this.client, this.id, "");
    }

    protected getDocsFromProject(qrypropertys : string[], qryfilterTypes : string[], qryfilterValues : string[], qrysortcolumn : number[], qryresultType : string) {
        var result : MxAO.MxAOutputObjectList = new MxAO.MxAOutputObjectList();
        
        this.project.createWorkingCopy().then((workingCopy) => {
            return workingCopy.model().allDocuments();
        })
        .then((documents) => { 
            documents.forEach((doc) => {
                if(doc instanceof projects.Document){
                    var documentadapter : MxAA.MxADocumentAdapter = new MxAA.MxADocumentAdapter();
                    var propertys : MxAO.MxAOutputObjectProperty[] = new Array();
                    var mxaobj : MxAO.MxAOutputObject;
    
                    propertys = documentadapter.getPropertys(doc, qrypropertys);
    
                    mxaobj = new MxAO.MxAOutputObject(propertys);

                    if(documentadapter.filter(mxaobj,qryfilterTypes, qryfilterValues))
                    {
                        result.addObject(mxaobj);
                    }
                }
                else
                {
                    console.log("Got Document which is not instance of projects.Document");
                }
                
            });
            return this.loadAllDocumentsAsPromise(documents);
        })
        .done(() => {
        
            console.log("Im Done!!!");
            if(qryresultType == MxAProject.TEXTFILE)
            {
                fs.outputFile(this.file, result.toTextFileString());
            }
            else
            {
                console.log("Wrong ResultType");
            }
            

        });

    }

    protected loadAllDocumentsAsPromise(documents: projects.IDocument[]): when.Promise<projects.Document[]> {
        return when.all<projects.Document[]>(documents.map( doc => loadAsPromise(doc)));
    }
    
}    

export class MxAToHtmlTable extends MxAProject {

    public constructor(username : string, apikey : string, appid : string, htmlresultfield : string, htmlerrorfield? : string) {
        super(username, apikey, appid);
        this.htmlresult = htmlresultfield;
        if(htmlerrorfield) {
            this.htmlerror = htmlerrorfield;
        }
    }

    public getDocumentsFromProject(propertys : string[], filterTypes : string[], filterValues : string[], sortcolumn : number[]) {
        super.getDocsFromProject(propertys, filterTypes, filterValues, sortcolumn, MxAProject.HTMLTABLE);
    }
    
}

export class MxAToTextFile extends MxAProject {

    public constructor(username : string, apikey : string, appid : string, textfile : string) {
        super(username, apikey, appid);
        this.file = textfile;
    }

    public getDocumentsFromProject(propertys : string[], filterTypes : string[], filterValues : string[], sortcolumn : number[]) {
        super.getDocsFromProject(propertys, filterTypes, filterValues, sortcolumn, MxAProject.TEXTFILE);
    }

}

