module.exports = {
    Argument  : require("./lib/Argument"),
    Container : require("./lib/Container"),
    Fqn       : require("./lib/Fqn"),
    Method    : require("./lib/Method"),
    Struct    : require("./lib/Struct"),
    Type      : require("./lib/Type"),

    Parse: {
        Pml: require("./lib/parse/PmlParser")
    },
    Gen: {
        Php: require("./lib/gen/Php.js")
    }
};