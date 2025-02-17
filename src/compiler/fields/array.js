// This class describes object field of array type [<type>].

import Field from '../field.js';

export default class ArrayField extends Field {
	constructor(node, tag, manifest) {
		super(node, tag, manifest);
		this.field = Field.fromEntry(node, [tag, manifest[0]], true);
	}

	get type() {
		return 'any[]';
	}

	estimator(name = '') {
		return this.field.static
			? `4 + this.${name}.length * ${this.field.size}`
			: `4 + this.${name}.reduce((a, b) => a + ${this.field.estimator('b')}, 0)`;
	}

	packer(name = '') {
		return [
			`this.$packUint32(this.${name}.length);`,
			`for (let i = 0; i < this.${name}.length; i++) {`,
			`  ${this.field.packer(`this.${name}[i]`)}${!(this.field instanceof ArrayField) ? ';' : ''}`,
			`}`
		].join('\n');
	}

	unpacker() {
		return [
			`Array.from({ length: this.$unpackUint32() }, (_, i) => {`,
			`  return ${this.field.unpacker()}${!(this.field instanceof ArrayField) ? ';' : ''}`,
			`})`
		].join('\n');
	}

	get pack() {
		let lines = [];
		if (this.optional) lines.push(`if (${this.name} != null) {`);
		lines.push(...this.packer(this.name).split('\n'));
		if (this.optional) lines.push('}');
		return lines;
	}

	get unpack() {
		let lines = [];
		if (this.optional) lines.push('if (this.$getFlag()) {');
		lines.push(...`${this.name} = ${this.unpacker(this.name)}`.split('\n'));
		if (this.optional) lines.push('}');
		return lines;
	}
}