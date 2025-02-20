#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

// Color constants
let RED = '\x1b[31m';
let GREEN = '\x1b[32m';
let YELLOW = '\x1b[33m';
let RESET = '\x1b[0m';

// Reserved names you can't use as field names or enum values.
let reservedNames = [
	'assert', 'bool', 'break', 'case', 'catch', 'class', 'const', 'continue', 'covariant',
	'DateTime', 'default', 'deferred', 'do', 'double', 'else', 'enum', 'export', 'extends',
	'extension', 'external', 'factory', 'false', 'final', 'finally', 'for', 'if', 'in', 'int',
	'is', 'Iterable', 'List', 'Map', 'new', 'Null', 'null', 'PackMe', 'PackMeMessage', 'rethrow',
	'return', 'Set', 'super', 'switch', 'this', 'throw', 'true', 'try', 'values', 'var', 'void',
	'while', 'with', 'hashCode', 'noSuchMethod', 'runtimeType', 'String', 'toString', 'Uint8List'
];

/**
 * Check if a name is reserved.
 * @param {string} name
 * @returns {boolean}
 */
function isReserved(name) {
	return reservedNames.includes(name);
}

/**
 * Converts lower case names with underscores to UpperCamelCase (for classes) or
 * lowerCamelCase (for fields).
 * @param {string} input
 * @param {boolean} [firstCapital=false]
 * @returns {string}
 */
function validName(input, firstCapital = false) {
	let re = firstCapital ? /(^[a-z]|[^a-zA-Z][a-z])/g : /([^a-zA-Z\?][a-z])/g;
	let result = input.replace(re, match => match.toUpperCase());
	result = result.replace(/^\??\d+|[^a-zA-Z0-9]/g, '');
	return result;
}

/**
 * Auto indents an array of code lines.
 * @param {string[]} lines
 * @returns {string[]}
 */
function formatCode(lines) {
	let indent = 0;
	let reOpen = /\{[^\}]*$/;
	let reClose = /^[^\{]*\}/;
	let reEmpty = /^\s*$/;
	for (let i = 0; i < lines.length; i++) {
		let increase = reOpen.test(lines[i]);
		let decrease = reClose.test(lines[i]);
		if (decrease) indent--;
		if (!reEmpty.test(lines[i])) lines[i] = '\t'.repeat(indent) + lines[i];
		if (increase) indent++;
	}
	return lines;
}

