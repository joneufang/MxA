import {ModelSdkClient, IModel, IModelUnit, domainmodels, utils, pages, customwidgets, projects} from "mendixmodelsdk";
import {MendixSdkClient, Project, OnlineWorkingCopy, loadAsPromise} from "mendixplatformsdk";
import when = require("when");

class MxAProject {

    protected name : string;
    protected key : string;
    protected id : string;

    protected client : MendixSdkClient;
    protected project : Project;

    protected constructor(username : string, apikey : string, appid: string) {
        this.name = username;
        this.key = apikey;
        this.id = appid;

        this.client = new MendixSdkClient(name, this.key);
        this.project = new Project(this.client, this.id, "");
    }

    protected getDocsFromProject() {
        this.project.createWorkingCopy();
    }
}

export class MxAToHtmlTextField extends MxAProject {

    private htmlresult;
    private htmlerror;

    public constructor(username : string, apikey : string, appid : string, htmlresultfield : string, htmlerrorfield? : string) {
        super(username, apikey, appid);
        this.htmlresult = htmlresultfield;
        if(htmlerrorfield) {
            this.htmlerror = htmlerrorfield;
        }
    }

    public getDocumentsFromProject() {
        super.getDocsFromProject();
    }
    
}

export class MxAToTextFile extends MxAProject {

    private file;

    public constructor(username : string, apikey : string, appid : string, textfile : string) {
        super(username, apikey, appid);
        this.file = textfile;
    }


}