//ClassContainer for a List of MendixObjects
export class MxAObjectList
{
    private objects : MxAObject[];      //Array of Objects

    constructor() {
        this.objects = new Array();
    }

    //Add Object to Container
    public addObject(propertys : MxAProperty[]) {
        let obj = new MxAObject();
        propertys.forEach((prop) => {
            obj.addProperty(prop.getName(), prop.toString());
        })
        this.objects[this.objects.length] = obj;
    }

    //Serialize Container Objects
    public toString() {
        let result : string = "";
        result += this.objects[0].getheader() + "\n"; 
        this.objects.forEach((obj) => {
            result += obj.toString() + "\n";
        });
        return result;
    }
}

//Container for a single MendixObject
export class MxAObject {
    private propertys : MxAProperty[];   //Array of Propertys

    constructor() {
        this.propertys = new Array();
    }

    //Add Property to Object
    public addProperty(name : string, value : string) {
        let prop = new MxAProperty(name, value);
        this.propertys[this.propertys.length] = prop
    }

    //Serialize ObjectData
    public toString() {
        let result : string = "";
        this.propertys.forEach((prop) => {
            result += prop.toString() + "\t";
        });
        return result;
    }

    //Serialize Object Property Names
    public getheader() {
        let result : string = "";
        this.propertys.forEach((prop) => {
            result += prop.getName() + "\t";
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