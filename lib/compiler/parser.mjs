import {Enum} from './enum.mjs';
import {Message} from './message.mjs';
import {NodeType} from './node.mjs';
import {validName} from './utils.mjs';

let enums = {};
let types = {};
let messages = new Map();

function _nameDuplicated(name, filename) {
    for (let key of Object.keys(enums)) if (name === key) return true;
    for (let key of Object.keys(types)) if (name === key) return true;
    for (let message of messages.values()) {
        if (name === message.name && (filename == null || message.filename === filename)) return true;
    }
    return false;
}

function _parseEnum(node) {
    let name = validName(node.name, true);
    if (_nameDuplicated(name)) throw new Error(`Enum "${name}" in "${node.filename}" duplicates the name of another enum, type or message.`);
    for (let element of node.manifest) {
        if (typeof element !== 'string') throw new Error(`Enum "${name}" declaration must contain string values only.`);
    }
    enums[node.name] = new Enum(node.filename, name, node.manifest);
}

function _parseType(node) {
    let name = validName(node.name, true);
    if (_nameDuplicated(name)) throw new Error(`Type "${name}" in "${node.filename}" duplicates the name of another type, enum or message.`);
    types[node.name] = new Message(node.filename, name, node.manifest);
}

function _parseCommand(node) {
    let name = validName(node.name, true);
    let nameMessage = `${name}Message`;
    let nameRequest = `${name}Request`;
    let nameResponse = `${name}Response`;
    let hashMessage = `${node.filename}${nameMessage}`.hashCode.toString();
    let hashRequest = `${node.filename}${nameRequest}`.hashCode.toString();
    let hashResponse = `${node.filename}${nameResponse}`.hashCode.toString();

    if (node.type === NodeType.message) {
        if (_nameDuplicated(nameMessage, node.filename)) {
            throw new Error(`Message "${nameMessage}" in "${node.filename}" duplicates the name of another message, type or enum.`);
        }
        if (messages.has(hashMessage)) {
            throw new Error(`Message name "${nameMessage}" in "${node.filename}" hash code turned out to be the same as for "${messages.get(hashMessage).name}". Please try another name.`);
        }
        messages.set(hashMessage, new Message(node.filename, nameMessage, node.manifest[0], hashMessage));
    }

    if (node.type === NodeType.request) {
        if (_nameDuplicated(nameRequest, node.filename)) {
            throw new Error(`Message "${nameRequest}" in "${node.filename}" duplicates the name of another message, type or enum.`);
        }
        if (_nameDuplicated(nameResponse, node.filename)) {
            throw new Error(`Message "${nameResponse}" in "${node.filename}" duplicates the name of another message, type or enum.`);
        }
        if (messages.has(hashRequest)) {
            throw new Error(`Message "${nameRequest}" in "${node.filename}" name hash code turned out to be the same as for "${messages.get(hashRequest).name}". Please try another name.`);
        }
        if (messages.has(hashResponse)) {
            throw new Error(`Message "${nameResponse}" in "${node.filename}" name hash code turned out to be the same as for "${messages.get(hashResponse).name}". Please try another name.`);
        }
        messages.set(hashResponse, new Message(node.filename, nameResponse, node.manifest[1], hashResponse));
        messages.set(hashRequest, new Message(node.filename, nameRequest, node.manifest[0], hashRequest, messages.get(hashResponse)));
    }
}

function parse(nodes) {
    let codePerFile = {};
    for (let node of nodes) if (codePerFile[node.filename] == null) codePerFile[node.filename] = [];
    nodes.filter((node) => node.type === NodeType.enumeration).forEach(_parseEnum);
    nodes.filter((node) => node.type === NodeType.type).forEach(_parseType);
    nodes.filter((node) => node.type === NodeType.message || node.type === NodeType.request).forEach(_parseCommand);

    for (let filename of Object.keys(codePerFile)) {
        codePerFile[filename] = [
            "import 'package:packme/packme.dart';",
            '',
            ...Object.values(enums).filter((item) => item.filename === filename)
                .reduce((a, b) => a.concat(b.output()), []),
            ...Object.values(types).filter((item) => item.filename === filename)
                .reduce((a, b) => a.concat(b.output()), []),
            ...[...messages.values()].filter((item) => item.filename === filename)
                .reduce((a, b) => a.concat(b.output()), []),
            `final Map<int, PackMeMessage Function()> ${validName(filename)}MessageFactory = <int, PackMeMessage Function()>{`,
            ...[...messages.entries()].filter((entry) => entry[1].filename === filename)
                .map((entry) => `${entry[0]}: () => ${entry[1].name}.$empty(),`),
            '};'
        ];

        /// Add additional import lines according to messages' references data.
        let references = [];
        for (let message of [...messages.values()].filter((item) => item.filename === filename)) {
            references.push(...message.references.filter((reference) => references.indexOf(reference) === -1));
        }
        let imports = {};
        for (let reference of references) {
            /// Skip if enum/type declaration is in the same file.
            if (reference.filename === filename) continue;
            if (imports[reference.filename] == null) imports[reference.filename] = [];
            if (imports[reference.filename].indexOf(reference.name) === -1) {
                imports[reference.filename].push(reference.name);
            }
        }
        let keys = Object.keys(imports);

        /// Sort imports properly.
        keys.sort((a, b) => {
            a = `${a}.generated.dart`;
            b = `${b}.generated.dart`;
            return a > b ? 1 : a < b ? -1 : 0;
        });
        keys.reverse();
        for (let key of keys) {
            imports[key].sort();
            codePerFile[filename].splice(1, 0, `import '${key}.generated.dart' show ${imports[key].join(', ')};`);
        }
    }
    return codePerFile;
}

export {enums, types, messages, parse};