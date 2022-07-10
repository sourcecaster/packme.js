/// This class describes PackMeMessage class (like request classes, response
/// classes or nested data classes).

import {Enum} from './enum.mjs';
import {MessageField} from './field.mjs';
import {FieldType} from './fieldtype.mjs';
import {enums, types} from './parser.mjs';
import {sizeOf, validName, reserved} from './utils.mjs';

class Message extends FieldType {
    id;
    responseClass;
    manifest;
    bufferSize = 0;
    flagBytes;

    fields = {};
    code = [];
    nested = [];
    references = [];

    #initialized = false;

    constructor(filename, name, manifest, id, responseClass) {
        super(filename, name);
        this.manifest = manifest;
        if (id != null) this.id = id;
        if (responseClass != null) this.responseClass = responseClass;
    }

    #refer(reference) {
        if (this.references.indexOf(reference) === -1) this.references.push(reference);
    }

    /// Parse manifest and initialize everything.
    #init() {
        if (this.#initialized) return;
        let entries = Object.entries(this.manifest);
        for (let entry of entries) {
            let fieldName = validName(entry[0]);
            if (fieldName === '') throw new Error(`Field name declaration "${entry[0]}" is invalid for "${this.name}" in "${this.filename}".`);
            if (this.fields[fieldName] != null) throw new Error(`Message field name "${fieldName}" is duplicated for "${this.name}" in "${this.filename}".`);
            if (reserved.indexOf(fieldName) !== -1) throw new Error(`Message field name "${fieldName}" is reserved by Dart for "${this.name}" in "${this.filename}".`);
            let optional = entry[0][0] === '?';
            let array = entry[1] instanceof Array;
            if (array && entry[1].length !== 1) throw new Error(`Array declarations must contain only one type: "${entry[1]}" is invalid for field "${fieldName}" of "${this.name}" in "${this.filename}".`);
            let value = array ? entry[1][0] : entry[1];

            /// Field is a nested Message object.
            if (typeof value === 'object' && !(value instanceof Array) && value !== null) {
                let postfix = validName(entry[0], true);
                if (array && postfix[postfix.length - 1] === 's') postfix = postfix.substring(0, postfix.length - 1);
                this.nested.push(value = new Message(this.filename, `${this.name}${postfix}`, value));
            }

            /// Field is an Enum or a referenced Message object.
            else if (typeof value === 'string' && value[0] === '@') {
                let enumeration = enums[value.substring(1)];
                let message = types[value.substring(1)];
                if (enumeration != null) this.#refer(enumeration);
                else if (message != null) this.#refer(message);
                else throw new Error(`"${this.name}" field "${fieldName}" in "${this.filename}" type "${value}" is not declared.`);
                value = enumeration || message;
            }

            this.fields[fieldName] = new MessageField(this, fieldName, value, optional, array);
            if (!optional && !array && (typeof value === 'string' || value instanceof Enum) && value !== 'string') {
                if (this.fields[fieldName].binary) this.bufferSize += this.fields[fieldName].binaryLength;
                else if (sizeOf(value) != null) this.bufferSize += sizeOf(value);
                else throw new Error(`Unknown type "${value}" for field "${fieldName}" of "${this.name}" in "${this.filename}".`);
            }
        }
        /// We need to estimate class data size in order to create buffer.
        /// Only optional fields require existence flags (bits).
        let optionalCount = Object.values(this.fields).filter((f) => f.optional).length;
        /// Add required bytes to store field existence flags.
        this.flagBytes = Math.ceil(optionalCount / 8);
        this.bufferSize += this.flagBytes;
        /// Add 4 bytes for command ID and transaction ID
        if (this.id != null) this.bufferSize += 8;
        this.#initialized = true;
    }

    /// Generate Message class code lines.
    #parse() {
        this.code = [];
        this.code.push(...[
            `class ${this.name} extends PackMeMessage {`,

            ...Object.values(this.fields).map((field) => field.declaration),
            '',
            ...(Object.keys(this.fields).length > 0 ? [
                'constructor(',
                    ...Object.values(this.fields).map((field) => `\t${field.attribute},`),
                ') {',
                    'super();',
                    'if (arguments.length > 0) {',
                    ...Object.values(this.fields).filter((field) => !field.optional).map((field) => `this.$check('${field.name}', ${field.name});`),
                    '}',
                    ...Object.values(this.fields).map((field) => `this.${field.name} = ${field.name};`),
                '}'
            ]
            : [
                'constructor() {',
                    'super();',
                '}'
            ]),
            '',

            ...(this.responseClass != null ? [
                `/** @return {${this.responseClass.name}} */`,
                ...(Object.keys(this.responseClass.fields).length > 0 ? [
                    '$response(',
                    ...Object.values(this.responseClass.fields).map((field) => `\t${field.attribute},`),
                    ') {'
                ]
                : [`$response() {`]),
                    `let message = new ${this.responseClass.name}(` +
                    Object.values(this.responseClass.fields).map((field) => field.name).join(', ') +
                    ');',
                    'message.$request = this;',
                    'return message;',
                '}\n',
            ] : []),

            '/** @return {number} */',
            '$estimate() {',
                'this.$reset();',
                `let bytes = ${this.bufferSize};`,
                ...Object.values(this.fields).reduce((a, b) => {
                    if (b.optional || b.array || b.type === 'string' || b.type instanceof Message) {
                        return a.concat(b.estimate);
                    }
                    else return a;
                }, []),
                'return bytes;',
            '}\n',

            '/** @return {undefined} */',
            '$pack() {',
                ...(this.id != null ? [`this.$initPack(${this.id});`] : []),
                ...(this.flagBytes > 0 ? [`for (let i = 0; i < ${this.flagBytes}; i++) this.$packUint8(this.$flags[i]);`] : []),
                ...Object.values(this.fields).reduce((a, b) => a.concat(b.pack), []),
            '}\n',

            '/** @return {undefined} */',
            '$unpack() {',
                ...(this.id != null ? ['this.$initUnpack();'] : []), // command ID
                ...(this.flagBytes > 0 ? [`for (let i = 0; i < ${this.flagBytes}; i++) this.$flags.push(this.$unpackUint8());`] : []),
                ...Object.values(this.fields).reduce((a, b) => a.concat(b.unpack), []),
            '}\n',

            '/** @return {string} */',
            'toString() {',
                `return \`${this.name}\\x1b[0m(${Object.values(this.fields).map((field) => `${field.name}: \${PackMe.dye(this.${field.name})}`).join(', ')})\`;`,
            '}',

            '}\n',
        ]);
    }

    /// Return resulting code for current Message class and all nested ones.
    output() {
        this.#init();
        let result = [];
        this.#parse();
        for (let message of this.nested) {
            result.push(...message.output());
        }
        result.push(...this.code);
        return result;
    }
}

export {Message};