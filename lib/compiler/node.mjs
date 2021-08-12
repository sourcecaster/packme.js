/// This class describes a single entity in manifest (whether it's enum, type or
/// message).

function _isEnumDeclaration(value) {
    return value instanceof Array && value.length > 0 && typeof value[0] === 'string';
}
function _isTypeDeclaration(value) {
    return typeof value === 'object' && !(value instanceof Array) && value != null;
}
function _isMessageDeclaration(value) {
    return value instanceof Array && value.length === 1 && (typeof value[0] === 'object' && value[0] != null);
}
function _isRequestResponseDeclaration(value) {
    return value instanceof Array && value.length === 2 && (typeof value[0] === 'object' && value[0] != null) && (typeof value[1] === 'object' && value[1] != null);
}

let NodeType = {
    enumeration: 1,
    type: 2,
    message: 3,
    request: 4
}

class Node {
    filename;
    name;
    manifest;
    type;

    constructor(filename, name, manifest) {
        this.filename = filename;
        this.name = name;
        this.manifest = manifest;
        if (_isEnumDeclaration(manifest)) this.type = NodeType.enumeration;
        else if (_isTypeDeclaration(manifest)) this.type = NodeType.type;
        else if (_isMessageDeclaration(manifest)) this.type = NodeType.message;
        else if (_isRequestResponseDeclaration(manifest)) this.type = NodeType.request;
        else throw new Error(`"${name}" declaration in "${filename}" is invalid. Use array of strings for enum declaration, object for type declaration or array (with 1 or 2 objects) for messages.`);
    }
}

export {Node, NodeType};