// Plural to singular conversion rules
let singularRules = new Map([
	[ /men$/i, () => 'man' ],
	[ /(eau)x?$/i, (_, p1) => p1 ],
	[ /(child)ren$/i, (_, p1) => p1 ],
	[ /(pe)(rson|ople)$/i, (_, p1) => p1 + 'rson' ],
	[ /(matr|append)ices$/i, (_, p1) => p1 + 'ix' ],
	[ /(cod|mur|sil|vert|ind)ices$/i, (_, p1) => p1 + 'ex' ],
	[ /(alumn|alg|vertebr)ae$/i, (_, p1) => p1 + 'a' ],
	[ /(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i, (_, p1) => p1 + 'on' ],
	[ /(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i, (_, p1) => p1 + 'um' ],
	[ /(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, (_, p1) => p1 + 'us' ],
	[ /(test)(?:is|es)$/i, (_, p1) => p1 + 'is' ],
	[ /(movie|twelve|abuse|e[mn]u)s$/i, (_, p1) => p1 ],
	[ /(analy|diagno|parenthe|progno|synop|the|empha|cri|ne)(?:sis|ses)$/i, (_, p1) => p1 + 'sis' ],
	[ /(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|t[lm]as|gas|(?:her|at|gr)o|[aeiou]ris)(?:es)?$/i, (_, p1) => p1 ],
	[ /(seraph|cherub)im$/i, (_, p1) => p1 ],
	[ /\b((?:tit)?m|l)ice$/i, (_, p1) => p1 + 'ouse' ],
	[ /\b(mon|smil)ies$/i, (_, p1) => p1 + 'ey' ],
	[ /\b(l|(?:neck|cross|hog|aun)?t|coll|faer|food|gen|goon|group|hipp|junk|vegg|(?:pork)?p|charl|calor|cut)ies$/i, (_, p1) => p1 + 'ie' ],
	[ /(dg|ss|ois|lk|ok|wn|mb|th|ch|ec|oal|is|ck|ix|sser|ts|wb)ies$/i, (_, p1) => p1 + 'ie' ],
	[ /ies$/i, () => 'y' ],
	[ /(ar|(?:wo|[ae])l|[eo][ao])ves$/i, (_, p1) => p1 + 'f' ],
	[ /(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i, (_, p1) => p1 + 'fe' ],
	[ /(ss)$/i, (_, p1) => p1 ],
	[ /s$/i, () => '' ]
]);

/**
 * Returns the singular form of a plural word.
 * @param {string} plural
 * @returns {string}
 */
function toSingular(plural) {
	// If plural ends with an uppercase letter or digit, assume it's an abbreviation.
	if (/[A-Z0-9]$/.test(plural)) return plural;
	let singular = plural;
	for (let [regex, transform] of singularRules) {
		if (regex.test(plural)) {
			singular = plural.replace(regex, transform);
			break;
		}
	}
	return singular;
}

/**
 * Checks if value is an object.
 * @param {any} value
 * @returns {boolean}
 */
function isObject(value) {
	return value != null && typeof value === 'object' && !(value instanceof Array);
}

/**
 * Calculates Dart-like hashCode of a string.
 * @param {string} str
 * @returns {number}
 */
function hashCode(str) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		let code = str.charCodeAt(i);
		hash += code;
		hash += hash << 10;
		hash ^= hash >>> 6;
	}
	hash += hash << 3;
	hash ^= hash >>> 11;
	hash += hash << 15;
	hash &= (1 << 30) - 1;
	return (hash === 0) ? 1 : hash;
}

// This class describes a single entity (node) in manifest file (whether it's enum, object, message or request).

let nodes = {};

class Node {
	constructor(container, tag, name, manifest) {
		this.container = container;
		this.tag = tag;
		this.name = name;
		this.manifest = manifest;
	}

	// Try to create a Node instance of corresponding type
	static fromEntry(container, entry) {
		let [key, value] = entry;
		if (validName(key) === '') throw `Node "${key}" in ${container.filename}.json is resulted with the name parsed into an empty string.`;
		if (isObject(value)) return new nodes.Obj(container, key, value);
		if (value instanceof Array) {
			if (value.length === 1 && isObject(value[0])) return new nodes.Message(container, key, value);
			if (value.length === 2 && isObject(value[0]) && isObject(value[1])) return new nodes.Request(container, key, value);
			if (value.length > 0 && value.every(item => typeof item === 'string')) return new nodes.Enum(container, key, value);
		}
		throw `Node "${key}" in ${container.filename}.json has invalid format. Use array of strings for enum declaration, object for object declaration or array of 1 or 2 objects for message or request correspondingly.`;
	}

	// Adds a reference to import from another file
	include(filename, name) {
		filename += '.generated.js';
		name = validName(name, true);
		this.container.includes[filename] ??= [];
		if (!this.container.includes[filename].includes(name)) {
			this.container.includes[filename].push(name);
			this.container.includes[filename].sort();
		}
	}

	// Adds an embedded node to output its code
	embed(node) {
		this.container.embedded.push(node);
		this.container.embedded.sort((a, b) => a.name.localeCompare(b.name));
	}

	// Return resulting code, must be overridden.
	output() {
		return [];
	}
}

// This class describes enum node declared in manifest.

class Enum extends Node {
	values = [];

	constructor(container, tag, manifest) {
		super(container, tag, validName(tag, true), manifest);
		if (isReserved(this.name)) {
			throw new Error(`Enum node "${tag}" in ${container.filename}.json is resulted with the name "${this.name}", which is a reserved keyword.`);
		}
		for (let row of manifest) {
			let value = validName(row);
			if (value === '') throw `Enum declaration "${tag}" in ${container.filename}.json contains invalid value "${row}" which is parsed into an empty string.`;
			if (this.values.includes(value)) throw `Enum declaration "${tag}" in ${container.filename}.json value "${row}" is parsed into a duplicating value "${value}".`;
			if (isReserved(value)) throw `Enum declaration "${tag}" in ${container.filename}.json value "${row}" is parsed as "${value}" which is a reserved keyword.`;
			this.values.push(value);
		}
	}

	// Return resulting code for Enum.
	output() {
		return [
			'',
			'/**',
			' * @enum {number}',
			' */',
			`export const ${this.name} = Object.freeze({`,
			...this.values.map((v, i) => `${v}: ${i},`),
			'})'
		];
	}
}

// This class describes a single field entry of the object, message or request.

let fields = {};

class Field {
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
			if (value === 'bool') return new fields.BoolField(node, key, value);
			if (['int8', 'uint8', 'int16', 'uint16', 'int32', 'uint32', 'int64', 'uint64'].includes(value)) return new fields.IntField(node, key, value);
			if (['float', 'double'].includes(value)) return new fields.FloatField(node, key, value);
			if (value === 'string') return new fields.StringField(node, key, value);
			if (value === 'datetime') return new fields.DateTimeField(node, key, value);
			if (/^binary\d+$/.test(value)) return new fields.BinaryField(node, key, value);
			if (/^@.+/.test(value)) return new fields.ReferenceField(node, key, value);
		}
		if (value instanceof Array && value.length === 1) return new fields.ArrayField(node, key, value);
		if (isObject(value)) return new fields.ObjectField(node, key, value, parentIsArray);
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
		return !this.optional && !(this instanceof fields.ArrayField) && !(this instanceof fields.ObjectField) && !(this instanceof fields.StringField);
	}

	/// Returns code of class field declaration.
	get declaration() {
		return `/** @type {${this.optional ? '?' : '!'}${this.type}} */ ${this.name};`;
	}

	// Get comment @param string
	get comment() {
		return ` * @param {${this.optional ? '?' : '!'}${this.type}} ${this.optional ? `[${this.name}]` : this.name}`;
	}

	// Get initialization code
	get initializer() {
		return `this.${this.name} = ${this.optional ? this.name : `this.$ensure('${this.name}', ${this.name})`};`;
	}

	// Get estimate buffer size code
	get estimate() {
		if (this.static) return [];
		let lines = [];
		if (this.optional) lines.push(`this.$setFlag(this.${this.name} != null);`);
		if (this.optional) lines.push(`if (this.${this.name} != null) bytes += ${this.estimator(this.name)};`);
		else lines.push(`bytes += ${this.estimator(this.name)};`);
		return lines;
	}

	// Get pack data into the buffer code
	get pack() {
		return [`${this.optional ? `if (this.${this.name} != null) ` : ''}${this.packer(this.name)};`];
	}

	// Get unpack data from the buffer code
	get unpack() {
		return [`${this.optional ? `if (this.$getFlag()) ` : ''}this.${this.name} = ${this.unpacker(this.name)};`];
	}
}

