// This class describes a single field entry of the object, message or request.

import { validName, isReserved, isObject } from './utils.js';
import ArrayField from './fields/array.js';
import BinaryField from './fields/binary.js';
import BoolField from './fields/bool.js';
import DateTimeField from './fields/datetime.js';
import FloatField from './fields/float.js';
import IntField from './fields/int.js';
import ObjectField from './fields/object.js';
import ReferenceField from './fields/reference.js';
import StringField from './fields/string.js';

export default class Field {
	constructor(node, tag, manifest) {
		this.node = node;
		this.tag = tag;
		this.manifest = manifest;
		this.name = validName(tag);
		this.optional = /^\?/.test(tag);
		if (this.name === '') throw `Field "${tag}" of node "${node.tag}" in ${node.container.filename}.json resulted in an empty name.`;
		if (isReserved(this.name)) throw `Field "${tag}" of node "${node.tag}" in ${node.container.filename}.json resulted in a name "${this.name}", which is a reserved keyword.`;
	}

	// Try to create a Node instance of corresponding type
	static fromEntry(node, entry, parentIsArray = false) {
		let [key, value] = entry;
		if (typeof value === 'string') {
			if (value === 'bool') return new BoolField(node, key, value);
			if (['int8', 'uint8', 'int16', 'uint16', 'int32', 'uint32', 'int64', 'uint64'].includes(value)) return new IntField(node, key, value);
			if (['float', 'double'].includes(value)) return new FloatField(node, key, value);
			if (value === 'string') return new StringField(node, key, value);
			if (value === 'datetime') return new DateTimeField(node, key, value);
			if (/^binary\d+$/.test(value)) return new BinaryField(node, key, value);
			if (/^@.+/.test(value)) return new ReferenceField(node, key, value);
		}
		if (value instanceof Array && value.length === 1) return new ArrayField(node, key, value);
		if (isObject(value)) return new ObjectField(node, key, value, parentIsArray);
		throw `Field "${key}" of node "${node.tag}" in ${node.container.filename}.json has an invalid type. ` +
			'Valid types are: bool, int8, uint8, int16, uint16, int32, uint32, int64, uint64, float, double, datetime, string, binary# (e.g.: "binary16"). ' +
			'It can also be an array of type (e.g. ["int8"]), a reference to an object (e.g. "@item") or an embedded object: { <field>: <type>, ... }';
	}

	get type() { return null; }
	get size() { return 0; }

	// Return corresponding single operation code
	estimator() { return `${this.size}`; }
	packer() {}
	unpacker() {}

	// Get whether it has a fixed footprint (always fixed size in a buffer) or not
	get static() {
		return !this.optional && !(this instanceof ArrayField) && !(this instanceof ObjectField) && !(this instanceof StringField);
	}

	// Get comment @param string
	get comment() {
		return ` * @param {${this.type}} ` + this.optional ? `[${this.name}]` : this.name;
	}

	// Get initialization code
	get initializer() {
		return this.optional ? `if (${this.name} == null) throw 'Argument ${this.name} is required'; else ` : '' + `this.${this.name} = ${this.name};`;
	}

	// Get estimate buffer size code
	get estimate() {
		if (this.static) return [];
		let lines = [];
		if (this.optional) lines.push(`$setFlag(${this.name} != null);`);
		if (this.optional) lines.push(`if (${this.name} != null) bytes += ${this.estimator(this.name)};`);
		else lines.push(`bytes += ${this.estimator(this.name)};`);
		return lines;
	}

	// Get pack data into the buffer code
	get pack() {
		return [`${this.optional ? `if (${this.name} != null) ` : ''}${this.packer(this.name)};`];
	}

	// Get unpack data from the buffer code
	get unpack() {
		return [`${this.optional ? `if ($getFlag()) ` : ''}${this.name} = ${this.unpacker(this.name)};`];
	}
}
