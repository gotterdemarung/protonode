
var Container = require("./../Container");
var Type = require("./../Type");
var Fqn = require("./../Fqn");
var Struct = require("./../Struct");
var Method = require("./../Method");
var Argument = require("./../Argument");

/**
 * Parses incoming Prototype Markup Language and provides container with data
 *
 * @param {string} str
 */
var PmlParser = function (str) {
    this.stats = {
        lines: 0,
        emptyLines: 0,
        comments: 0,
        structures: 0
    };
    this.errors = [];
    this._container = new Container();
    this._parse(str);
};

/**
 * Returns container with structures
 * 
 * @return {Container}
 */
PmlParser.prototype.getContainer = function getContainer()
{
    return this._container;
};

/**
 * Main parse method
 * 
 * @param {string} str
 * @private
 */
PmlParser.prototype._parse = function _parse(str)
{
    var lines = ("" + str).split("\n");
    this.stats.lines = lines.length;
    
    var currentStructure = null;
    
    for (var i = 0; i < this.stats.lines; i++) {
        var line = lines[i];
        var res  = null;

        if (line.trim().length === 0) {
            // Empty line
            this.stats.emptyLines++;
            continue;
        }
        if (line.substring(0, 1) === "#" || line.substring(0, 2) === "//") {
            // Comment
            this.stats.comments++;
            continue;
        }
        
        if (line.substring(0, 1) === " ") {
            // Method detail
            if (currentStructure === null) {
                this.errors.push("Unexpected method at line " + (i + 1));
                continue;
            }
            
            res = this._parseMethod(line, i + 1);
            if (!res) {
                this.errors.push("Unable to parse method signature at line " + (i + 1));
            } else {
                currentStructure.method(res);
            }
        } else {
            // Structure signature
            if (currentStructure !== null) {
                this._container.put(currentStructure);
                currentStructure = null;
            }
            
            res = this._parseStruct(line, i + 1);
            if (!res) {
                this.errors.push("Unable to parse structure signature at line " + (i + 1));
            } else {
                currentStructure = res;
            } 
        }
    }
    
    if (currentStructure !== null) {
        this._container.put(currentStructure);
        currentStructure = null;
    }
    
};

PmlParser.prototype._parseMethodRegex = /([a-z_0-9]+) ([a-z_0-9]+)\(([^\)]*)\)/i;

/**
 * Parses method string
 * 
 * @param {string} str
 * @param {number} line
 * @return {Method}
 */
PmlParser.prototype._parseMethod = function _parseMethod(str, line)
{
    var chunks = this._parseMethodRegex.exec(str);
    if (chunks === null) {
        this.errors.push("Unable to apply method regex at line " + line);
        return null;
    } else {
        var returnType = this._parseType(chunks[1]);
        var name = chunks[2];
        var args = [];
        
        if (chunks[3]) {
            var argChunks = chunks[3].split(",");
            for (var i=0; i < argChunks.length; i++) {
                var tmp = argChunks[i].trim().split(' ');
                args.push(this._parseArg(tmp[0], tmp[1]));
            }
        }
        
        return new Method(name, returnType, args);
    }
};

/**
 * Parses structure
 * 
 * @param {string} str
 * @param {number} line
 * @return {Struct}
 */
PmlParser.prototype._parseStruct = function _parseStruct(str, line)
{
    var chunks = str.replace(/,/g, " ").replace(/[ ]{2,}/, "").split(" ");
    var builder = null;
    var name;
    var base    = null;
    var offset;
    var impl    = [];
    if (chunks.length < 2) {
        this.errors.push("Malformed structure signature on line " + line);
        return null;
    }
    if (chunks[0] === Type.CLASS) {
        builder = Struct.Class;
    } else if (chunks[0] === Type.INTERFACE) {
        builder = Struct.Interface;
    } else {
        this.errors.push("Unknown structure " + chunks[0] + " at line " + line);
        return null;
    }
    
    name   = chunks[1];
    offset = 2;
    if (chunks[2] === "extends") {
        base   = chunks[3];
        offset = 4;
    }
    if (chunks[offset] === "implements") {
        while (true) {
            offset ++;
            if (!chunks[offset]) break;
            impl.push(chunks[offset]);
        }
    }
    
    return builder(name, base, impl);
};

/**
 * Parses argument 
 * 
 * @param {string} type
 * @param {string} name
 */
PmlParser.prototype._parseArg = function _parseArg(type, name)
{
    var tl = type.length;
    if (type.substring(tl-2, tl) === '[]') {
        return new Argument(
            this._parseType(type.substring(0, tl-2)),
            name,
            true
        );
    } else {
        return new Argument(type, name);
    }
};

/**
 * Parses incoming type
 * 
 * @param {string} type
 * @return {string|Fqn}
 */
PmlParser.prototype._parseType = function _parseType(type)
{
    switch (type) {
        case Type.STRING:
        case Type.INT:
        case Type.FLOAT:
        case Type.DOUBLE:
        case Type.BOOL:
        case Type.MIXED:
        case Type.VOID:
            return type;
        default:
            return new Fqn(type);
    }
};


module.exports = PmlParser;