// This class describes object node declared in manifest.

function extractTag(tag) {
	return /(.+?)@.+/.exec(tag)?.[1] ?? tag;
}

class Obj extends Node {
	fields = [];
	_minBufferSize = 0;

	constructor(container, tag, manifest, id, response) {
		let inheritDescriptor = /.+?@(.+)$/.exec(tag)?.[1] ?? '';
		let baseTag = extractTag(tag);
		super(container, baseTag, validName(baseTag, true), manifest);
		let colonIndex = inheritDescriptor.indexOf(':');
		this.inheritFilename = colonIndex > 0 ? inheritDescriptor.substring(0, colonIndex) : container.filename;
		this.inheritTag = colonIndex > 0 ? inheritDescriptor.substring(colonIndex + 1) : inheritDescriptor;
		if (isReserved(this.name)) {
			throw `Object node "${tag}" in ${container.filename}.json is resulted with the name "${this.name}", which is a reserved keyword.`;
		}
		for (let entry of Object.entries(manifest)) {
			let field = Field.fromEntry(this, entry);
			if (this.fields.some(f => f.name === field.name)) {
				throw `Object declaration "${tag}" in ${container.filename}.json field "${entry[0]}" is parsed into a field with duplicating name "${field.name}".`;
			}
			this.fields.push(field);
		}
		this._flagBytes = Math.ceil(this.fields.filter(f => f.optional).length / 8);
		this.id = id ?? null;
		this.response = response ?? null;
	}

	_getInheritedRoot() {
		return this.inheritTag !== '' ? this._getInheritedObject()._getInheritedRoot() : this;
	}

