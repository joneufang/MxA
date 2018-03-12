import {ModelSdkClient, IModel, IModelUnit, domainmodels, utils, pages, customwidgets, projects, documenttemplates} from "mendixmodelsdk";
import {MendixSdkClient, Project, OnlineWorkingCopy, loadAsPromise} from "mendixplatformsdk";
import when = require("when");
import * as MxAO from "./MxAOutputObject";
import * as MxAA from "./MxAObjectAdapter";
import * as qrycons from "./QueryConstants";

//Mendix Analytics Project without specified Output Type
class MxAProject {

    //Constants to define output target
    protected static readonly TEXTFILE = "TEXTFILE";            
    protected static readonly HTMLTABLE = "HTMLTABLE";
    protected static readonly XML = "XML";
    protected static readonly JSON = "JSON";

    //Constants to define output target
    protected readonly TEXTFILE = "TEXTFILE";            
    protected readonly HTMLTABLE = "HTMLTABLE";
    protected readonly XML = "XML";
    protected readonly JSON = "JSON";

    protected name : string;        //username for Mendix SDK
    protected key : string;         //API-Key for Mendix SDK
    protected id : string;          //AppID for Mendix SDK

    protected target : string;        //Name of Ouptput target
  

    protected client : MendixSdkClient;     //Mendix SDK client
    protected project : Project;            //Mendix SDK Project

    
    //Standard Constructor creates Mendix SDK Client and Project
    protected constructor(username : string, apikey : string, appid: string) {
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
    protected getDocsFromProject(qrypropertys : string[], qryfiltertypes : string[], qryfiltervalues : string[], qrysortcolumns : string[], qryresulttype : string) {
        var outputobjects : MxAO.MxAOutputObjectList = new MxAO.MxAOutputObjectList();
        
        this.project.createWorkingCopy().then((workingCopy) => {
            return workingCopy.model().allDocuments();
        })
        .then((documents) => { 
            
            return this.loadAllDocumentsAsPromise(documents);
        })
        .done((loadeddocs) => {
        
            //Get filtered Documents
            loadeddocs.forEach((doc) => {
                if(doc instanceof projects.Document){
                    var documentadapter : MxAA.MxADocumentAdapter = new MxAA.MxADocumentAdapter();
                    var propertys : MxAO.MxAOutputObjectProperty[] = new Array();
                    var mxaobj : MxAO.MxAOutputObject;
    
                    propertys = documentadapter.getPropertys(doc, qrypropertys);
    
                    mxaobj = new MxAO.MxAOutputObject(propertys);

                    //filter
                    if(documentadapter.filter(mxaobj,qryfiltertypes, qryfiltervalues))
                    {
                        outputobjects.addObject(mxaobj);
                    }
                }
                else
                {
                    console.log("Got Document which is not instance of projects.Document");
                }
                
            });

            //Sort Objects
            outputobjects = outputobjects.sort(qrysortcolumns);

            //Return As Output Type
            outputobjects.returnResult(this.TEXTFILE,this.target)

            console.log("Im Done!!!");
        });

    }

    protected loadAllDocumentsAsPromise(documents: projects.IDocument[]): when.Promise<projects.Document[]> {
        return when.all<projects.Document[]>(documents.map( doc => loadAsPromise(doc)));
    }
    
}    

//Mendix Analytics Project with HTMLElement as ResultType
export class MxAToHtmlTable extends MxAProject {

    public constructor(username : string, apikey : string, appid : string, htmlresultfield : string) {
        super(username, apikey, appid);
        this.target = htmlresultfield;
    }

    public getDocumentsFromProject(propertys : string[], filterTypes : string[], filterValues : string[], sortcolumn : string[]) {
        super.getDocsFromProject(propertys, filterTypes, filterValues, sortcolumn, MxAProject.HTMLTABLE);
    }
    
}

//Mendix Analytics Project with TextFile as ResultType
export class MxAToTextFile extends MxAProject {

    public constructor(username : string, apikey : string, appid : string, textfile : string) {
        super(username, apikey, appid);
        this.target = textfile;
    }

    public getDocumentsFromProject(propertys : string[], filterTypes : string[], filterValues : string[], sortcolumn : string[]) {
        super.getDocsFromProject(propertys, filterTypes, filterValues, sortcolumn, MxAProject.TEXTFILE);
    }

}

