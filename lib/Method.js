/**
 * Method
 *
 * @param {string}     name
 * @param {string|Fqn} returns
 * @param {Argument[]} args
 * @constructor
 */
var Method = function(name, returns, args)
{
    this._name      = name;
    this._returns   = returns;
    if (args) {
        this._arguments = args;
    } else {
        this._arguments = [];
    }
};


/**
 * Returns method name
 * 
 * @return {string}
 */
Method.prototype.getName = function getName()
{
    return this._name;
};

/**
 * Returns return type of the method
 * 
 * @return {string|Fqn}
 */
Method.prototype.getReturnType = function getReturnType()
{
    return this._returns;
};

/**
 * Returns arguments of method
 * 
 * @return {Argument[]}
 */
Method.prototype.getArguments = function getArguments()
{
    return this._arguments;
};

/**
 * Returns string representation of object
 * 
 * @return {string}
 */
Method.prototype.toString = function toString()
{
    return this.getName();
};

module.exports = Method;