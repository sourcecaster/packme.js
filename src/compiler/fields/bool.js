// This class describes object field of type bool.

import Field from '../field.js';

export default class BoolField extends Field {
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
		return `this.$packBool(${name})`;
	}

	unpacker() {
		return `this.$unpackBool()`;
	}
}