	_getInheritedObject() {
		let container = this.container.containers[this.inheritFilename];
		if (container == null) {
			throw `Node "${this.tag}" in ${this.container.filename}.json refers to file "${this.inheritFilename}.json" which is not found within the current compilation process.`;
		}
		let index = container.nodes.findIndex(n => n instanceof Obj && n.tag === this.inheritTag);
		if (index === -1) {
			throw `Node "${this.tag}" in ${this.container.filename}.json refers to node "${this.inheritTag}" in ${this.inheritFilename}.json, but such enum/object node does not exist.`;
		}
		let resultObject = container.nodes[index];
		for (let field of this.fields) {
			if (resultObject.fields.findIndex(inheritedField => field.name === inheritedField.name) !== -1) {
				throw `Node "${this.tag}" in ${this.container.filename}.json has a field "${field.name}" declaration which is already inherited from node "${resultObject.tag}" in ${this.container.filename}.json.`;
			}
		}
		return resultObject;
	}

	_getInheritedFields() {
		let result = [];
		if (this.inheritTag !== '') {
			let target = this._getInheritedObject();
			result = result.concat(target._getInheritedFields());
			result = result.concat(target.fields);
		}
		return result;
	}

	_getChildObjects() {
		let result = {};
		for (let c of Object.values(this.container.containers)) {
			for (let o of c.objects) {
				if (o.inheritFilename === this.container.filename && o.inheritTag === this.tag) {
					result[hashCode(validName(o.tag, true))] = o;
					Object.assign(result, o._getChildObjects());
				}
			}
		}
		return result;
	}

	output() {
		this._minBufferSize = this.fields
			.filter(f => f.static)
			.reduce((sum, f) => sum + f.size, this._flagBytes);

		// Add 4 bytes for command ID and transaction ID if this node is used by message/request node
		if (this.id != null) this._minBufferSize += 8;

		let inheritedObject = this.inheritTag !== '' ? this._getInheritedObject() : null;
		let inheritedFields = this._getInheritedFields();
		let childObjects = this._getChildObjects();

		// Add 4 bytes for specific inherited object class ID (to be able to unpack corresponding inherited object)
		if (this.inheritTag === '' && Object.keys(childObjects).length > 0) this._minBufferSize += 4;

		return [
            '',
			`export class ${this.name} extends ${this.inheritTag === '' ? 'PackMeMessage' : inheritedObject.name} {`,
			...this.fields.map(f => f.declaration),
			'',
			...(this.inheritTag === '' && Object.keys(childObjects).length > 0 ? [
				`$kinIds = new Map([`,
					`	[${this.name}, 0],`,
					...Object.entries(childObjects).map(([key, value]) => `	[${value.name}, ${key}],`),
				']);',
				'',
				`static $emptyKin(id) {`,
					'switch (id) {',
						...Object.entries(childObjects).map(([key, value]) => `case ${key}: return new ${value.name}();`),
						`default: return new ${this.name}();`,
					'}',
				'}',
				''
			] : []),
			...(inheritedFields.length + this.fields.length > 0 ? ['/**', ...[...inheritedFields, ...this.fields].map(f => f.comment), ' */'] : []),
			`constructor (${[...inheritedFields, ...this.fields].map(f => f.name).join(', ')}) {`,
				'if (arguments.length === 0) return super();',
				...(this.inheritTag !== '' ? [`super(${inheritedFields.map(f => f.name).join(', ')});`] : ['super();']),
				...this.fields.map(f => f.initializer),
			'}',
			'',
            ...(this.response != null ? [
				'/**',
				...this.response.fields.map(f => f.comment),
                ` * @returns {${this.response.name}}`,
				' */',
				`$response(${this.response.fields.map(f => f.name).join(', ')}) {`,
                    `let message = new ${this.response.name}(${this.response.fields.map(f => f.name).join(', ')});`,
                    'message.$request = this;',
                    'return message;',
                '}',
				'',
            ] : []),

            '$estimate() {',
				...(this.inheritTag === '' ? [
					'this.$reset();'
				] : [
					'let bytes = super.$estimate();'
				]),
				...(this.fields.some(f => !f.static) || this.inheritTag !== '' ? [
					...(this.inheritTag === '' ? [
						`let bytes = ${this._minBufferSize};`
					] : this._minBufferSize > 0 ? [
						`bytes += ${this._minBufferSize};`
					] : []),
					...this.fields.reduce((a, b) => a.concat(b.estimate), []),
					'return bytes;'
				] : [
					`return ${this._minBufferSize};`,
				]),
            '}',
			'',
            '$pack() {',
                ...(this.id != null ? [`this.$initPack(${this.id});`] : []),
                ...(this.inheritTag !== '' ? [
					'super.$pack();'
				] : Object.keys(childObjects).length > 0 ? [
					`this.$packUint32(this.$kinIds.get(Object.getPrototypeOf(this).constructor) ?? 0);`
				] : []),
                ...(this._flagBytes > 0 ? [`for (let i = 0; i < ${this._flagBytes}; i++) this.$packUint8(this.$flags[i]);`] : []),
                ...this.fields.reduce((a, b) => a.concat(b.pack), []),
            '}',
			'',
            '$unpack() {',
                ...(this.id != null ? ['this.$initUnpack();'] : []), // command ID
				...(this.inheritTag !== '' ? ['super.$unpack();'] : []),
                ...(this._flagBytes > 0 ? [`for (let i = 0; i < ${this._flagBytes}; i++) this.$flags.push(this.$unpackUint8());`] : []),
                ...this.fields.reduce((a, b) => a.concat(b.unpack), []),
            '}',
			'',
            '/** @returns {string} */',
            'toString() {',
                `return \`${this.name}\\x1b[0m(${[...inheritedFields, ...this.fields].map(f => `${f.name}: \${PackMe.dye(this.${f.name})}`).join(', ')})\`;`,
            '}',
            '}'
        ];
	}
}

