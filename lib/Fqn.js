
/**
 * Fully qualified name
 *
 * @param {string} name
 * @constructor
 */
var Fqn = function(name) 
{
    // Simplifying name
    this._name = name
        .replace(/\//g, ".")
        .replace(/\\/g, ".")
        .trim();
    
    this._chunks = this._name.split(/\./);
};

/**
 * Returns package name
 * 
 * @param {string} [separator="."] separator - Separator to use.
 * @return {string}
 */
Fqn.prototype.getName = function getName(separator)
{
    if (separator) {
        return this._name.replace(/\./g, separator);
    } else {
        return this._name;
    }
};

/**
 * Returns true if fqn is empty
 *
 * @return {boolean}
 */
Fqn.prototype.isEmpty = function isEmpty()
{
    return this._name === "";
};

/**
 * Returns amount of chunks
 * 
 * @return {number}
 */
Fqn.prototype.size = function size()
{
    return this._chunks.length;
};

/**
 * Returns chunk by it offset.
 * If illegal offset provided (i.e. -1) returns last chunk
 * 
 * @param {number} offset
 * @return {string}
 */
Fqn.prototype.getChunk = function getChunk (offset)
{
    if (typeof offset !== "number" || offset < 0 || offset >= this.size()) {
        // Returning last element
        return this._chunks[this.size() - 1];
    } else {
        return this._chunks[offset];
    }
};

/**
 * Returns parent Fqn (i.e. package)
 * 
 * @return {Fqn}
 */
Fqn.prototype.getParent = function getParent()
{
    if (this.size() === 0) {
        return this;
    } else if (this.size() === 1) {
        return new Fqn("");
    } else {
        return new Fqn(
            this._chunks
                .slice(0, this._chunks.length - 1)
                .join(".")
        );
    }
};

/**
 * Returns to string representation of object
 * 
 * @return {string}
 */
Fqn.prototype.toString = function toString()
{
    return this.getName();
};

module.exports = Fqn;