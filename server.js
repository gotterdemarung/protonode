
var $ = require("./Prototype");

var x = new $.Parse.Pml(require("./fixture/demo"));

console.log(x);
console.log($.Gen.Php.generate(x.getContainer().get('Psr.Log.Logger')));