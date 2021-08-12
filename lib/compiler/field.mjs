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

    constructor(message, name, type, optional, array) {
        this.message = message;
        this.name = name;
        this.type = type;
        this.optional = optional;
        this.array = array;
    }

    /// Returns field name including exclamation mark if necessary.
    get #name() {
        return `${this.name}${this.optional ? '!' : ''}`;
    }

    /// Returns required Dart Type depending on field type.
    get #type() {
        switch (this.type) {
            case 'bool':
                return 'bool';
            case 'int8':
            case 'uint8':
            case 'int16':
            case 'uint16':
            case 'int32':
            case 'uint32':
            case 'int64':
            case 'uint64':
                return 'int';
            case 'float':
            case 'double':
                return 'double';
            case 'datetime':
                return 'DateTime';
            case 'string':
                return 'String';
            default:
                if (this.type instanceof Enum) return this.type.name;
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
                if (this.type instanceof Enum) return `packUint8(${name}.index)`;
                else if (this.type instanceof Message) return `packMessage(${name})`;
                else throw new Error(`Unknown data type "${this.type}" for "${this.name}" in "${this.message.filename}".`);
        }
    }

    /// Returns required unpack method depending on field type.
    get #unpack() {
        if (this.type instanceof Enum) return `${this.#type}.values[$unpackUint8()]`;
        else if (this.type instanceof Message) return `$unpackMessage(${this.type.name}.$empty())`;
        else return `$un${this.#pack('')}`;
    }

    /// Returns code of class field declaration.
    get declaration() {
        if (!this.array) return `${this.optional ? '' : 'late '}${this.#type}${this.optional ? '?' : ''} ${this.name};`;
        else return `${this.optional ? '' : 'late '}List<${this.#type}>${this.optional ? '?' : ''} ${this.name};`;
    }

    /// Returns code of field declaration as method attribute.
    get attribute() {
        if (!this.array) return `${this.optional ? '' : 'required '}${this.#type}${this.optional ? '?' : ''} ${this.name},`;
        else return `${this.optional ? '' : 'required '}List<${this.#type}>${this.optional ? '?' : ''} ${this.name},`;
    }

    /// Returns code required to estimate size in bytes of this field.
    get estimate() {
        return [
            ...(this.optional ? [`$setFlag(${this.name} != null);`] : []),
            ...(this.optional ? [`if (${this.name} != null) {`] : []),
                ...(!this.array ? [
                    (typeof this.type === 'string' || this.type instanceof Enum) && this.type !== 'string' ? `bytes += ${sizeOf(this.type)};`
                    : this.type === 'string' ? `bytes += $stringBytes(${this.#name});`
                    : this.type instanceof Message ? `bytes += ${this.#name}.$estimate();`
                    : (() => { throw new Error(`Wrong type "${this.type}" for field "${this.name}" in "${this.message.filename}".`); })()
                ]
                : [
                    'bytes += 4;',
                    (typeof this.type === 'string' || this.type instanceof Enum) && this.type !== 'string' ? `bytes += ${sizeOf(this.type)} * ${this.#name}.length;`
                    : this.type === 'string' ? `for (int i = 0; i < ${this.#name}.length; i++) bytes += $stringBytes(${this.#name}[i]);`
                    : this.type instanceof Message ? `for (int i = 0; i < ${this.#name}.length; i++) bytes += ${this.#name}[i].$estimate();`
                    : (() => { throw new Error(`Wrong type "${this.type}" for field "${this.name}" in "${this.message.filename}".`); })()
                ]),
            ...(this.optional ? ['}'] : []),
        ];
    }

    /// Returns code required to pack this field.
    get pack() {
        return [
            ...(!this.array ? [`${this.optional ? `if (${this.name} != null) ` : ''}$${this.#pack(this.#name)};`]
            : [
                ...(this.optional ? [`if (${this.name} != null) {`] : []),
                    `$packUint32(${this.#name}.length);`,
                    `for (final ${this.#type} item in ${this.#name}) $${this.#pack('item')};`,
                ...(this.optional ? ['}'] : []),
            ])
        ];
    }

    /// Returns code required to unpack this field.
    get unpack() {
        return [
            ...(this.optional ? ['if ($getFlag()) {'] : []),
                ...(!this.array ? [`${this.name} = ${this.#unpack};`]
                : [
                    `${this.name} = <${this.#type}>[];`,
                    `final int ${this.name}Length = $unpackUint32();`,
                    `for (int i = 0; i < ${this.name}Length; i++) {`,
                        `${this.#name}.add(${this.#unpack});`,
                    '}',
                ]),
            ...(this.optional ? ['}'] : []),
        ];
    }
}

export {MessageField};