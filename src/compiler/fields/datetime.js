// This class describes object field of type datetime.

import Field from '../field.js';

export default class DateTimeField extends Field {
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
		return `this.$packDateTime(${name})`;
	}

	unpacker() {
		return `this.$unpackDateTime()`;
	}
}
