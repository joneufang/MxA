import {ModelSdkClient, IModel, IModelUnit, domainmodels, utils, pages, customwidgets, projects, documenttemplates} from "mendixmodelsdk";
import {MendixSdkClient, Project, OnlineWorkingCopy, loadAsPromise} from "mendixplatformsdk";
import when = require("when");
import fs = require("fs-extra");
import * as MxAO from "./MxAOutputObject";
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
                var propertys : MxAO.MxAOutputObjectProperty[] = new Array();
                var filtered : boolean = false;
                var filtercount : number = 0;
                var mxaobj : MxAO.MxAOutputObject;
                qrypropertys.forEach((qryprop) => {
                    if(qryprop == qrycons.documents.propertys.ID)
                    {
                        propertys[propertys.length] = new MxAO.MxAOutputObjectProperty("ID",doc.id);
                    }
                    else if(qryprop == qrycons.documents.propertys.NAME)
                    {
                        propertys[propertys.length] = new MxAO.MxAOutputObjectProperty("Name",doc.qualifiedName);
                    }
                    else if(qryprop == qrycons.documents.propertys.TYPE)
                    {
                        propertys[propertys.length] = new MxAO.MxAOutputObjectProperty("Type",doc.structureTypeName);
                    }
                    else if(qryprop == qrycons.documents.propertys.CONTAINER)
                    {
                        var container = "Kein Container"
                        try{
                            var fbase = doc.containerAsFolderBase;
                            if(fbase instanceof projects.Folder)
                            {
                                var folder : projects.Folder = fbase;
                                container = folder.name;
                            }
                            else if(fbase instanceof projects.Module)
                            {
                                var modul : projects.Module = fbase;
                                container = modul.name;
                            }
                        }
                        catch
                        {

                        }
                        propertys[propertys.length] = new MxAO.MxAOutputObjectProperty("Container",container);
                    }
                    else
                    {
                        propertys[propertys.length] = new MxAO.MxAOutputObjectProperty("Unknown Property","Value of Unknown Property");
                    }
                })
                mxaobj = new MxAO.MxAOutputObject(propertys);
                qryfilterTypes.forEach((qryfilter) => {
                    var regex = qryfilterValues[filtercount];
                    var value = mxaobj.getPropertyValue(qryfilter); 
                    if(!(value.match(regex) || regex == value))
                    {
                        filtered = true;
                    }
                    filtercount++;
                })
                if(!filtered)
                {
                    result.addObject(mxaobj);
                }
            });
            return loadAllDocumentsAsPromise(documents);
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

function loadAllDocumentsAsPromise(documents: projects.IDocument[]): when.Promise<projects.Document[]> {
    return when.all<projects.Document[]>(documents.map( doc => loadAsPromise(doc)));
}