// This class describes message node declared in manifest.

class Message extends Node {
	constructor(container, tag, manifest) {
		let name = `${validName(tag, true)}Message`;
		super(container, tag, name, manifest);
		this.id = hashCode(container.filename + name);
		if (isReserved(name)) {
			throw `Message node "${tag}" in ${container.filename}.json is resulted with the name "${name}", which is a reserved keyword.`;
		}
		this.messageObject = new Obj(container, `${tag}_message`, manifest[0], this.id);
		if (this.messageObject.inheritTag !== '') {
			throw `Message node "${tag}" in ${container.filename}.json cannot be inherited from any other node.`;
		}
	}

	output() {
		return this.messageObject.output();
	}
}

// This class describes request node declared in manifest.

class Request extends Node {
	constructor(container, tag, manifest) {
		let name = `${validName(tag, true)}Request`;
		super(container, tag, name, manifest);
		this.id = hashCode(`${container.filename}${name}`);
		this.responseName = `${validName(tag, true)}Response`;
		this.responseId = hashCode(`${container.filename}${this.responseName}`);
		if (isReserved(name)) {
			throw `Request node "${tag}" in ${container.filename}.json is resulted with the name "${name}", which is a reserved keyword.`;
		}
		if (isReserved(this.responseName)) {
			throw `Response node "${tag}" in ${container.filename}.json is resulted with the name "${this.responseName}", which is a reserved keyword.`;
		}
		this.responseObject = new Obj(container, `${tag}_response`, manifest[1], this.responseId);
		this.requestObject = new Obj(container, `${tag}_request`, manifest[0], this.id, this.responseObject);
		if (this.responseObject.inheritTag !== '' || this.requestObject.inheritTag !== '') {
			throw `Request node "${tag}" in ${container.filename}.json cannot be inherited from any other node.`;
		}
	}

	output() {
		return [...this.requestObject.output(), ...this.responseObject.output()];
	}
}

// This class describes a container of nodes which corresponds to single manifest file.

class Container {
	includes = {};
	embedded = [];

	constructor(filename, manifest, containers) {
		this.filename = filename;
		this.manifest = manifest;
		this.containers = containers;
		this.nodes = Object.entries(manifest).map(entry => Node.fromEntry(this, entry));
		this.enums = this.nodes.filter(node => node instanceof Enum);
		this.objects = this.nodes.filter(node => node instanceof Obj);
		this.messages = this.nodes.filter(node => node instanceof Message);
		this.requests = this.nodes.filter(node => node instanceof Request);
	}

