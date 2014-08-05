// Includes
var Fqn = require("./Fqn");

/**
 * Container, that holds structures in key-value hashmap
 *
 * @constructor
 */
var Container = function()
{
    this._structures = {};
    this._count = 0;
};

/**
 * Returns true if container holds required structure
 * 
 * @param {Fqn|string} fqn
 * @return {boolean}
 */
Container.prototype.has = function has(fqn)
{
    if (!(fqn instanceof Fqn)) {
       return this.has(new Fqn(fqn));
    }
    
    return typeof this._structures[fqn.getName()] === "object";
};

/**
 * Returns structure by it's FQN
 * 
 * @param {Fqn|string} fqn
 * @return {Struct}
 */
Container.prototype.get = function get(fqn)
{
   if (!(fqn instanceof Fqn)) {
       return this.get(new Fqn(fqn));
   }
   
   return this._structures[fqn.getName()];
};

/**
 * Registers structure in container
 * 
 * @param {Struct} struct
 * @return {Container}
 */
Container.prototype.put = function put(struct)
{
    var replaced = this.has(struct.getFqn());
    this._structures[struct.getFqn().getName()] = struct;
    if (!replaced) {
        this._count++;
    }
    return this;
};

/**
 * Returns number of structures, stored in container
 * 
 * @return {number}
 */
Container.prototype.size = function size()
{
    return this._count;
};

module.exports = Container;