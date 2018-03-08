"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mendixanalytics = require("./MxA");
var username = 'jochen.neufang@mansystems.de';
var apikey = 'e6a890bf-6377-4395-8924-87bfe8da7330';
// Please change your project Id and name to something you prefer.
var projectName = "7-2-0-ATSTest";
var projectId = "01bfc705-81e4-4ffa-8bc9-0c43e7f2b5ba";
var project = new mendixanalytics.MxAToTextFile(username, apikey, projectId, "./result.txt");
mendixanalytics.constants.propertys.ID;
project.getDocumentsFromProject([mendixanalytics.constants.propertys.ID], [mendixanalytics.constants.filter.ID], ["Test"], [1]);
