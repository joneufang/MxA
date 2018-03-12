//ClassContainer for a List of MendixObjects
export class MxAOutputObjectList
{
    private objects : MxAOutputObject[];      //Array of Objects
    private propertylength : number = 20;

    constructor() {
        this.objects = new Array();
    }

    //Add Object to Container
    public addObject(object : MxAOutputObject) {
        this.objects[this.objects.length] = object;
    }

    //Serialize Container Objects
    public toTextFileString() {
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