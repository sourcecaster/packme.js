// This class describes object node declared in manifest.

import Field from '../field.js';
import Node from '../node.js';
import { validName, isReserved, hashCode } from '../utils.js';

function extractTag(tag) {
	return /(.+?)@.+/.exec(tag)?.[1] ?? tag;
}

export default class Obj extends Node {
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
		if (this.inheritTag !== '' || Object.keys(childObjects).length > 0) this._minBufferSize += 4;

		return [
            '',
			`class ${this.name} extends ${this.inheritTag === '' ? 'PackMeMessage' : inheritedObject.name} {`,
			...this.fields.map(f => f.declaration),
			'',
			...(this.fields.length > 0 ? ['/**', ...this.fields.map(f => f.comment), ' */'] : []),
			`constructor (${[...inheritedFields, ...this.fields].map(f => f.name).join(', ')}) {`,
				'if (arguments.length === 0) return super();',
				...(this.inheritTag !== '' ? [`super(${inheritedFields.map(f => f.name).join(', ')});`] : ['super();']),
				...this.fields.map(f => f.initializer),
			'}',
			'',

            // if (inheritTag.isEmpty && childObjects.isNotEmpty) ...<String>[
            //     r'static Map<Type, int> $kinIds = <Type, int>{',
            //         '$name: 0,',
            //         ...childObjects.entries.map((MapEntry<int, Object> row) => '${row.value.name}: ${row.key},'),
            //     '};\n',
            //     'static $name \$emptyKin(int id) {',
            //         'switch (id) {',
            //             ...childObjects.entries.map((MapEntry<int, Object> row) => 'case ${row.key}: return ${row.value.name}.\$empty();'),
            //             'default: return $name.\$empty();',
            //         '}',
            //     '}\n'
            // ],
            // ...fields.map((Field field) => field.declaration),

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
				] : childObjects.length > 0 ? [
					'this.$packUint32($kinIds[runtimeType] ?? 0);'
				] : []),
                ...(this.flagBytes > 0 ? [`for (let i = 0; i < ${this.flagBytes}; i++) this.$packUint8(this.$flags[i]);`] : []),
                ...this.fields.reduce((a, b) => a.concat(b.pack), []),
            '}',
			'',
            '$unpack() {',
                ...(this.id != null ? ['this.$initUnpack();'] : []), // command ID
				...(this.inheritTag !== '' ? ['super.$unpack();'] : []),
                ...(this.flagBytes > 0 ? [`for (let i = 0; i < ${this.flagBytes}; i++) this.$flags.push(this.$unpackUint8());`] : []),
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
