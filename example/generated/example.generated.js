import { PackMe, PackMeMessage } from 'packme';

/**
 * @enum {number}
 */
export const TypeEnum = Object.freeze({
	one: 0,
	two: 1,
	four: 2,
})

export class NestedObject extends PackMeMessage {
	/** @type {!number} */ a;
	/** @type {!string} */ b;

	/**
	 * @param {!number} a
	 * @param {!string} b
	 */
	constructor (a, b) {
		if (arguments.length === 0) return super();
		super();
		this.a = this.$ensure('a', a);
		this.b = this.$ensure('b', b);
	}

	$estimate() {
		this.$reset();
		let bytes = 1;
		bytes += this.$stringBytes(this.b);
		return bytes;
	}

	$pack() {
		this.$packUint8(this.a);
		this.$packString(this.b);
	}

	$unpack() {
		this.a = this.$unpackUint8();
		this.b = this.$unpackString();
	}

	/** @returns {string} */
	toString() {
		return `NestedObject\x1b[0m(a: ${PackMe.dye(this.a)}, b: ${PackMe.dye(this.b)})`;
	}
}

export class TestMessage extends PackMeMessage {
	/** @type {!Uint8Array} */ reqId;
	/** @type {?Uint8Array} */ optId;
	/** @type {!Uint8Array[]} */ reqIds;
	/** @type {?Uint8Array[]} */ optIds;
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

	/**
	 * @param {!Uint8Array} reqId
	 * @param {?Uint8Array} [optId]
	 * @param {!Uint8Array[]} reqIds
	 * @param {?Uint8Array[]} [optIds]
	 * @param {!number} reqInt8
	 * @param {!number} reqUint16
	 * @param {!number} reqDouble
	 * @param {!boolean} reqBool
	 * @param {!string} reqString
	 * @param {?number} [optInt8]
	 * @param {?number} [optUint16]
	 * @param {?number} [optDouble]
	 * @param {?boolean} [optBool]
	 * @param {?string} [optString]
	 * @param {!number[]} reqList
	 * @param {?number[]} [optList]
	 * @param {!TypeEnum} reqEnum
	 * @param {?TypeEnum} [optEnum]
	 * @param {!NestedObject} reqNested
	 * @param {?NestedObject} [optNested]
	 */
	constructor (reqId, optId, reqIds, optIds, reqInt8, reqUint16, reqDouble, reqBool, reqString, optInt8, optUint16, optDouble, optBool, optString, reqList, optList, reqEnum, optEnum, reqNested, optNested) {
		if (arguments.length === 0) return super();
		super();
		this.reqId = this.$ensure('reqId', reqId);
		this.optId = optId;
		this.reqIds = this.$ensure('reqIds', reqIds);
		this.optIds = optIds;
		this.reqInt8 = this.$ensure('reqInt8', reqInt8);
		this.reqUint16 = this.$ensure('reqUint16', reqUint16);
		this.reqDouble = this.$ensure('reqDouble', reqDouble);
		this.reqBool = this.$ensure('reqBool', reqBool);
		this.reqString = this.$ensure('reqString', reqString);
		this.optInt8 = optInt8;
		this.optUint16 = optUint16;
		this.optDouble = optDouble;
		this.optBool = optBool;
		this.optString = optString;
		this.reqList = this.$ensure('reqList', reqList);
		this.optList = optList;
		this.reqEnum = this.$ensure('reqEnum', reqEnum);
		this.optEnum = optEnum;
		this.reqNested = this.$ensure('reqNested', reqNested);
		this.optNested = optNested;
	}

	$estimate() {
		this.$reset();
		let bytes = 35;
		this.$setFlag(this.optId != null);
		if (this.optId != null) bytes += 12;
		bytes += 4 + this.reqIds.length * 4;
		this.$setFlag(this.optIds != null);
		if (this.optIds != null) bytes += 4 + this.optIds.reduce((a, b) => a + 4, 0);
		bytes += this.$stringBytes(this.reqString);
		this.$setFlag(this.optInt8 != null);
		if (this.optInt8 != null) bytes += 1;
		this.$setFlag(this.optUint16 != null);
		if (this.optUint16 != null) bytes += 2;
		this.$setFlag(this.optDouble != null);
		if (this.optDouble != null) bytes += 8;
		this.$setFlag(this.optBool != null);
		if (this.optBool != null) bytes += 1;
		this.$setFlag(this.optString != null);
		if (this.optString != null) bytes += this.$stringBytes(this.optString);
		bytes += 4 + this.reqList.length * 1;
		this.$setFlag(this.optList != null);
		if (this.optList != null) bytes += 4 + this.optList.reduce((a, b) => a + 1, 0);
		this.$setFlag(this.optEnum != null);
		if (this.optEnum != null) bytes += 1;
		bytes += this.reqNested.$estimate();
		this.$setFlag(this.optNested != null);
		if (this.optNested != null) bytes += this.optNested.$estimate();
		return bytes;
	}

