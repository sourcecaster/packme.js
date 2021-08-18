import {PackMe, PackMeMessage} from 'packme';

/** @enum {number} */
const TypeEnum = {
	one: 0,
	two: 1,
	four: 2,
};

class NestedObject extends PackMeMessage {
	/** @type {!number} */ a;
	/** @type {!string} */ b;
	
	constructor(
		/** !number */ a,
		/** !string */ b,
	) {
		super();
		this.$check('a', a);
		this.$check('b', b);
		this.a = a;
		this.b = b;
	}
	
	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 1;
		bytes += this.$stringBytes(this.b);
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		this.$packUint8(this.a);
		this.$packString(this.b);
	}

	/** @return {undefined} */
	$unpack() {
		this.a = this.$unpackUint8();
		this.b = this.$unpackString();
	}

	/** @return {string} */
	toString() {
		return `NestedObject\x1b[0m(a: ${PackMe.dye(this.a)}, b: ${PackMe.dye(this.b)})`;
	}
}

class TestMessage extends PackMeMessage {
	/** @type {!number} */ reqInt8;
	/** @type {!number} */ reqUint16;
	/** @type {!number} */ reqDouble;
	/** @type {!boolean} */ reqBool;
	/** @type {!string} */ reqString;
	/** @type {?number} */ optInt8;
	/** @type {?number} */ optUint16;
	/** @type {?number} */ optDouble;
	/** @type {?boolean} */ optBool;
	/** @type {?string} */ optString;
	/** @type {!number[]} */ reqList;
	/** @type {?number[]} */ optList;
	/** @type {!TypeEnum} */ reqEnum;
	/** @type {?TypeEnum} */ optEnum;
	/** @type {!NestedObject} */ reqNested;
	/** @type {?NestedObject} */ optNested;
	
