// This class describes object field of type binary.

import Field from '../field.js';

export default class BinaryField extends Field {
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
		return `this.$packBinary(${name}, ${this.bytes})`;
	}

	unpacker() {
		return `this.$unpackBinary(${this.bytes})`;
	}
}
