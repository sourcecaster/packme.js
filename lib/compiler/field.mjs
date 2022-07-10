/// This class describes an individual field in PackMeMessage class.

import {Enum} from './enum.mjs';
import {Message} from './message.mjs';
import {sizeOf} from './utils.mjs';

class MessageField {
    message;
    name;
    type;
    optional;
    array;
    binary;
    binaryLength;

    constructor(message, name, type, optional, array) {
        this.message = message;
        this.name = name;
        this.type = type;
        this.optional = optional;
        this.array = array;
        if (typeof type === 'string' && /^binary\d+$/.test(type)) {
            let length = parseInt(type.substring(6)) || 0;
            if (length <= 0) throw new Error(`Invalid binary data length for "${this.name}" in "${this.message.filename}".`);
            this.type = 'binary';
            this.binary = true;
            this.binaryLength = length;
        }
        else {
            this.type = type;
            this.binary = false;
            this.binaryLength = 0;
        }
    }

    /// Returns required JS Type depending on field type.
    get #type() {
        switch (this.type) {
            case 'bool':
                return 'boolean';
            case 'int8':
            case 'uint8':
            case 'int16':
            case 'uint16':
            case 'int32':
            case 'uint32':
            case 'float':
            case 'double':
                return 'number';
            case 'int64':
            case 'uint64':
                return 'bigint';
            case 'datetime':
                return 'Date';
            case 'string':
                return 'string';
            default:
                if (this.binary) return 'Uint8Array';
                else if (this.type instanceof Enum) return this.type.name;
                else if (this.type instanceof Message) return this.type.name;
                else throw new Error(`Unknown data type "${this.type}" for "${this.name}" in "${this.message.filename}".`);
        }
    }

    /// Returns required pack method depending on field type.
    #pack(name) {
        switch (this.type) {
            case 'bool': return `packBool(${name})`;
            case 'int8': return `packInt8(${name})`;
            case 'uint8': return `packUint8(${name})`;
            case 'int16': return `packInt16(${name})`;
            case 'uint16': return `packUint16(${name})`;
            case 'int32': return `packInt32(${name})`;
            case 'uint32': return `packUint32(${name})`;
            case 'int64': return `packInt64(${name})`;
            case 'uint64': return `packUint64(${name})`;
            case 'float': return `packFloat(${name})`;
            case 'double': return `packDouble(${name})`;
            case 'datetime': return `packDateTime(${name})`;
            case 'string': return `packString(${name})`;
            default:
                if (this.binary) return `packBinary(${name}, ${this.binaryLength})`;
                else if (this.type instanceof Enum) return `packUint8(${name})`;
                else if (this.type instanceof Message) return `packMessage(${name})`;
                else throw new Error(`Unknown data type "${this.type}" for "${this.name}" in "${this.message.filename}".`);
        }
    }

    /// Returns required unpack method depending on field type.
    get #unpack() {
        if (this.binary) return `$unpackBinary(${this.binaryLength})`;
        else if (this.type instanceof Enum) return `$unpackUint8()`;
        else if (this.type instanceof Message) return `$unpackMessage(new ${this.type.name}())`;
        else return `$un${this.#pack('')}`;
    }

    /// Returns type of the field.
    get typeof() {
        return `${this.optional ? '?' : '!'}${this.#type}${this.array ? '[]' : ''}`;
    }

    /// Returns code of class field declaration.
    get declaration() {
        return `/** @type {${this.typeof}} */ ${this.name};`;
    }

    /// Returns code of field declaration as method attribute.
    get attribute() {
        return `/** ${this.typeof} */ ${this.name}`;
    }

    /// Returns code required to estimate size in bytes of this field.
    get estimate() {
        return [
            ...(this.optional ? [`this.$setFlag(this.${this.name} != null);`] : []),
            ...(this.optional ? [`if (this.${this.name} != null) {`] : []),
                ...(!this.array ? [
                    this.binary ? `bytes += ${this.binaryLength};`
                    : (typeof this.type === 'string' || this.type instanceof Enum) && this.type !== 'string' ? `bytes += ${sizeOf(this.type)};`
                    : this.type === 'string' ? `bytes += this.$stringBytes(this.${this.name});`
                    : this.type instanceof Message ? `bytes += this.${this.name}.$estimate();`
                    : (() => { throw new Error(`Wrong type "${this.type}" for field "${this.name}" in "${this.message.filename}".`); })()
                ]
                : [
                    'bytes += 4;',
                    this.binary ? `bytes += ${this.binaryLength} * this.${this.name}.length;`
                    : (typeof this.type === 'string' || this.type instanceof Enum) && this.type !== 'string' ? `bytes += ${sizeOf(this.type)} * this.${this.name}.length;`
                    : this.type === 'string' ? `for (let i = 0; i < this.${this.name}.length; i++) bytes += this.$stringBytes(this.${this.name}[i]);`
                    : this.type instanceof Message ? `for (let i = 0; i < this.${this.name}.length; i++) bytes += this.${this.name}[i].$estimate();`
                    : (() => { throw new Error(`Wrong type "${this.type}" for field "${this.name}" in "${this.message.filename}".`); })()
                ]),
            ...(this.optional ? ['}'] : []),
        ];
    }

    /// Returns code required to pack this field.
    get pack() {
        return [
            ...(!this.array ? [`${this.optional ? `if (this.${this.name} != null) ` : ''}this.$${this.#pack(`this.${this.name}`)};`]
            : [
                ...(this.optional ? [`if (this.${this.name} != null) {`] : []),
                    `this.$packUint32(this.${this.name}.length);`,
                    `for (let item of this.${this.name}) this.$${this.#pack('item')};`,
                ...(this.optional ? ['}'] : []),
            ])
        ];
    }

    /// Returns code required to unpack this field.
    get unpack() {
        return [
            ...(this.optional ? ['if (this.$getFlag()) {'] : []),
                ...(!this.array ? [`this.${this.name} = this.${this.#unpack};`]
                : [
                    `this.${this.name} = [];`,
                    `let ${this.name}Length = this.$unpackUint32();`,
                    `for (let i = 0; i < ${this.name}Length; i++) {`,
                        `this.${this.name}.push(this.${this.#unpack});`,
                    '}',
                ]),
            ...(this.optional ? ['}'] : []),
        ];
    }
}

export {MessageField};