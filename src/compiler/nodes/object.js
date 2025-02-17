// This class describes object node declared in manifest.

import Field from '../field.js';
import Node from '../node.js';
import { validName, isReserved, hashCode } from '../utils.js';

function extractTag(tag) {
	const m = /(.+?)@.+/.exec(tag);
	return m ? m[1] : tag;
}

export default class Obj extends Node {
	constructor(container, tag, manifest, options = {}) {
		// Compute _inheritDescriptor from tag (e.g. "foo@inheritInfo")
		const m = /.+?@(.+)$/.exec(tag);
		const inheritDescriptor = m ? m[1] : '';
		// Extract base tag (without inheritance part)
		const baseTag = extractTag(tag);
		// Call super with container, baseTag, and validName(baseTag, true)
		super(container, baseTag, validName(baseTag, true), manifest);

		this._inheritDescriptor = inheritDescriptor;
		if (inheritDescriptor.indexOf(':') > 0) {
			this.inheritFilename = inheritDescriptor.substring(0, inheritDescriptor.indexOf(':'));
			this.inheritTag = inheritDescriptor.substring(inheritDescriptor.indexOf(':') + 1);
		} else {
			this.inheritFilename = container.filename;
			this.inheritTag = inheritDescriptor;
		}
		if (isReserved(this.name)) {
			throw new Error(`Object node "${tag}" in ${container.filename}.json is resulted with the name "${this.name}", which is reserved.`);
		}
		this.fields = [];
		for (const entry of Object.entries(manifest)) {
			const field = Field.fromEntry(this, entry);
			if (this.fields.some(f => f.name === field.name)) {
				throw new Error(`Object declaration "${tag}" in ${container.filename}.json field "${entry[0]}" is parsed into a field with duplicating name "${field.name}".`);
			}
			this.fields.push(field);
		}
		this._flagBytes = Math.ceil(this.fields.filter(f => f.optional).length / 8);
		this._minBufferSize = 0; // Will be computed in output()
		this.id = options.id ?? null;
		this.response = options.response ?? null;
	}

	_getInheritedRoot() {
		return this.inheritTag !== '' ? this._getInheritedObject()._getInheritedRoot() : this;
	}

	_getInheritedObject() {
		const targetContainer = this.container.containers[this.inheritFilename];
		if (!targetContainer) {
			throw new Error(`Node "${this.tag}" in ${this.container.filename}.json refers to file "${this.inheritFilename}.json" which is not found.`);
		}
		const index = targetContainer.nodes.findIndex(n => n instanceof Obj && n.tag === this.inheritTag);
		if (index === -1) {
			throw new Error(`Node "${this.tag}" in ${this.container.filename}.json refers to node "${this.inheritTag}" in ${this.inheritFilename}.json, but such enum/object node does not exist.`);
		}
		const resultObject = targetContainer.nodes[index];
		// Check for field duplications with inherited object.
		for (const field of this.fields) {
			if (resultObject.fields.findIndex(inheritedField => field.name === inheritedField.name) !== -1) {
				throw new Error(`Node "${this.tag}" in ${this.container.filename}.json has a field "${field.name}" which is already inherited from node "${resultObject.tag}" in ${this.container.filename}.json.`);
			}
		}
		return resultObject;
	}

	_getInheritedFields() {
		let result = [];
		if (this.inheritTag !== '') {
			const target = this._getInheritedObject();
			result = result.concat(target._getInheritedFields());
			result = result.concat(target.fields);
		}
		return result;
	}

	_getChildObjects() {
		let result = {};
		for (const c of Object.values(this.container.containers)) {
			for (const o of c.objects) {
				if (o.inheritFilename === this.container.filename && o.inheritTag === this.tag) {
					const key = hashCode(validName(o.tag, true));
					result[key] = o;
					Object.assign(result, o._getChildObjects());
				}
			}
		}
		return result;
	}