	output(containers) {
		let code = [];
		code.push("import { PackMe, PackMeMessage } from 'packme';");
		Object.keys(this.includes).sort().forEach(filename => {
			code.push(`import { ${this.includes[filename].join(', ')} } from './${filename}';`);
		});
		this.enums.forEach(node => code.push(...node.output()));
		this.objects.forEach(node => code.push(...node.output()));
		this.embedded.forEach(node => code.push(...node.output()));
		this.messages.forEach(node => code.push(...node.output()));
		this.requests.forEach(node => code.push(...node.output()));
		if (this.messages.length > 0 || this.requests.length > 0) {
			code.push('');
			code.push(`export const ${validName(this.filename)}MessageFactory = Object.freeze({`);
			code.push(...this.messages.map(message => `${message.id}: () => new ${message.name}(),`));
			code.push(...this.requests.map(request => `${request.id}: () => new ${request.name}(),`));
			code.push(...this.requests.map(request => `${request.responseId}: () => new ${request.responseName}(),`));
			code.push('});');
		}
		return code;
	}
}

// This class describes object field of array type [<type>].

class ArrayField extends Field {
	constructor(node, tag, manifest) {
		super(node, tag, manifest);
		this.field = Field.fromEntry(node, [tag, manifest[0]], true);
	}

	get type() {
		return this.field.type + '[]';
	}

	estimator(name = '', local = false) {
		return this.field.static
			? `4 + ${local ? '' : 'this.'}${name}.length * ${this.field.size}`
			: `4 + ${local ? '' : 'this.'}${name}.reduce((a, b) => a + ${this.field.estimator('b', true)}, 0)`;
	}

	packer(name = '') {
		let i = `i${name.length}`;
		return [
			`this.$packUint32(this.${name}.length);`,
			`for (let ${i} = 0; ${i} < this.${name}.length; ${i}++) {`,
				`${this.field.packer(`${name}[${i}]`)}${!(this.field instanceof ArrayField) ? ';' : ''}`,
			`}`
		].join('\n');
	}

	unpacker() {
		return [
			`Array.from({ length: this.$unpackUint32() }, () => {`,
				`return ${this.field.unpacker()}${!(this.field instanceof ArrayField) ? ';' : ''}`,
			`})`
		].join('\n');
	}

	get pack() {
		let lines = [];
		if (this.optional) lines.push(`if (this.${this.name} != null) {`);
		lines.push(...this.packer(this.name).split('\n'));
		if (this.optional) lines.push('}');
		return lines;
	}

	get unpack() {
		let lines = [];
		if (this.optional) lines.push('if (this.$getFlag()) {');
		lines.push(...`this.${this.name} = ${this.unpacker(this.name)}`.split('\n'));
		if (this.optional) lines.push('}');
		return lines;
	}
}

// This class describes object field of type binary.

class BinaryField extends Field {
	constructor(node, tag, manifest) {
		super(node, tag, manifest);
		this.bytes = parseInt(manifest.substring(6));
		node.container.importTypedData = true;
	}

	get type() {
		return 'Uint8Array';
	}

	get size() {
		return this.bytes;
	}

	packer(name = '') {
		return `this.$packBinary(this.${name}, ${this.bytes})`;
	}

	unpacker() {
		return `this.$unpackBinary(${this.bytes})`;
	}
}

// This class describes object field of type bool.

class BoolField extends Field {
	constructor(node, tag, manifest) {
		super(node, tag, manifest);
	}

	get type() {
		return 'boolean';
	}

	get size() {
		return 1;
	}

	packer(name = '') {
		return `this.$packBool(this.${name})`;
	}

	unpacker() {
		return `this.$unpackBool()`;
	}
}

// This class describes object field of type datetime.

class DateTimeField extends Field {
	constructor(node, tag, manifest) {
		super(node, tag, manifest);
	}

	get type() {
		return 'Date';
	}

	get size() {
		return 8;
	}

	packer(name = '') {
		return `this.$packDateTime(this.${name})`;
	}

	unpacker() {
		return `this.$unpackDateTime()`;
	}
}

// This class describes object field of type float/double.

class FloatField extends Field {
	constructor(node, tag, manifest) {
		super(node, tag, manifest);
		this.bytes = manifest === 'float' ? 4 : 8;
	}

	get type() {
		return 'number';
	}

	get size() {
		return this.bytes;
	}