	constructor(
		/** !number */ reqInt8,
		/** !number */ reqUint16,
		/** !number */ reqDouble,
		/** !boolean */ reqBool,
		/** !string */ reqString,
		/** ?number */ optInt8,
		/** ?number */ optUint16,
		/** ?number */ optDouble,
		/** ?boolean */ optBool,
		/** ?string */ optString,
		/** !number[] */ reqList,
		/** ?number[] */ optList,
		/** !TypeEnum */ reqEnum,
		/** ?TypeEnum */ optEnum,
		/** !NestedObject */ reqNested,
		/** ?NestedObject */ optNested,
	) {
		super();
		this.$check('reqInt8', reqInt8);
		this.$check('reqUint16', reqUint16);
		this.$check('reqDouble', reqDouble);
		this.$check('reqBool', reqBool);
		this.$check('reqString', reqString);
		this.$check('reqList', reqList);
		this.$check('reqEnum', reqEnum);
		this.$check('reqNested', reqNested);
		this.reqInt8 = reqInt8;
		this.reqUint16 = reqUint16;
		this.reqDouble = reqDouble;
		this.reqBool = reqBool;
		this.reqString = reqString;
		this.optInt8 = optInt8;
		this.optUint16 = optUint16;
		this.optDouble = optDouble;
		this.optBool = optBool;
		this.optString = optString;
		this.reqList = reqList;
		this.optList = optList;
		this.reqEnum = reqEnum;
		this.optEnum = optEnum;
		this.reqNested = reqNested;
		this.optNested = optNested;
	}
	
	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 22;
		bytes += this.$stringBytes(this.reqString);
		this.$setFlag(this.optInt8 != null);
		if (this.optInt8 != null) {
			bytes += 1;
		}
		this.$setFlag(this.optUint16 != null);
		if (this.optUint16 != null) {
			bytes += 2;
		}
		this.$setFlag(this.optDouble != null);
		if (this.optDouble != null) {
			bytes += 8;
		}
		this.$setFlag(this.optBool != null);
		if (this.optBool != null) {
			bytes += 1;
		}
		this.$setFlag(this.optString != null);
		if (this.optString != null) {
			bytes += this.$stringBytes(this.optString);
		}
		bytes += 4;
		bytes += 1 * this.reqList.length;
		this.$setFlag(this.optList != null);
		if (this.optList != null) {
			bytes += 4;
			bytes += 1 * this.optList.length;
		}
		this.$setFlag(this.optEnum != null);
		if (this.optEnum != null) {
			bytes += 1;
		}
		bytes += this.reqNested.$estimate();
		this.$setFlag(this.optNested != null);
		if (this.optNested != null) {
			bytes += this.optNested.$estimate();
		}
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		this.$initPack(475203406);
		for (let i = 0; i < 1; i++) this.$packUint8(this.$flags[i]);
		this.$packInt8(this.reqInt8);
		this.$packUint16(this.reqUint16);
		this.$packDouble(this.reqDouble);
		this.$packBool(this.reqBool);
		this.$packString(this.reqString);
		if (this.optInt8 != null) this.$packInt8(this.optInt8);
		if (this.optUint16 != null) this.$packUint16(this.optUint16);
		if (this.optDouble != null) this.$packDouble(this.optDouble);
		if (this.optBool != null) this.$packBool(this.optBool);
		if (this.optString != null) this.$packString(this.optString);
		this.$packUint32(this.reqList.length);
		for (let item of this.reqList) this.$packUint8(item);
		if (this.optList != null) {
			this.$packUint32(this.optList.length);
			for (let item of this.optList) this.$packUint8(item);
		}
		this.$packUint8(this.reqEnum);
		if (this.optEnum != null) this.$packUint8(this.optEnum);
		this.$packMessage(this.reqNested);
		if (this.optNested != null) this.$packMessage(this.optNested);
	}

	/** @return {undefined} */
	$unpack() {
		this.$initUnpack();
		for (let i = 0; i < 1; i++) this.$flags.push(this.$unpackUint8());
		this.reqInt8 = this.$unpackInt8();
		this.reqUint16 = this.$unpackUint16();
		this.reqDouble = this.$unpackDouble();
		this.reqBool = this.$unpackBool();
		this.reqString = this.$unpackString();
		if (this.$getFlag()) {
			this.optInt8 = this.$unpackInt8();
		}
		if (this.$getFlag()) {
			this.optUint16 = this.$unpackUint16();
		}
		if (this.$getFlag()) {
			this.optDouble = this.$unpackDouble();
		}
		if (this.$getFlag()) {
			this.optBool = this.$unpackBool();
		}
		if (this.$getFlag()) {
			this.optString = this.$unpackString();
		}
		this.reqList = [];
		let reqListLength = this.$unpackUint32();
		for (let i = 0; i < reqListLength; i++) {
			this.reqList.push(this.$unpackUint8());
		}
		if (this.$getFlag()) {
			this.optList = [];
			let optListLength = this.$unpackUint32();
			for (let i = 0; i < optListLength; i++) {
				this.optList.push(this.$unpackUint8());
			}
		}
		this.reqEnum = this.$unpackUint8();
		if (this.$getFlag()) {
			this.optEnum = this.$unpackUint8();
		}
		this.reqNested = this.$unpackMessage(new NestedObject());
		if (this.$getFlag()) {
			this.optNested = this.$unpackMessage(new NestedObject());
		}
	}

	/** @return {string} */
	toString() {
		return `TestMessage\x1b[0m(reqInt8: ${PackMe.dye(this.reqInt8)}, reqUint16: ${PackMe.dye(this.reqUint16)}, reqDouble: ${PackMe.dye(this.reqDouble)}, reqBool: ${PackMe.dye(this.reqBool)}, reqString: ${PackMe.dye(this.reqString)}, optInt8: ${PackMe.dye(this.optInt8)}, optUint16: ${PackMe.dye(this.optUint16)}, optDouble: ${PackMe.dye(this.optDouble)}, optBool: ${PackMe.dye(this.optBool)}, optString: ${PackMe.dye(this.optString)}, reqList: ${PackMe.dye(this.reqList)}, optList: ${PackMe.dye(this.optList)}, reqEnum: ${PackMe.dye(this.reqEnum)}, optEnum: ${PackMe.dye(this.optEnum)}, reqNested: ${PackMe.dye(this.reqNested)}, optNested: ${PackMe.dye(this.optNested)})`;
	}
}

const exampleMessageFactory = {
	'475203406': () => new TestMessage(),
};

export {TypeEnum, NestedObject, TestMessage, exampleMessageFactory};