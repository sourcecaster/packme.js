// This class describes object field of type string.

import Field from '../field.js';

export default class StringField extends Field {
	constructor(node, tag, manifest) {
		super(node, tag, manifest);
	}

	get type() {
		return 'string';
	}

	estimator(name = '') {
		return `this.$stringBytes(${name})`;
	}

	packer(name = '') {
		return `this.$packString(${name})`;
	}

	unpacker() {
		return `this.$unpackString()`;
	}
}