	packer(name = '') {
		return this.bytes === 8 ? `this.$packDouble(this.${name})` : `this.$packFloat(this.${name})`;
	}

	unpacker() {
		return this.bytes === 8 ? `this.$unpackDouble()` : `this.$unpackFloat()`;
	}
}

// This class describes object field of type int8/uint8/int16/uint16/int32/uint32/int64/uint64.

class IntField extends Field {
	constructor(node, tag, manifest) {
		super(node, tag, manifest);
		this.signed = manifest[0] !== 'u';
		this.bytes = Math.round(parseInt(manifest.replace(/\D/g, '')) / 8);
	}

	get type() {
		return this.bytes === 8 ? 'BigInt' : 'number';
	}

	get size() {
		return this.bytes;
	}

	packer(name = '') {
		return `this.$pack${this.signed ? 'Int' : 'Uint'}${this.bytes * 8}(this.${name})`;
	}

	unpacker() {
		return `this.$unpack${this.signed ? 'Int' : 'Uint'}${this.bytes * 8}()`;
	}
}

// This class describes object field of object type { ... }.

class ObjectField extends Field {
	constructor(node, tag, manifest, parentIsArray = false) {
		super(node, tag, manifest);
		this.embeddedObject = new Obj(node.container, `${node.tag}_${parentIsArray ? toSingular(tag) : tag}`, manifest);
		node.embed(this.embeddedObject);
	}

	get type() {
		return this.embeddedObject.name;
	}

	estimator(name = '', local = false) {
		return `${local ? '' : 'this.'}${name}.$estimate()`;
	}

	packer(name = '') {
		return `this.$packMessage(this.${name})`;
	}

	unpacker() {
		return `this.$unpackMessage(new ${this.embeddedObject.name}())`;
	}

	output() {
		return this.embeddedObject.output();
	}
}

// This class describes object field of reference type @[filename:]<node>.

class ReferenceField extends Field {
	constructor(node, tag, manifest) {
		super(node, tag, manifest);
		let colonIndex = manifest.indexOf(':');
		this.filename = colonIndex > 1 ? manifest.substring(1, colonIndex) : node.container.filename;
		this.external = colonIndex > 1 && manifest.substring(1, colonIndex) !== node.container.filename;
		this.referenceTag = colonIndex > 1 ? manifest.substring(colonIndex + 1) : manifest.substring(1);
		if (this.referenceTag === '') {
			throw `Field "${tag}" of node "${node.tag}" in ${node.container.filename}.json has reference filename "${this.filename}.json" but no reference node.`;
		}
		if (this.filename !== node.container.filename) node.include(this.filename, this.referenceTag);
	}

	get referenceNode() {
		let container = this.node.container.containers[this.filename];
		if (container == null) {
			throw `Field "${this.tag}" of node "${this.node.tag}" in ${this.node.container.filename}.json refers to file "${this.filename}.json" which is not found within the current compilation process.`;
		}
		let ref = container.nodes.find(n => (n instanceof Enum || n instanceof Obj) && n.tag === this.referenceTag);
		if (ref == null) {
			throw `Field "${this.tag}" of node "${this.node.tag}" in ${this.node.container.filename}.json refers to node "${this.referenceTag}" in ${this.filename}.json, but such enum/object node does not exist.`;
		}
		return ref;
	}

	get type() {
		return this.referenceNode.name;
	}

	get size() {
		return this.static ? 1 : 0;
	}

	get static() {
		return !this.optional && this.referenceNode instanceof Enum;
	}

	estimator(name = '', local = false) {
		return this.referenceNode instanceof Enum
			? '1'
			: `${local ? '' : 'this.'}${name}.$estimate()`;
	}

	packer(name = '') {
		return this.referenceNode instanceof Enum
			? `this.$packUint8(this.${name})`
			: `this.$packMessage(this.${name})`;
	}

	unpacker(name = '') {
		let ref = this.referenceNode;
		return ref instanceof Enum
			? `this.$unpackUint8()`
			: ref instanceof Obj && (ref.inheritTag !== '' || Object.keys(ref._getChildObjects()).length > 0)
				? `this.$unpackMessage(${ref._getInheritedRoot().name}.$emptyKin(this.$unpackUint32()))`
				: `this.$unpackMessage(new ${ref.name}())`;
	}
}

// This class describes object field of type string.

