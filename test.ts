import * as mendixanalytics from "./MxA";
import { documents as qrycons } from "./QueryConstants";

const username = 'jochen.neufang@mansystems.de';
const apikey = 'e6a890bf-6377-4395-8924-87bfe8da7330';
// Please change your project Id and name to something you prefer.
let projectName = `7-2-0-ATSTest`;
let projectId = `01bfc705-81e4-4ffa-8bc9-0c43e7f2b5ba`;


let project = new mendixanalytics.MxAToTextFile(username, apikey, projectId, "./Test.txt");
project.getDocumentsFromProject([qrycons.propertys.ID,qrycons.propertys.NAME,qrycons.propertys.TYPE], [], [], [1]);  //unfiltered Result
//project.getDocumentsFromProject([qrycons.propertys.ID,qrycons.propertys.NAME,qrycons.propertys.TYPE], [qrycons.filter.TYPE], ["Microflows$Microflow"], [1]); //filtered Result
//project.getDocumentsFromProject([qrycons.documents.propertys.ID,qrycons.documents.propertys.NAME,qrycons.documents.propertys.TYPE], [qrycons.documents.filter.TYPE], ["No Result Entry"], [1]); //No Result
