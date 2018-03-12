"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mendixanalytics = require("./MxA");
var QueryConstants_1 = require("./QueryConstants");
var username = 'jochen.neufang@mansystems.de';
var apikey = 'e6a890bf-6377-4395-8924-87bfe8da7330';
// Please change your project Id and name to something you prefer.
var projectName = "7-2-0-ATSTest";
var projectId = "01bfc705-81e4-4ffa-8bc9-0c43e7f2b5ba";
var project = new mendixanalytics.MxAToTextFile(username, apikey, projectId, "./Test.txt");
//project.getDocumentsFromProject([qrycons.propertys.ALL], [], [], [1]); //All Propertys unfiltered
project.getDocumentsFromProject([QueryConstants_1.documents.propertys.ID, QueryConstants_1.documents.propertys.NAME, QueryConstants_1.documents.propertys.TYPE, QueryConstants_1.documents.propertys.CONTAINER], [], [], []); //unfiltered Result
//project.getDocumentsFromProject([qrycons.propertys.ID,qrycons.propertys.NAME,qrycons.propertys.TYPE], [qrycons.filter.TYPE,qrycons.filter.NAME], ["Microflow","Testapp"], [1]); //filtered Result
//project.getDocumentsFromProject([qrycons.documents.propertys.ID,qrycons.documents.propertys.NAME,qrycons.documents.propertys.TYPE], [qrycons.documents.filter.TYPE], ["No Result Entry"], [1]); //No Result
//qrycons.propertys.ID,qrycons.propertys.NAME, qrycons.propertys.TYPE, qrycons.propertys.CONTAINER
/*
var client = new MendixSdkClient(username, apikey);
var project = new Project(client, projectId, "");


project.createWorkingCopy().then((workingCopy) => {
    return workingCopy.model().allDocuments();
})
.then((documents) => {
    
    return loadAllDocumentsAsPromise(documents);
})
.done((loadeddocs) => {

    loadeddocs.forEach((doc) => {
       
        var text = doc.documentation
        //text = text.replace(/(\r\n\t|\n|\r\t)/gm,"");
        text = text.replace(/\r/g, "");
        text = text.replace(/\n/g, "\t");
        console.log(text);
        console.log("\n\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n");
        
        
    });


    //Auslagern !!!!!!!!!!
    console.log("Im Done!!!");
    

});

function loadAllDocumentsAsPromise(documents: projects.IDocument[]): when.Promise<projects.Document[]> {
    return when.all<projects.Document[]>(documents.map( doc => loadAsPromise(doc)));
}*/
/*
var objects : MxAO.MxAOutputObjectList = new MxAO.MxAOutputObjectList();

var props : MxAO.MxAOutputObjectProperty[] = new Array();
props[0] = new MxAO.MxAOutputObjectProperty("Name","a");
props[1] = new MxAO.MxAOutputObjectProperty("Type","MF");
var object = new MxAO.MxAOutputObject(props)
objects.addObject(object)

var props : MxAO.MxAOutputObjectProperty[] = new Array();
props[0] = new MxAO.MxAOutputObjectProperty("Name","f");
props[1] = new MxAO.MxAOutputObjectProperty("Type","CW");
var object = new MxAO.MxAOutputObject(props)
objects.addObject(object)

var props : MxAO.MxAOutputObjectProperty[] = new Array();
props[0] = new MxAO.MxAOutputObjectProperty("Name","c");
props[1] = new MxAO.MxAOutputObjectProperty("Type","MF");
var object = new MxAO.MxAOutputObject(props)
objects.addObject(object)

var props : MxAO.MxAOutputObjectProperty[] = new Array();
props[0] = new MxAO.MxAOutputObjectProperty("Name","b");
props[1] = new MxAO.MxAOutputObjectProperty("Type","CW");
var object = new MxAO.MxAOutputObject(props)
objects.addObject(object)

var props : MxAO.MxAOutputObjectProperty[] = new Array();
props[0] = new MxAO.MxAOutputObjectProperty("Name","d");
props[1] = new MxAO.MxAOutputObjectProperty("Type","D");
var object = new MxAO.MxAOutputObject(props)
objects.addObject(object)

var props : MxAO.MxAOutputObjectProperty[] = new Array();
props[0] = new MxAO.MxAOutputObjectProperty("Name","e");
props[1] = new MxAO.MxAOutputObjectProperty("Type","D");
var object = new MxAO.MxAOutputObject(props)
objects.addObject(object)

var sortedobjects = objects.sort([qrycons.sorting.NAME]);

console.log(sortedobjects.toTextFileString());*/ 
