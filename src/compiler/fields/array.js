// This class describes object field of array type [<type>].

import Field from '../field.js';

export default class ArrayField extends Field {
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