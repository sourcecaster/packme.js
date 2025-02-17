// This class describes object field of type float/double.

import Field from '../field.js';

export default class FloatField extends Field {
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