	output() {
		// Compute minimum buffer size from static fields
		this._minBufferSize = this.fields
			.filter(f => f.static)
			.reduce((sum, f) => sum + f.size, this._flagBytes);

		// If used by a message/request, add 8 bytes (command ID and transaction ID)
		if (this.id != null) this._minBufferSize += 8;

		const inheritedObject = this.inheritTag !== '' ? this._getInheritedObject() : null;
		const inheritedFields = this._getInheritedFields();
		const childObjects = this._getChildObjects();

		// Add 4 bytes for inherited object class ID if needed
		if (this.inheritTag !== '' || Object.keys(childObjects).length > 0) {
			this._minBufferSize += 4;
		}

		const lines = [];
		lines.push('');
		if (this.inheritTag === '') {
			lines.push(`class ${this.name} extends PackMeMessage {`);
		} else {
			lines.push(`class ${this.name} extends ${inheritedObject.name} {`);
		}

		// Constructor
		if (this.fields.length > 0) {
			lines.push(`  constructor({`);
			if (this.inheritTag !== '') {
				inheritedFields.forEach(f => lines.push(`    ${f.attribute}`));
			}
			this.fields.forEach(f => lines.push(`    ${f.initializer}`));
			if (this.inheritTag === '') {
				lines.push(`  }) {`);
				lines.push(`    // ... constructor body`);
				lines.push(`  }`);
			} else {
				const inheritedArgs = inheritedFields.map(f => `${f.name}: ${f.name}`).join(', ');
				lines.push(`  }) {`);
				lines.push(`    super({ ${inheritedArgs} });`);
				lines.push(`    // ... constructor body`);
				lines.push(`  }`);
			}
		} else {
			lines.push(`  constructor() { }`);
		}

		// $empty static method
		if (this.inheritTag === '') {
			lines.push(`  static $empty() { }`);
		} else {
			lines.push(`  static $empty() { return new ${this.name}(); }`);
		}
		lines.push('');

		// If no inheritance and child objects exist, output kinIds mapping and $emptyKin
		if (this.inheritTag === '' && Object.keys(childObjects).length > 0) {
			lines.push(`  static $kinIds = {`);
			lines.push(`    ${this.name}: 0,`);
			for (const [key, obj] of Object.entries(childObjects)) {
				lines.push(`    ${obj.name}: ${key},`);
			}
			lines.push(`  };`);
			lines.push('');
			lines.push(`  static $emptyKin(id) {`);
			lines.push(`    switch (id) {`);
			for (const [key, obj] of Object.entries(childObjects)) {
				lines.push(`      case ${key}: return ${obj.name}.$empty();`);
			}
			lines.push(`      default: return ${this.name}.$empty();`);
			lines.push(`    }`);
			lines.push(`  }`);
			lines.push('');
		}

		// Field declarations
		this.fields.forEach(field => {
			lines.push(`  ${field.declaration}`);
		});

		// Response method if response exists
		if (this.response != null) {
			lines.push('');
			if (this.response.fields && this.response.fields.length > 0) {
				lines.push(`  $response({`);
				this.response.fields.forEach(f => lines.push(`    ${f.attribute}`));
				lines.push(`  }) {`);
				lines.push(`    // ... response body`);
				lines.push(`  }`);
			} else {
				lines.push(`  $response() {`);
				lines.push(`    const message = new ${this.response.name}(${this.response.fields.map(f => `${f.name}: ${f.name}`).join(', ')});`);
				lines.push(`    message.$request = this;`);
				lines.push(`    return message;`);
				lines.push(`  }`);
			}
		}

		lines.push('');
		// $estimate method
		lines.push(`  $estimate() {`);
		if (this.inheritTag === '') {
			lines.push(`    this.$reset();`);
		} else {
			lines.push(`    let _bytes = super.$estimate();`);
		}
		if (this.fields.filter(f => !f.static).length > 0 || this.inheritTag !== '') {
			if (this.inheritTag === '') {
				lines.push(`    let _bytes = ${this._minBufferSize};`);
			} else if (this._minBufferSize > 0) {
				lines.push(`    _bytes += ${this._minBufferSize};`);
			}
			this.fields.forEach(f => {
				f.estimate.forEach(line => lines.push(`    ${line}`));
			});
			lines.push(`    return _bytes;`);
		} else {
			lines.push(`    return ${this._minBufferSize};`);
		}
		lines.push(`  }`);
		lines.push('');
		// $pack method
		lines.push(`  $pack() {`);
		if (this.id != null) {
			lines.push(`    this.$initPack(${this.id});`);
		}
		if (this.inheritTag !== '') {
			lines.push(`    super.$pack();`);
		} else if (Object.keys(childObjects).length > 0) {
			lines.push(`    this.$packUint32($kinIds[runtimeType] ?? 0);`);
		}
		if (this._flagBytes > 0) {
			lines.push(`    for (let i = 0; i < ${this._flagBytes}; i++) this.$packUint8($flags[i]);`);
		}
		this.fields.forEach(f => {
			f.pack.forEach(line => lines.push(`    ${line}`));
		});
		lines.push(`  }`);
		lines.push('');
		// $unpack method
		lines.push(`  $unpack() {`);
		if (this.id != null) {
			lines.push(`    this.$initUnpack();`);
		}
		if (this.inheritTag !== '') {
			lines.push(`    super.$unpack();`);
		}
		if (this._flagBytes > 0) {
			lines.push(`    for (let i = 0; i < ${this._flagBytes}; i++) $flags.push(this.$unpackUint8());`);
		}
		this.fields.forEach(f => {
			f.unpack.forEach(line => lines.push(`    ${line}`));
		});
		lines.push(`  }`);
		lines.push('');
		// toString method
		lines.push(`  toString() {`);
		lines.push(
			`    return '${this.name}\\x1b[0m(' + [${[...inheritedFields, ...this.fields]
				.map(f => `'${f.name}: ' + PackMe.dye(${f.name})`)
				.join(', ')}].join(', ') + ')';`
		);
		lines.push(`  }`);
		lines.push(`}`);
		return lines;
	}
}
