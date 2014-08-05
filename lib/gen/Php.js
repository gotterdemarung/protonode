
var Fqn = require("./../Fqn");
var Struct = require("./../Struct");
var Method = require("./../Method");
var Argument = require("./../Argument");
var PhpGenerator = function () {};
PhpGenerator.prototype.tab = '    ';

/**
 * Generates PHP entities
 * 
 * @param {*} value
 * @param {*} context
 * @return {string}
 */
PhpGenerator.prototype.generate = function generate(value, context)
{
    if (value instanceof Fqn) {
        return this._fromFqn(value);
    } else if (value instanceof Struct) {
        return this._fromStruct(value);
    } else if (value instanceof Method) {
        return this._fromMethod(value, context);
    } else if (value instanceof Argument) {
        return this._fromArgument(value, context);
    } else {
        return value;
    }
};

PhpGenerator.prototype._ = PhpGenerator.prototype.generate;

/**
 * @param {Fqn} value
 * @return {string}
 */
PhpGenerator.prototype._fromFqn = function _fromFqn(value)
{
   return value.getName('\\');
};

/**
 * @param {Struct} value
 * @return {string}
 */
PhpGenerator.prototype._fromStruct = function _fromStruct(value)
{
   var r = '';
   var self = this;
   r += "<?php\n\n";
   
   if (!value.getPackage().isEmpty()) {
       r += "namespace " + this._(value.getPackage()) + ";\n\n";
   }
   
   var fqns = value.getAllUsedFqns();
   if (fqns.length > 0) {
       r += 'use ' + fqns.map(function(x) {return self._(x);}).join(";\nuse ");
       r += ";\n\n";
   }
   
   if (value.isInterface()) {
       r += "interface " + value.getName();
   } else if (value.isClass()) {
       r += "class " + value.getName();
       if (value.hasParent()) {
           r += " extends " + this._(value.getBase().getName());
       }
       if (value.hasInterfaces()) {
           r += " implements ";
           r += value.getInterfaces()
                     .map(function(x){ return self._(x.getName());})
                     .join(', ');
       }
   }
   
   r += "\n{\n";
   
   var mm = value.getMethods();
   for (var i=0; i < mm.length; i++) {
       r += this._(mm[i], value);
   }
   
   r += "}\n\n";
   return r;
};

/**
 * @param {Method} value
 * @return {String}
 */
PhpGenerator.prototype._fromMethod = function _fromMethod(value, context) 
{
    var r = "\n";
    var self = this;
    
    r += this.tab + "/*\n";
    r += this.tab + " * Method " + value.getName() + "\n";
    r += this.tab + " *\n";
    r += value.getArguments()
              .map(function(x) { 
                  return self.tab + ' * @param ' 
                       + self.mapType(x.getType(), self) 
                       + (x.isArray() ? '[]' : '')
                       + ' $' + x.getName()
                       + "\n"
                  
              })
              .join('');
    r += this.tab + " * @return " + this.mapType(value.getReturnType()) + "\n";
    r += this.tab + " */\n";
    r += this.tab + "public function " + value.getName();
    r += "(";
    r += value.getArguments()
              .map(function(x) {return self._(x);})
              .join(', ');
    r += ")";
    r += (context && context.isClass() ? "\n" + this.tab +"{\n" + this.tab + "}\n" : ";\n");
    return r;
};

/**
 * @param {Argument} value
 * @return {String}
 */
PhpGenerator.prototype._fromArgument = function _fromArgument(value, context)
{
    if (value.isPrimitive()) {
        return '$' + value.getName();
    } else {
        return this.mapType(value.getType()) + ' $' + value.getName();
    }
}

PhpGenerator.prototype.mapType = function mapType(type, context)
{
    return type;
}

module.exports = new PhpGenerator();