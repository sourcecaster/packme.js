// This class describes object field of type string.

import Field from '../field.js';

export default class StringField extends Field {
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
