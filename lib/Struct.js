// Includes
var Fqn = require('./Fqn');
var Type = require('./Type');
var Method = require('./Method');
var Argument = require('./Argument');

/**
 * Represents class or interface
 *
 * @param {string}         name
 * @param {string|Fqn}     baseStruct
 * @param {string[]|Fqn[]} interfaces
 * @constructor
 */
var Struct = function (name, baseStruct, interfaces)
{
    this._fqn        = new Fqn("" + name);
    this._name       = this._fqn.getChunk(-1);
    this._type       = Type.CLASS;
    this._package    = this._fqn.getParent();
    this._base       = null;
    this._interfaces = [];
    this._methods    = {};
    
    // Inflating parent
    if (baseStruct) {
        if (baseStruct instanceof Fqn) {
            this._base = baseStruct;
        } else {
            this._base = new Fqn(baseStruct);
        }
    }
    
    // Inflating interfaces
    if (interfaces && Array.isArray(interfaces)) {
        for (var i = 0; i < interfaces.length; i++) {
            if (!interfaces[i]) {
                continue;
            }
            
            if (interfaces[i] instanceof Fqn) {
                this._interfaces.push(interfaces[i]);
            } else {
                this._interfaces.push(new Fqn(interfaces[i]));
            }
        }
    }
};

/**
 * Returns true if struct extends parent struct
 * 
 * @return {boolean}
 */
Struct.prototype.hasParent = function hasParent()
{
    return !!this._base;
};

/**
 * Returns struct's parent
 * 
 * @return {Fqn}
 */
Struct.prototype.getParentName = function getParentName()
{
    return this._base;
};

/**
 * Returns true if struct has at least one interface
 * 
 * @return {boolean}
 */
Struct.prototype.hasInterfaces = function hasInterfaces()
{
    return this._interfaces.length > 0;
};

/**
 * Returns list of interfaces
 * 
 * @return {Struct[]}
 */
Struct.prototype.getInterfaces = function getInterfaces()
{
    return this._interfaces;
};

/**
 * Returns true if struct is class
 * 
 * @return {boolean}
 */
Struct.prototype.isClass = function isClass()
{
    return this._type === Type.CLASS;
};

/**
 * Returns true if struct is interface
 * 
 * @return {boolean}
 */
Struct.prototype.isInterface = function isInterface()
{
    return this._type === Type.INTERFACE;
};

/**
 * Returns short name of struct
 * 
 * @return {string}
 */
Struct.prototype.getName = function getName()
{
    return this._name;
};

/**
 * Returns fully-qualified name
 * 
 * @return {Fqn}
 */
Struct.prototype.getFqn = function getFqn()
{
    return this._fqn;
};

/**
 * Returns all FQNs, used by struct (extends, implements, method return types, arguments)
 * 
 * @return {Fqn[]}
 */
Struct.prototype.getAllUsedFqns = function getAllUsedFqns()
{
   var used = []; 
   if (this.hasParent()) {
       used.push(this.getParentName());
   }
   used = used.concat(this.getInterfaces().map(function(x) {return x.getFqn();}));
   
   var mm = this.getMethods();
   for (var i=0; i < mm.length; i++) {
       var m = mm[i];
       if (typeof m.getReturnType() !== "string") {
           used.push(m.getReturnType());
       }
       var aa = m.getArguments();
       for (var j = 0; j < aa.length; j++) {
           var a = aa[j];
           if (!a.isPrimitive()) {
               used.push(a.getType());
           }
       }
   }
   
   return used;
};

/**
 * Returns struct package
 * 
 * @return {Fqn|null}
 */
Struct.prototype.getPackage = function getPackage()
{
    if (this._package.isEmpty()) {
        return null;
    } else {
        return this._package;
    }
};

/**
 * Returns list of methods
 *
 * @param {Container=} container - Container to use for FQN to struct resolving
 * @return {Method[]}
 */
Struct.prototype.getMethods = function getMethods(container)
{
    var methods = [];
    
    // Native methods
    for (var key in this._methods) {
        if (this._methods.hasOwnProperty(key)) {
            methods.push(this._methods[key]);
        }
    }

    if (container) {
        // Base methods
        if (this.hasParent() && container.has(this.getParentName())) {
            methods = methods.concat(container.get(this.getParentName()).getMethods());
        }

        // Interface methods
        if (this.hasInterfaces()) {
            for (var i = 0; i < this._interfaces.length; i++) {
                var ii = this._interfaces[i];
                if (container.has(ii)) {
                    methods = methods.concat(container.get(ii));
                }
            }
        }
    }
    
    return methods;
};

/**
 * Adds or returns method
 * 
 * @param {Method|string} nameOrMethod If string provided returns method by its name, else add new one
 * @return {Struct|Method}
 */
Struct.prototype.method = function method(nameOrMethod)
{
    if (typeof nameOrMethod === "string") {
        return this._methods[nameOrMethod];
    } else if (nameOrMethod instanceof Method) {
        this._methods[nameOrMethod.getName()] = nameOrMethod;
        return this;
    } else {
        throw "Unsupported argument. Expected 'string' or 'Method'";
    }
};

/**
 * Adds getter method
 * 
 * @param {Argument} argument
 * @return {Struct}
 */
Struct.prototype.getter = function getter(argument)
{
    if (!(argument instanceof Argument)) {
        throw "Expecting 'Argument'";
    }
    return this.method(
        new Method(
            "get" + capitalize(argument.getName()),
            argument.getType()
        )
    );
};

/**
 * Adds setter method
 * 
 * @param {Argument} argument
 * @return {Struct}
 */
Struct.prototype.setter = function getter(argument)
{
    if (!(argument instanceof Argument)) {
        throw "Expecting 'Argument'";
    }
    return this.method(
        new Method(
            "set" + capitalize(argument.getName()),
            Type.VOID,
            [new Argument(argument.getType(), argument.getName())]
        )
    );
};

/**
 * Returns struct name
 * 
 * @return {string}
 */
Struct.prototype.toString = function toString()
{
    return this._fqn.toString();
};

/**
 * Factory method to build class
 * 
 * @return {Struct}
 */
Struct.Class = function Class(classname, baseStruct, interfaces) {
    return new Struct(classname, baseStruct, interfaces);
};

/**
 * Factory method to build interface
 * 
 * @return {Struct}
 */
Struct.Interface = function Interface(classname, baseStruct, interfaces) {
    var str = new Struct(classname, baseStruct, interfaces);
    str._type = Type.INTERFACE;
    
    return str;
};


/**
 * Utility function to capitalize strings
 * 
 * @param {string} str
 * @return {string}
 */
function capitalize(str)
{
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = Struct;