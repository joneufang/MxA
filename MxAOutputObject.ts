import fs = require("fs-extra");
import XMLWriter = require('xml-writer');


//ClassContainer for a List of OutputObjects
export class MxAOutputObjectList
{
     //Constants to define output target
    protected readonly TEXTFILE = "TEXTFILE";            
    protected readonly HTMLTABLE = "HTMLTABLE";
    protected readonly XML = "XML";
    protected readonly JSON = "JSON";

    private objects : MxAOutputObject[];      //Array of Objects
    private propertylength : number = 20;       //Length of columns for TextFile Output

    constructor() {
        this.objects = new Array();
    }

    //Add Object to Container
    public addObject(object : MxAOutputObject) {
        this.objects[this.objects.length] = object;
    }

    //Sorts all Objects in Container in column order given
    public sort(sortcolumns : string[]) : MxAOutputObjectList
    {
        //console.log("Sort got " + sortcolumns);
        var sortingscount = sortcolumns.length;
        for(var i = (sortingscount - 1); i >= 0; i--)
        {
            var column = sortcolumns[i];
            this.sortColumn(column);
        }
        //Sorting need to be implemented !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        return this;
    }

    protected sortColumn(column : string)
    {
        //console.log("Sort Columns got " + column);
        for (var i=0; i<this.objects.length; i++)
        {
             //console.log(this.objects[i].getPropertyValue(column));
             for(var j=1; j < this.objects.length; j++)
             {
                 if(this.objects[j-1].getPropertyValue(column) > this.objects[j].getPropertyValue(column))
                 {
                     //Tausch
                     var temp = this.objects[j];
                     this.objects[j] = this.objects[j-1];
                     this.objects[j-1] = temp;
                 }
             }
        }
    }

    //Serialize Container Objects for a TextFile
    protected toTextFileString() {
        if(this.objects.length > 0) {
            let result : string = "";
            this.objects.forEach((obj) => {
                if(obj.getLongestPropertySize() > this.propertylength - 3)
                {
                    this.propertylength = obj.getLongestPropertySize() + 3;
                }
            });
            result += this.objects[0].getHeaderNormalized(this.propertylength) + "\n\n"; 
            this.objects.forEach((obj) => {
                result += obj.toStringNormalized(this.propertylength) + "\n";
            });
            return result;
        }
        else
        {
            return "No Entrys Found";
        }
        
    }

    //Serialize Container Objects for a XML File
    protected toXMLFileString() {
        if(this.objects.length > 0) {
            let result : string = "";
            result += "<?xml version=\"1.0\"?>\n";
            this.objects.forEach((obj) => {
                result += "<MxAObject>" + "\n";
                result += obj.toXMLString();
                result += "</MxAObject>" + "\n";
            });
            return result;
        }
        else
        {
            return "No Entrys Found";
        }
    }

    /*
    protected toXMLFileString2() {
        var xml = new XMLWriter();
        
        
        if(this.objects.length > 0) {
            xml.startDocument();
            this.objects.forEach((obj) => {
                xml.startElement("MxAObject");
                xml = obj.toXMLString2(xml);
                xml.endElement();
            });
            xml.endDocument();
            return xml.toString();
        }
        else
        {
            return "No Entrys Found";
        }
    }*/

    //Gives out OutputObjectList
    public returnResult(resultType : string, target : string) {
        if(resultType == this.TEXTFILE)
        {
            fs.outputFile(target, this.toTextFileString());
        }                                                       //Add ResultTypes Here
        else if(resultType == this.XML) {
            fs.outputFile(target, this.toXMLFileString());
        }
        else
        {
            console.log("Wrong ResultType");
        }
    }

    
}

//Container for a single MendixObject
export class MxAOutputObject {
    private propertys : MxAOutputObjectProperty[];   //Array of Propertys

    constructor(propertys : MxAOutputObjectProperty[]) {
        this.propertys = propertys;
    }

    //Add Property to Object
    public addProperty(name : string, value : string) {
        let prop = new MxAOutputObjectProperty(name, value);
        this.propertys[this.propertys.length] = prop
    }

    //Get Value of given property
    public getPropertyValue(name : string)
    {
        var value : string = "Property not found";
        this.propertys.forEach((prop) => {
            if(prop.getName() == name)
            {
                value = prop.toString();
            }
        });
        return value; 
    }

    //Serialize ObjectData
    public toString() {
        let result : string = "";
        this.propertys.forEach((prop) => {
            result += prop.toString() + "\t";
        });
        return result;
    }

    //Serialzie ObjectData to XML
    public toXMLString() {
        let result : string = "";
        this.propertys.forEach((prop) => {
            result += "\t<" + prop.getName() + ">" + prop.toString() + "</" + prop.getName() + ">" + "\n";
        });
        return result;
    }

    /*
    public toXMLString2(xml : XMLWriter) {
        this.propertys.forEach((prop) => {
            xml.startElement(prop.getName());
            xml.text(prop.toString());
            xml.endElement();
        });
        return xml;
    }*/

    //Serialize ObjectData with Column length size for TextFile Output
    public toStringNormalized(size : number) {
        let result : string = "";
        this.propertys.forEach((prop) => {
            var delta = size - prop.toString().length; 
            var str = prop.toString();
            for(var i = 0; i<delta; i++)
            {
                str += ' ';
            }
            result += str;
        });
        return result;
    }

    //Serialize Object Property Names
    public getHeader() {
        let result : string = "";
        this.propertys.forEach((prop) => {
            result += prop.getName() + "\t";
        });
        return result;
    }

    //Serialize Object Property Names with Column length size for TextFile Output
    public getHeaderNormalized(size : number) {
        let result : string = "";
        this.propertys.forEach((prop) => {
            var delta = size - prop.getName().length; 
            var str = prop.getName();
            for(var i = 0; i<delta; i++)
            {
                str += ' ';
            }
            result += str;
        });
        return result;
    }

    //gets Length of the longest property in the Object
    public getLongestPropertySize() {
        var size : number = 0;
        this.propertys.forEach((prop) => {
            if(prop.toString().length > size)
            {
                size = prop.toString().length;
            }
        });
        return size;
    }
}

//Container for a single MendixProperty
export class MxAOutputObjectProperty {
    private name : string;      //Name of the Property
    private value : string;     //Value of the Property

    constructor(name : string, value : string) {
        this.name = name;
        this.value = value;
    }

    //getName of Property
    public getName() {
        return this.name;
    }

    //getValue of Property
    public toString() {
        return this.value;
    }
}