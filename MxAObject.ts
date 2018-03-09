//ClassContainer for a List of MendixObjects
export class MxAObjectList
{
    private objects : MxAObject[];      //Array of Objects

    constructor() {
        this.objects = new Array();
    }

    //Add Object to Container
    public addObject(object : MxAObject) {
        this.objects[this.objects.length] = object;
    }

    //Serialize Container Objects
    public toTextFileString() {
        if(this.objects.length > 0) {
            let result : string = "";
            result += this.objects[0].getHeaderNormalized() + "\n\n"; 
            this.objects.forEach((obj) => {
                result += obj.toStringNormalized() + "\n";
            });
            return result;
        }
        else
        {
            return "No Entrys Found";
        }
        
    }
}

//Container for a single MendixObject
export class MxAObject {
    private propertys : MxAProperty[];   //Array of Propertys
    private normalizedLength : number = 60;

    constructor(propertys : MxAProperty[]) {
        this.propertys = propertys;
    }

    //Add Property to Object
    public addProperty(name : string, value : string) {
        let prop = new MxAProperty(name, value);
        this.propertys[this.propertys.length] = prop
    }

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

    public toStringNormalized() {
        let result : string = "";
        this.propertys.forEach((prop) => {
            var delta = this.normalizedLength - prop.toString().length; 
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

    public getHeaderNormalized() {
        let result : string = "";
        this.propertys.forEach((prop) => {
            var delta = this.normalizedLength - prop.getName().length; 
            var str = prop.getName();
            for(var i = 0; i<delta; i++)
            {
                str += ' ';
            }
            result += str;
        });
        return result;
    }

    
}

//Container for a single MendixProperty
export class MxAProperty {
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