export class MxAObjectList
{
    private objects : MxAObject[];

    constructor() {
        this.objects = new Array();
    }

    public addObject(propertys : MxAProperty[]) {
        let obj = new MxAObject();
        propertys.forEach((prop) => {
            obj.addProperty(prop.getName(), prop.toString());
        })
        this.objects[this.objects.length] = obj;
    }

    public toString() {
        let result : string = "";
        result += this.objects[0].getheader() + "\n"; 
        this.objects.forEach((obj) => {
            result += obj.toString() + "\n";
        });
        return result;
    }
}


export class MxAObject {
    private propertys : MxAProperty[];

    constructor() {
        this.propertys = new Array();
    }

    public addProperty(name : string, value : string) {
        let prop = new MxAProperty(name, value);
        this.propertys[this.propertys.length] = prop
    }

    public toString() {
        let result : string = "";
        this.propertys.forEach((prop) => {
            result += prop.toString() + "\t";
        });
        return result;
    }

    public getheader() {
        let result : string = "";
        this.propertys.forEach((prop) => {
            result += prop.getName() + "\t";
        });
        return result;
    }
}

export class MxAProperty {
    private name : string;
    private value : string;

    constructor(name : string, value : string) {
        this.name = name;
        this.value = value;
    }

    public getName() {
        return this.name;
    }

    public toString() {
        return this.value;
    }
}