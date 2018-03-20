import {ModelSdkClient, IModel, IModelUnit, domainmodels, utils, pages, customwidgets, projects, documenttemplates, AbstractElement} from "mendixmodelsdk";
import * as MxAO from "./MxAOutputObject";
import * as qrycons from "./QueryConstants";
import { Structure } from "mendixmodelsdk/dist/sdk/internal/structures";

//Adapter to get propertys and filter Mendix Objects
export class MxAStructureAdapter {

    constructor() {

    }

    //Get Id of Mendix Object
    protected getId(structure : Structure) : MxAO.MxAOutputObjectProperty {
        var property : MxAO.MxAOutputObjectProperty;

        property = new MxAO.MxAOutputObjectProperty("ID",structure.id);

        return property; 
    }

    //Get Type of Mendix Object
    protected getType(structure : Structure) : MxAO.MxAOutputObjectProperty {
        var property : MxAO.MxAOutputObjectProperty;

        property = new MxAO.MxAOutputObjectProperty("TYPE",structure.structureTypeName);

        return property; 
    }

    //Get Container of Mendix Object
    protected getContainer(structure : Structure) : MxAO.MxAOutputObjectProperty {
        var property : MxAO.MxAOutputObjectProperty;
        var container = "Kein Container"

        try{
            var fbase = structure.container;
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
        catch(error)
        {

        }
        property = new MxAO.MxAOutputObjectProperty("CONTAINER",container);

        return property; 
    }

    //Filters Output Object
    //Returns true if Object passes all filters
    public filter(mxaobject : MxAO.MxAOutputObject, qryfilterTypes : string[], qryfilterValues : string[]) : boolean
    {
        var filtered : boolean = true;
        var filtercount : number = 0;

        qryfilterTypes.forEach((qryfilter) => {
            var regex = qryfilterValues[filtercount];
            var value = mxaobject.getPropertyValue(qryfilter); 
            if(!(value.match(regex) || regex == value))
            {
                filtered = false;
            }
            filtercount++;
        })

        return filtered;
    }
}


//Adapter to get propertys of Mendix Documents
export class MxADocumentAdapter extends MxAStructureAdapter {
    
    constructor() {
        super();   
    }

    //Gets all wanted propertys from a Mendix Document
    //Returns Array of Output Object Properties
    public getPropertys(document : projects.Document, qrypropertys : string[]) : MxAO.MxAOutputObjectProperty[] {
        var propertys : MxAO.MxAOutputObjectProperty[] = new Array();
        if(qrypropertys[0] == qrycons.documents.ALL)
        {
            propertys[propertys.length] = this.getId(document);
            propertys[propertys.length] = this.getName(document);
            propertys[propertys.length] = this.getType(document);
            propertys[propertys.length] = this.getContainer(document);
            propertys[propertys.length] = this.getDocumentation(document);   
        }
        else
        {
            qrypropertys.forEach((qryprop) => {
                if(qryprop == qrycons.documents.ID)
                {
                    propertys[propertys.length] = this.getId(document);
                }
                else if(qryprop == qrycons.documents.NAME)
                {
                    propertys[propertys.length] = this.getName(document);
                }
                else if(qryprop == qrycons.documents.TYPE)
                {
                    propertys[propertys.length] = this.getType(document);
                }
                else if(qryprop == qrycons.documents.CONTAINER)
                {
                    propertys[propertys.length] = this.getContainer(document);
                }
                else if(qryprop == qrycons.documents.DOCUMENTATION)
                {
                    propertys[propertys.length] = this.getDocumentation(document);
                }
                else
                {
                    propertys[propertys.length] = new MxAO.MxAOutputObjectProperty("Unknown Property","Value of Unknown Property");
                }
            })
        }
        return propertys;
    }

    //gets Name of a Mendix Document
    protected getName(document : projects.Document) : MxAO.MxAOutputObjectProperty {
        var property : MxAO.MxAOutputObjectProperty;
        
        property = new MxAO.MxAOutputObjectProperty("NAME",document.qualifiedName);
        
        return property;
    }

    //gets Documentation of a Mendix Document
    protected getDocumentation(document : projects.Document) : MxAO.MxAOutputObjectProperty {
        var property : MxAO.MxAOutputObjectProperty;

        property = new MxAO.MxAOutputObjectProperty("DOCUMENTATION","No Value loaded");    //Muss noch richtig implementiert werden aktuell überall No Value muss mit .load(callback) geladen werden.
        
        if(document.isLoaded) {
            var docu = document.documentation;
            docu = docu.replace(/\r/g, "");
            docu = docu.replace(/\n/g, "\t");
            if(docu == "")
            {
                property = new MxAO.MxAOutputObjectProperty("DOCUMENTATION","No Documentation");
            }
            else
            {
                property = new MxAO.MxAOutputObjectProperty("DOCUMENTATION",docu);
            }
        }
        
        return property;
    }
}

