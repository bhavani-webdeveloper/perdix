var isDone = false;
var height = 6;
var name = "Shahal";
name = "Smith";
var list = [1, 2, 3];
var list = [4, 5, 6];
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Blue"] = 1] = "Blue";
    Color[Color["Green"] = 2] = "Green";
})(Color || (Color = {}));
var c = Color.Red;
function printLabel(labelObj) {
    console.log(labelObj.label);
}
printLabel({ name: "Shahal", label: "This is a label" });
function printLabel2(labelObj) {
    console.log(labelObj.label);
}
printLabel2({ name: "Shahal", label: "This is a label" });
var Singleton = (function () {
    function Singleton() {
    }
    Singleton.getInstance = function () {
        if (this.instance === null || this.instance === undefined) {
            this.instance = new Singleton();
        }
        return this.instance;
    };
    return Singleton;
})();
var singletonA = new Singleton();
//# sourceMappingURL=sample.js.map