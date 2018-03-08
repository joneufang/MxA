import {ModelSdkClient, IModel, IModelUnit, domainmodels, utils, pages, customwidgets, projects} from "mendixmodelsdk";
import {MendixSdkClient, Project, OnlineWorkingCopy, loadAsPromise} from "mendixplatformsdk";
import when = require("when");
import fs = require("fs-extra");


export namespace constants {
    export namespace propertys {
        export const ID : string = "ID";
        export const NAME : string = "NAME";
        export const TYPE : string = "TYPE";
        export const CONTAINER : string = "CONTAINER";
        export const CALLLOCATIONS : String = "CALLLOCATIONS";
        export const CALLCOUNT : string = "CALLCOUNT"; 
    }
    export namespace filter {
        export const ID : string = "FID";
        export const NAME : string = "FNAME";
        export const TYPE : string = "FTYPE";
    }
}


class MxAProject {

    protected static readonly TEXTFILE = "TEXTFILE";
    protected static readonly HTMLTABLE = "HTMLTABLE";

    protected name : string;
    protected key : string;
    protected id : string;
    protected file : string;

    protected client : MendixSdkClient;
    protected project : Project;

    

    protected constructor(username : string, apikey : string, appid: string) {
        this.name = username;
        this.key = apikey;
        this.id = appid;

        this.client = new MendixSdkClient(this.name, this.key);
        this.project = new Project(this.client, this.id, "");
    }

    protected getDocsFromProject(propertys : string[], filterTypes : string[], filterValues : string[], sortcolumn : number[], resultType : string) {
        var result : string = "";
        
        this.project.createWorkingCopy().then((workingCopy) => {
            return workingCopy.model().allDocuments();
        })
        .then((documents) => { 
            documents.forEach((doc) => {

                
                result += ("ID: " + doc.id + "\tName: " + doc.qualifiedName + "\tType: " + doc.structureTypeName + "\t\n");
            });
            return loadAllDocumentsAsPromise(documents);
        })
        .done(() => {
        
            console.log("Im Done!!!");
            if(resultType == MxAProject.TEXTFILE)
            {
                fs.outputFile(this.file, result);
            }
            else
            {
                console.log("Wrong ResultType");
            }
            

        });

    }

    
}    

export class MxAToHtmlTable extends MxAProject {

    private htmlresult;
    private htmlerror;

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

function loadAllDocumentsAsPromise(documents: projects.IDocument[]): when.Promise<projects.Document[]> {
    return when.all<projects.Document[]>(documents.map( doc => loadAsPromise(doc)));
}