class StringField extends Field {
	constructor(node, tag, manifest) {
		super(node, tag, manifest);
	}

	get type() {
		return 'string';
	}

	estimator(name = '', local = false) {
		return `this.$stringBytes(${local ? '' : 'this.'}${name})`;
	}

	packer(name = '') {
		return `this.$packString(this.${name})`;
	}

	unpacker() {
		return `this.$unpackString()`;
	}
}

/// This file allows you to generate JS source code files for PackMe data protocol using JSON manifest files.

nodes.Enum = Enum;
nodes.Message = Message;
nodes.Obj = Obj;
nodes.Request = Request;
fields.ArrayField = ArrayField;
fields.BinaryField = BinaryField;
fields.BoolField = BoolField;
fields.DateTimeField = DateTimeField;
fields.FloatField = FloatField;
fields.IntField = IntField;
fields.ObjectField = ObjectField;
fields.ReferenceField = ReferenceField;
fields.StringField = StringField;

function processFiles(srcPath, outPath, filenames, isTest) {
	let files;
	try {
		if (!fs.existsSync(srcPath) || !fs.lstatSync(srcPath).isDirectory()) throw `Path not found: ${srcPath}`;
		if (!fs.existsSync(outPath)) fs.mkdirSync(outPath, { recursive: true });
		else if (!fs.lstatSync(outPath).isDirectory()) throw `Path is not a directory: ${outPath}`;
		files = fs.readdirSync(srcPath);
	}
	catch (err) {
		throw `Unable to process files: ${err}`;
	}

	// Filter file system entities, leave only manifest files to process
	let reJson = /\.json$/;
	let reName = /(.+?)\.json$/;
	files = files.filter(f => reJson.test(f) && (filenames.length === 0 || filenames.includes(f)));
	for (let filename of filenames) {
		if (!files.includes(filename)) throw `File not found: ${filename}`;
	}
	if (files.length === 0) throw 'No manifest files found';

	let containers = {};

	for (let file of files) {
		let filename = reName.exec(file)[1];

		// Try to get the file contents as potential JSON string
		let json;
		try {
			json = fs.readFileSync(path.join(srcPath, file), { encoding: 'utf8' });
		}
		catch (err) {
			throw `Unable to open manifest file: ${err}`;
		}

		// Try to parse JSON
		let manifest;
		try {
			manifest = JSON.parse(json);
		} catch (err) {
			throw `Unable to parse ${filename}.json: ${err}`;
		}

		// Create container with nodes from the parsed data
		containers[filename] = new Container(filename, manifest, containers);
	}

	let codePerFile = {};

	// Process nodes and get resulting code strings
	for (let container of Object.values(containers)) {
		codePerFile[container.filename] ??= [];
		codePerFile[container.filename].push(...container.output(containers));
	}

	// Output resulting code
	for (let filename in codePerFile) {
		let code = formatCode(codePerFile[filename]).join('\n');
		if (!isTest) fs.writeFileSync(`${outPath}/${filename}.generated.js`, code, 'utf8');
		else console.log(`${filename}.generated.js: ~${code.length} bytes`);
	}

	console.log(`${GREEN}${files.length} file${files.length > 1 ? 's are' : ' is'} successfully processed${RESET}`);
}

function main(args) {
	let isTest = args[0] === '--test';
	if (isTest) args.shift();
	let srcPath = path.resolve(args[0] ?? '');
	let outPath = path.resolve(args[1] ?? '');
	let filenames = args.slice(2);

	// Remove duplicates and add file extension if not specified
	filenames = [...new Set(filenames.map(f => f.endsWith('.json') ? f : f + '.json'))];

	try {
		console.log(`${GREEN}Compiling ${filenames.length === 0 ? 'all .json files...' : `${filenames.length} files: ${filenames.join(', ')}...`}${RESET}`);
		console.log(`${GREEN}    Input directory: ${YELLOW}${srcPath}${RESET}`);
		console.log(`${GREEN}    Output directory: ${YELLOW}${outPath}${RESET}`);
		processFiles(srcPath, outPath, filenames, isTest);
	}
	catch (err) {
		if (isTest) throw err;
		else console.log(`${RED}${err}${RESET}`);
	}
}

if (process.argv[2] !== '--test') main(process.argv.slice(2));

export { main as default };