	$pack() {
		this.$initPack(475203406);
		for (let i = 0; i < 2; i++) this.$packUint8(this.$flags[i]);
		this.$packBinary(this.reqId, 12);
		if (this.optId != null) this.$packBinary(this.optId, 12);
		this.$packUint32(this.reqIds.length);
		for (let i6 = 0; i6 < this.reqIds.length; i6++) {
			this.$packBinary(this.reqIds[i6], 4);
		}
		if (this.optIds != null) {
			this.$packUint32(this.optIds.length);
			for (let i6 = 0; i6 < this.optIds.length; i6++) {
				this.$packBinary(this.optIds[i6], 4);
			}
		}
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
		for (let i7 = 0; i7 < this.reqList.length; i7++) {
			this.$packUint8(this.reqList[i7]);
		}
		if (this.optList != null) {
			this.$packUint32(this.optList.length);
			for (let i7 = 0; i7 < this.optList.length; i7++) {
				this.$packUint8(this.optList[i7]);
			}
		}
		this.$packUint8(this.reqEnum);
		if (this.optEnum != null) this.$packUint8(this.optEnum);
		this.$packMessage(this.reqNested);
		if (this.optNested != null) this.$packMessage(this.optNested);
	}

	$unpack() {
		this.$initUnpack();
		for (let i = 0; i < 2; i++) this.$flags.push(this.$unpackUint8());
		this.reqId = this.$unpackBinary(12);
		if (this.$getFlag()) this.optId = this.$unpackBinary(12);
		this.reqIds = Array.from({ length: this.$unpackUint32() }, () => {
			return this.$unpackBinary(4);
		})
		if (this.$getFlag()) {
			this.optIds = Array.from({ length: this.$unpackUint32() }, () => {
				return this.$unpackBinary(4);
			})
		}
		this.reqInt8 = this.$unpackInt8();
		this.reqUint16 = this.$unpackUint16();
		this.reqDouble = this.$unpackDouble();
		this.reqBool = this.$unpackBool();
		this.reqString = this.$unpackString();
		if (this.$getFlag()) this.optInt8 = this.$unpackInt8();
		if (this.$getFlag()) this.optUint16 = this.$unpackUint16();
		if (this.$getFlag()) this.optDouble = this.$unpackDouble();
		if (this.$getFlag()) this.optBool = this.$unpackBool();
		if (this.$getFlag()) this.optString = this.$unpackString();
		this.reqList = Array.from({ length: this.$unpackUint32() }, () => {
			return this.$unpackUint8();
		})
		if (this.$getFlag()) {
			this.optList = Array.from({ length: this.$unpackUint32() }, () => {
				return this.$unpackUint8();
			})
		}
		this.reqEnum = this.$unpackUint8();
		if (this.$getFlag()) this.optEnum = this.$unpackUint8();
		this.reqNested = this.$unpackMessage(new NestedObject());
		if (this.$getFlag()) this.optNested = this.$unpackMessage(new NestedObject());
	}

	/** @returns {string} */
	toString() {
		return `TestMessage\x1b[0m(reqId: ${PackMe.dye(this.reqId)}, optId: ${PackMe.dye(this.optId)}, reqIds: ${PackMe.dye(this.reqIds)}, optIds: ${PackMe.dye(this.optIds)}, reqInt8: ${PackMe.dye(this.reqInt8)}, reqUint16: ${PackMe.dye(this.reqUint16)}, reqDouble: ${PackMe.dye(this.reqDouble)}, reqBool: ${PackMe.dye(this.reqBool)}, reqString: ${PackMe.dye(this.reqString)}, optInt8: ${PackMe.dye(this.optInt8)}, optUint16: ${PackMe.dye(this.optUint16)}, optDouble: ${PackMe.dye(this.optDouble)}, optBool: ${PackMe.dye(this.optBool)}, optString: ${PackMe.dye(this.optString)}, reqList: ${PackMe.dye(this.reqList)}, optList: ${PackMe.dye(this.optList)}, reqEnum: ${PackMe.dye(this.reqEnum)}, optEnum: ${PackMe.dye(this.optEnum)}, reqNested: ${PackMe.dye(this.reqNested)}, optNested: ${PackMe.dye(this.optNested)})`;
	}
}

export const exampleMessageFactory = Object.freeze({
	475203406: () => new TestMessage(),
});