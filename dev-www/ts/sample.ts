var isDone: boolean = false;

var height: number = 6;

var name: string = "Shahal";

name = "Smith";

var list: number[] = [1,2,3];

var list:Array<number>  = [4,5,6];

enum Color {Red, Blue, Green}

var c:Color = Color.Red;

function printLabel(labelObj: {label: string, name: string}) {
    console.log(labelObj.label);
}

printLabel({name: "Shahal", label: "This is a label"});

interface LabelledValue {
    label: string;
    name: string;
}

function printLabel2(labelObj: LabelledValue) {
    console.log(labelObj.label);
}
printLabel2({name:"Shahal", label:"This is a label"});


class Singleton {
    private static instance: Singleton;

    constructor() {}

    public static getInstance() {
        if (this.instance === null || this.instance === undefined){
            this.instance = new Singleton();
        }

        return this.instance;
    }
}


var singletonA :Singleton = new Singleton();
