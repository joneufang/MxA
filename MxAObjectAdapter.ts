import {ModelSdkClient, IModel, IModelUnit, domainmodels, utils, pages, customwidgets, projects, documenttemplates, AbstractElement} from "mendixmodelsdk";
import * as MxAO from "./MxAOutputObject";
import * as qrycons from "./QueryConstants";

export class MxAObjectAdapter {

    protected getId(object : AbstractElement) : MxAO.MxAOutputObjectProperty {
        var property : MxAO.MxAOutputObjectProperty;

        property = new MxAO.MxAOutputObjectProperty("ID",object.id);

        return property; 
    }

    protected getType(object : AbstractElement) : MxAO.MxAOutputObjectProperty {
        var property : MxAO.MxAOutputObjectProperty;

        property = new MxAO.MxAOutputObjectProperty("Type",object.structureTypeName);

        return property; 
    }

    protected getContainer(object : AbstractElement) : MxAO.MxAOutputObjectProperty {
        var property : MxAO.MxAOutputObjectProperty;
        var container = "Kein Container"

        try{
            var fbase = object.container;
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
        property = new MxAO.MxAOutputObjectProperty("Container",container);

        return property; 
    }
}

export class MxADocumentAdapter extends MxAObjectAdapter {
    
    protected name : string;
    
    public getPropertys(document : projects.Document, qrypropertys : string[]) : MxAO.MxAOutputObjectProperty[] {
        var propertys : MxAO.MxAOutputObjectProperty[] = new Array();

        qrypropertys.forEach((qryprop) => {
            if(qryprop == qrycons.documents.propertys.ID)
            {
                propertys[propertys.length] = this.getId(document);
            }
            else if(qryprop == qrycons.documents.propertys.NAME)
            {
                propertys[propertys.length] = this.getName(document);
            }
            else if(qryprop == qrycons.documents.propertys.TYPE)
            {
                propertys[propertys.length] = this.getType(document);
            }
            else if(qryprop == qrycons.documents.propertys.CONTAINER)
            {
                propertys[propertys.length] = this.getContainer(document);
            }
            else
            {
                propertys[propertys.length] = new MxAO.MxAOutputObjectProperty("Unknown Property","Value of Unknown Property");
            }
        })
        return propertys;
    }

    protected getName(document : projects.Document) : MxAO.MxAOutputObjectProperty {
        var property : MxAO.MxAOutputObjectProperty;
        
        property = new MxAO.MxAOutputObjectProperty("Name",document.qualifiedName);
        
        return property;
    }
}

