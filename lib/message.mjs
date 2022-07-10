const _utf8Encoder = new TextEncoder();
const _utf8Decoder = new TextDecoder();

class PackMeMessage {
	static #globalTransactionId = 0;
	#offset = 0;
	$data;
	$view;
	#transactionId;
	$flags = [];
	$bools = [];
	#flagsBitNumber = 0;
	#boolsBitNumber = 0;

	get $transactionId() {
		return this.#transactionId || -1;
	}
	set $request(request) {
		this.#transactionId = request.#transactionId;
	}

	$check(name, value) {
		if (value === undefined) throw new Error(`Missing required parameter: ${name}`);
		else if (value == null) throw new Error(`Parameter cannot be null: ${name}`);
	}
	$estimate() {
		throw new Error('Method $estimate() is not implemented!');
	}
	$pack() {
		throw new Error('Method $pack() is not implemented!');
	}
	$unpack() {
		throw new Error('Method $unpack() is not implemented!');
	}

	$initPack(commandId) {
		this.$data = new Uint8Array(this.$estimate());
		this.$view = new DataView(this.$data.buffer);
		this.$packUint32(commandId);
		this.$packUint32(this.#transactionId != null ? this.#transactionId : (this.#transactionId = ++PackMeMessage.#globalTransactionId & 0xFFFFFFFF));
	}
	$initUnpack() {
		this.$unpackUint32();
		this.#transactionId = this.$unpackUint32();
	}
	$reset() {
		this.$data = null;
		this.$view = null;
		this.#offset = 0;
		this.$flags = [];
		this.$bools = [];
		this.#flagsBitNumber = 0;
	}

	$setFlag(on) {
		let index = Math.floor(this.#flagsBitNumber / 8);
		if (index >= this.$flags.length) this.$flags.push(0);
		if (on) this.$flags[index] |= 1 << (this.#flagsBitNumber % 8);
		this.#flagsBitNumber++;
	}
	$getFlag() {
		let index = Math.floor(this.#flagsBitNumber / 8);
		let result = ((this.$flags[index] >>> (this.#flagsBitNumber % 8)) & 1) === 1;
		this.#flagsBitNumber++;
		return result;
	}

	/** @return {undefined} */
	$setBool(/** boolean */ on) {
		let index = Math.floor(this.#boolsBitNumber / 8);
		if (index >= this.$flags.length) this.$flags.push(0);
		if (on) this.$flags[index] |= 1 << (this.#boolsBitNumber % 8);
		this.#boolsBitNumber++;
	}
	/** @return {boolean} */
	$getBool() {
		let index = Math.floor(this.#boolsBitNumber / 8);
		let result = ((this.$flags[index] >>> (this.#boolsBitNumber % 8)) & 1) === 1;
		this.#boolsBitNumber++;
		return result;
	}

	/** @return {number} */
	$stringBytes(/** string */ value) {
		let bytes = _utf8Encoder.encode(value);
		return 4 + bytes.length;
	}

	/** @return {undefined} */
	$packMessage(/** PackMeMessage */ message) {
		message.$data = this.$data;
		message.$view = this.$view;
		message.#offset = this.#offset;
		message.$pack();
		this.#offset = message.#offset;
	}
	/** @return {PackMeMessage} */
	$unpackMessage(/** PackMeMessage */ message) {
		message.$data = this.$data;
		message.$view = this.$view;
		message.#offset = this.#offset;
		message.$unpack();
		this.#offset = message.#offset;
		return message;
	}

	/** @return {undefined} */
	$packBinary(/** Uint8Array */ value, /** number */ length) {
		for (let i = 0; i < length; i++) {
			this.$view.setUint8(this.#offset++, value[i] || 0);
		}
	}
	/** @return {undefined} */
	$packBool(/** boolean */ value) {
		this.$view.setUint8(this.#offset, value ? 1 : 0);
		this.#offset++;
	}
	/** @return {undefined} */
	$packInt8(/** number */ value) {
		this.$view.setInt8(this.#offset, value);
		this.#offset++;
	}
	/** @return {undefined} */
	$packInt16(/** number */ value) {
		this.$view.setInt16(this.#offset, value, false);
		this.#offset += 2;
	}
	/** @return {undefined} */
	$packInt32(/** number */ value) {
		this.$view.setInt32(this.#offset, value, false);
		this.#offset += 4;
	}
	/** @return {undefined} */
	$packInt64(/** bigint */ value) {
		this.$view.setBigInt64(this.#offset, value, false);
		this.#offset += 8;
	}
	/** @return {undefined} */
	$packUint8(/** number */ value) {
		this.$view.setUint8(this.#offset, value);
		this.#offset++;
	}
	/** @return {undefined} */
	$packUint16(/** number */ value) {
		this.$view.setUint16(this.#offset, value, false);
		this.#offset += 2;
	}
	/** @return {undefined} */
	$packUint32(/** number */ value) {
		this.$view.setUint32(this.#offset, value, false);
		this.#offset += 4;
	}
	/** @return {undefined} */
	$packUint64(/** bigint */ value) {
		if (typeof value == 'number') value = BigInt(value);
		this.$view.setBigUint64(this.#offset, value, false);
		this.#offset += 8;
	}
	/** @return {undefined} */
	$packFloat(/** number */ value) {
		this.$view.setFloat32(this.#offset, value, false);
		this.#offset += 4;
	}
	/** @return {undefined} */
	$packDouble(/** number */ value) {
		this.$view.setFloat64(this.#offset, value, false);
		this.#offset += 8;
	}
	/** @return {undefined} */
	$packDateTime(/** Date */ value) {
		this.$view.setBigInt64(this.#offset, BigInt(value.getTime()), false);
		this.#offset += 8;
	}
	/** @return {undefined} */
	$packString(/** string */ value) {
		let bytes = _utf8Encoder.encode(value);
		this.$view.setUint32(this.#offset, bytes.length, false);
		this.#offset += 4;
		for (let i = 0; i < bytes.length; i++) {
			this.$view.setInt8(this.#offset++, bytes[i]);
		}
	}

	/** @return {Uint8Array} */
	$unpackBinary(/** number */ length) {
		let value = new Uint8Array(length);
		for (let i = 0; i < length; i++) value[i] = this.$view.getUint8(this.#offset++);
		return value;
	}
	/** @return {boolean} */
	$unpackBool() {
		let value = this.$view.getUint8(this.#offset);
		this.#offset++;
		return value === 1;
	}
	/** @return {number} */
	$unpackInt8() {
		let value = this.$view.getInt8(this.#offset);
		this.#offset++;
		return value;
	}
	/** @return {number} */
	$unpackInt16() {
		let value = this.$view.getInt16(this.#offset, false);
		this.#offset += 2;
		return value;
	}
	/** @return {number} */
	$unpackInt32() {
		let value = this.$view.getInt32(this.#offset, false);
		this.#offset += 4;
		return value;
	}
	/** @return {bigint} */
	$unpackInt64() {
		let value = this.$view.getBigInt64(this.#offset, false);
		this.#offset += 8;
		return value;
	}
	/** @return {number} */
	$unpackUint8() {
		let value = this.$view.getUint8(this.#offset);
		this.#offset++;
		return value;
	}
	/** @return {number} */
	$unpackUint16() {
		let value = this.$view.getUint16(this.#offset, false);
		this.#offset += 2;
		return value;
	}
	/** @return {number} */
	$unpackUint32() {
		let value = this.$view.getUint32(this.#offset, false);
		this.#offset += 4;
		return value;
	}
	/** @return {bigint} */
	$unpackUint64() {
		let value = this.$view.getBigUint64(this.#offset, false);
		this.#offset += 8;
		return value;
	}
	/** @return {number} */
	$unpackFloat() {
		let value = this.$view.getFloat32(this.#offset, false);
		this.#offset += 4;
		return value;
	}
	/** @return {number} */
	$unpackDouble() {
		let value = this.$view.getFloat64(this.#offset, false);
		this.#offset += 8;
		return value;
	}
	/** @return {Date} */
	$unpackDateTime() {
		let value = this.$view.getBigInt64(this.#offset, false);
		this.#offset += 8;
		return new Date(Number(value));
	}
	/** @return {string} */
	$unpackString() {
		let length = this.$view.getUint32(this.#offset, false);
		this.#offset += 4;
		let result = _utf8Decoder.decode(this.$data.subarray(this.#offset, this.#offset + length));
		this.#offset += length;
		return result;
	}
}

export {PackMeMessage};