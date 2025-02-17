// This class describes object field of type int8/uint8/int16/uint16/int32/uint32/int64/uint64.

import Field from '../field.js';

export default class IntField extends Field {
	constructor(node, tag, manifest) {
		super(node, tag, manifest);
		this.signed = manifest[0] !== 'u';
		this.bytes = Math.round(parseInt(manifest.replace(/\D/g, '')) / 8);
	}

	get type() {
		return 'number';
	}

	get size() {
		return this.bytes;
	}

	packer(name = '') {
		return `this.$pack${this.signed ? 'Int' : 'Uint'}${this.bytes * 8}(${name})`;
	}

	unpacker() {
		return `this.$unpack${this.signed ? 'Int' : 'Uint'}${this.bytes * 8}()`;
	}
}
