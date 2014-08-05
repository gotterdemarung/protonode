
/**
 * Method argument
 *
 * @param {string|Fqn} type    Argument type
 * @param {string}     name    Argument name
 * @param {boolean}    isArray If true, argument points to array of type
 * @constructor
 */
var Argument = function(type, name, isArray)
{
    this._type    = type;
    this._name    = name;
    this._isArray = !!isArray;
};

/**
 * Returns true, if argument has primitive type (string, int, boolean, etc.)
 *
 * @returns {boolean}
 */
Argument.prototype.isPrimitive = function isPrimitive()
{
    return typeof this._type === "string";
};

/**
 * Returns argument type
 *
 * @returns {string|Fqn}
 */
Argument.prototype.getType = function getType()
{
    return this._type;
};

/**
 * Returns argument name
 *
 * @returns {*}
 */
Argument.prototype.getName = function getName()
{
    return this._name;
};

/**
 * Returns true, if argument points to array of type
 *
 * @returns {boolean}
 */
Argument.prototype.isArray = function isArray()
{
    return this._isArray;
};

/**
 * Returns to string representation of object
 *
 * @returns {string}
 */
Argument.prototype.toString = function toString()
{
    return this.getName();
};


module.exports = Argument;