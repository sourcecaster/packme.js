import { PackMe, PackMeMessage } from 'packme';

/**
 * @enum {number}
 */
export const TestEnum = Object.freeze({
	one: 0,
	two: 1,
	three: 2,
})

export class NestedObject extends PackMeMessage {
	/** @type {!number} */ a;
	/** @type {!string} */ b;

	$kinIds = new Map([
		[NestedObject, 0],
		[SubObject, 322265472],
		[SubSubObject, 909383523],
	]);

	static $emptyKin(id) {
		switch (id) {
			case 322265472: return new SubObject();
			case 909383523: return new SubSubObject();
			default: return new NestedObject();
		}
	}

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
		let bytes = 5;
		bytes += this.$stringBytes(this.b);
		return bytes;
	}

	$pack() {
		this.$packUint32(this.$kinIds.get(Object.getPrototypeOf(this).constructor) ?? 0);
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

export class SubObject extends NestedObject {
	/** @type {!number} */ c;

	/**
	 * @param {!number} a
	 * @param {!string} b
	 * @param {!number} c
	 */
	constructor (a, b, c) {
		if (arguments.length === 0) return super();
		super(a, b);
		this.c = this.$ensure('c', c);
	}

	$estimate() {
		let bytes = super.$estimate();
		bytes += 8;
		return bytes;
	}

	$pack() {
		super.$pack();
		this.$packDouble(this.c);
	}

	$unpack() {
		super.$unpack();
		this.c = this.$unpackDouble();
	}

	/** @returns {string} */
	toString() {
		return `SubObject\x1b[0m(a: ${PackMe.dye(this.a)}, b: ${PackMe.dye(this.b)}, c: ${PackMe.dye(this.c)})`;
	}
}

export class SubSubObject extends SubObject {
	/** @type {!number} */ d;

	/**
	 * @param {!number} a
	 * @param {!string} b
	 * @param {!number} c
	 * @param {!number} d
	 */
	constructor (a, b, c, d) {
		if (arguments.length === 0) return super();
		super(a, b, c);
		this.d = this.$ensure('d', d);
	}

	$estimate() {
		let bytes = super.$estimate();
		bytes += 8;
		return bytes;
	}

	$pack() {
		super.$pack();
		this.$packDouble(this.d);
	}

	$unpack() {
		super.$unpack();
		this.d = this.$unpackDouble();
	}

	/** @returns {string} */
	toString() {
		return `SubSubObject\x1b[0m(a: ${PackMe.dye(this.a)}, b: ${PackMe.dye(this.b)}, c: ${PackMe.dye(this.c)}, d: ${PackMe.dye(this.d)})`;
	}
}

export class TestMessage extends PackMeMessage {
	/** @type {!Uint8Array} */ reqId;
	/** @type {?Uint8Array} */ optId;
	/** @type {!Uint8Array[]} */ reqIds;
	/** @type {?Uint8Array[]} */ optIds;
	/** @type {!number} */ reqInt8;
	/** @type {!number} */ reqUint8;
	/** @type {!number} */ reqInt16;
	/** @type {!number} */ reqUint16;
	/** @type {!number} */ reqInt32;
	/** @type {!number} */ reqUint32;
	/** @type {!BigInt} */ reqInt64;
	/** @type {!BigInt} */ reqUint64;
	/** @type {!number} */ reqFloat;
	/** @type {!number} */ reqDouble;
	/** @type {!boolean} */ reqBool;
	/** @type {!string} */ reqString;
	/** @type {!number[]} */ reqList;
	/** @type {!TestEnum} */ reqEnum;
	/** @type {!NestedObject} */ reqNested;
	/** @type {!number[][]} */ reqNestedList;
	/** @type {!SubObject} */ reqInherited;
	/** @type {!SubSubObject} */ reqInheritedMore;
	/** @type {!NestedObject[]} */ reqMixedInherited;
	/** @type {?number} */ optInt8;
	/** @type {?number} */ optUint8;
	/** @type {?number} */ optInt16;
	/** @type {?number} */ optUint16;
	/** @type {?number} */ optInt32;
	/** @type {?number} */ optUint32;
	/** @type {?BigInt} */ optInt64;
	/** @type {?BigInt} */ optUint64;
	/** @type {?number} */ optFloat;
	/** @type {?number} */ optDouble;
	/** @type {?boolean} */ optBool;
	/** @type {?string} */ optString;
	/** @type {?number[]} */ optList;
	/** @type {?TestEnum} */ optEnum;
	/** @type {?NestedObject} */ optNested;
	/** @type {?number[][]} */ optNestedList;
	/** @type {?SubObject} */ optInherited;
	/** @type {?SubSubObject} */ optInheritedMore;
	/** @type {?NestedObject[]} */ optMixedInherited;

	/**
	 * @param {!Uint8Array} reqId
	 * @param {?Uint8Array} [optId]
	 * @param {!Uint8Array[]} reqIds
	 * @param {?Uint8Array[]} [optIds]
	 * @param {!number} reqInt8
	 * @param {!number} reqUint8
	 * @param {!number} reqInt16
	 * @param {!number} reqUint16
	 * @param {!number} reqInt32
	 * @param {!number} reqUint32
	 * @param {!BigInt} reqInt64
	 * @param {!BigInt} reqUint64
	 * @param {!number} reqFloat
	 * @param {!number} reqDouble
	 * @param {!boolean} reqBool
	 * @param {!string} reqString
	 * @param {!number[]} reqList
	 * @param {!TestEnum} reqEnum
	 * @param {!NestedObject} reqNested
	 * @param {!number[][]} reqNestedList
	 * @param {!SubObject} reqInherited
	 * @param {!SubSubObject} reqInheritedMore
	 * @param {!NestedObject[]} reqMixedInherited
	 * @param {?number} [optInt8]
	 * @param {?number} [optUint8]
	 * @param {?number} [optInt16]
	 * @param {?number} [optUint16]
	 * @param {?number} [optInt32]
	 * @param {?number} [optUint32]
	 * @param {?BigInt} [optInt64]
	 * @param {?BigInt} [optUint64]
	 * @param {?number} [optFloat]
	 * @param {?number} [optDouble]
	 * @param {?boolean} [optBool]
	 * @param {?string} [optString]
	 * @param {?number[]} [optList]
	 * @param {?TestEnum} [optEnum]
	 * @param {?NestedObject} [optNested]
	 * @param {?number[][]} [optNestedList]
	 * @param {?SubObject} [optInherited]
	 * @param {?SubSubObject} [optInheritedMore]
	 * @param {?NestedObject[]} [optMixedInherited]
	 */
	constructor (reqId, optId, reqIds, optIds, reqInt8, reqUint8, reqInt16, reqUint16, reqInt32, reqUint32, reqInt64, reqUint64, reqFloat, reqDouble, reqBool, reqString, reqList, reqEnum, reqNested, reqNestedList, reqInherited, reqInheritedMore, reqMixedInherited, optInt8, optUint8, optInt16, optUint16, optInt32, optUint32, optInt64, optUint64, optFloat, optDouble, optBool, optString, optList, optEnum, optNested, optNestedList, optInherited, optInheritedMore, optMixedInherited) {
		if (arguments.length === 0) return super();
		super();
		this.reqId = this.$ensure('reqId', reqId);
		this.optId = optId;
		this.reqIds = this.$ensure('reqIds', reqIds);
		this.optIds = optIds;
		this.reqInt8 = this.$ensure('reqInt8', reqInt8);
		this.reqUint8 = this.$ensure('reqUint8', reqUint8);
		this.reqInt16 = this.$ensure('reqInt16', reqInt16);
		this.reqUint16 = this.$ensure('reqUint16', reqUint16);
		this.reqInt32 = this.$ensure('reqInt32', reqInt32);
		this.reqUint32 = this.$ensure('reqUint32', reqUint32);
		this.reqInt64 = this.$ensure('reqInt64', reqInt64);
		this.reqUint64 = this.$ensure('reqUint64', reqUint64);
		this.reqFloat = this.$ensure('reqFloat', reqFloat);
		this.reqDouble = this.$ensure('reqDouble', reqDouble);
		this.reqBool = this.$ensure('reqBool', reqBool);
		this.reqString = this.$ensure('reqString', reqString);
		this.reqList = this.$ensure('reqList', reqList);
		this.reqEnum = this.$ensure('reqEnum', reqEnum);
		this.reqNested = this.$ensure('reqNested', reqNested);
		this.reqNestedList = this.$ensure('reqNestedList', reqNestedList);
		this.reqInherited = this.$ensure('reqInherited', reqInherited);
		this.reqInheritedMore = this.$ensure('reqInheritedMore', reqInheritedMore);
		this.reqMixedInherited = this.$ensure('reqMixedInherited', reqMixedInherited);
		this.optInt8 = optInt8;
		this.optUint8 = optUint8;
		this.optInt16 = optInt16;
		this.optUint16 = optUint16;
		this.optInt32 = optInt32;
		this.optUint32 = optUint32;
		this.optInt64 = optInt64;
		this.optUint64 = optUint64;
		this.optFloat = optFloat;
		this.optDouble = optDouble;
		this.optBool = optBool;
		this.optString = optString;
		this.optList = optList;
		this.optEnum = optEnum;
		this.optNested = optNested;
		this.optNestedList = optNestedList;
		this.optInherited = optInherited;
		this.optInheritedMore = optInheritedMore;
		this.optMixedInherited = optMixedInherited;
	}

	$estimate() {
		this.$reset();
		let bytes = 67;
		this.$setFlag(this.optId != null);
		if (this.optId != null) bytes += 12;
		bytes += 4 + this.reqIds.length * 4;
		this.$setFlag(this.optIds != null);
		if (this.optIds != null) bytes += 4 + this.optIds.reduce((a, b) => a + 4, 0);
		bytes += this.$stringBytes(this.reqString);
		bytes += 4 + this.reqList.length * 1;
		bytes += this.reqNested.$estimate();
		bytes += 4 + this.reqNestedList.reduce((a, b) => a + 4 + b.length * 4, 0);
		bytes += this.reqInherited.$estimate();
		bytes += this.reqInheritedMore.$estimate();
		bytes += 4 + this.reqMixedInherited.reduce((a, b) => a + b.$estimate(), 0);
		this.$setFlag(this.optInt8 != null);
		if (this.optInt8 != null) bytes += 1;
		this.$setFlag(this.optUint8 != null);
		if (this.optUint8 != null) bytes += 1;
		this.$setFlag(this.optInt16 != null);
		if (this.optInt16 != null) bytes += 2;
		this.$setFlag(this.optUint16 != null);
		if (this.optUint16 != null) bytes += 2;
		this.$setFlag(this.optInt32 != null);
		if (this.optInt32 != null) bytes += 4;
		this.$setFlag(this.optUint32 != null);
		if (this.optUint32 != null) bytes += 4;
		this.$setFlag(this.optInt64 != null);
		if (this.optInt64 != null) bytes += 8;
		this.$setFlag(this.optUint64 != null);
		if (this.optUint64 != null) bytes += 8;
		this.$setFlag(this.optFloat != null);
		if (this.optFloat != null) bytes += 4;
		this.$setFlag(this.optDouble != null);
		if (this.optDouble != null) bytes += 8;
		this.$setFlag(this.optBool != null);
		if (this.optBool != null) bytes += 1;
		this.$setFlag(this.optString != null);
		if (this.optString != null) bytes += this.$stringBytes(this.optString);
		this.$setFlag(this.optList != null);
		if (this.optList != null) bytes += 4 + this.optList.reduce((a, b) => a + 1, 0);
		this.$setFlag(this.optEnum != null);
		if (this.optEnum != null) bytes += 1;
		this.$setFlag(this.optNested != null);
		if (this.optNested != null) bytes += this.optNested.$estimate();
		this.$setFlag(this.optNestedList != null);
		if (this.optNestedList != null) bytes += 4 + this.optNestedList.reduce((a, b) => a + 4 + b.reduce((a, b) => a + 4, 0), 0);
		this.$setFlag(this.optInherited != null);
		if (this.optInherited != null) bytes += this.optInherited.$estimate();
		this.$setFlag(this.optInheritedMore != null);
		if (this.optInheritedMore != null) bytes += this.optInheritedMore.$estimate();
		this.$setFlag(this.optMixedInherited != null);
		if (this.optMixedInherited != null) bytes += 4 + this.optMixedInherited.reduce((a, b) => a + b.$estimate(), 0);
		return bytes;
	}

	$pack() {
		this.$initPack(184530025);
		for (let i = 0; i < 3; i++) this.$packUint8(this.$flags[i]);
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
		this.$packUint8(this.reqUint8);
		this.$packInt16(this.reqInt16);
		this.$packUint16(this.reqUint16);
		this.$packInt32(this.reqInt32);
		this.$packUint32(this.reqUint32);
		this.$packInt64(this.reqInt64);
		this.$packUint64(this.reqUint64);
		this.$packFloat(this.reqFloat);
		this.$packDouble(this.reqDouble);
		this.$packBool(this.reqBool);
		this.$packString(this.reqString);
		this.$packUint32(this.reqList.length);
		for (let i7 = 0; i7 < this.reqList.length; i7++) {
			this.$packUint8(this.reqList[i7]);
		}
		this.$packUint8(this.reqEnum);
		this.$packMessage(this.reqNested);
		this.$packUint32(this.reqNestedList.length);
		for (let i13 = 0; i13 < this.reqNestedList.length; i13++) {
			this.$packUint32(this.reqNestedList[i13].length);
			for (let i18 = 0; i18 < this.reqNestedList[i13].length; i18++) {
				this.$packInt32(this.reqNestedList[i13][i18]);
			}
		}
		this.$packMessage(this.reqInherited);
		this.$packMessage(this.reqInheritedMore);
		this.$packUint32(this.reqMixedInherited.length);
		for (let i17 = 0; i17 < this.reqMixedInherited.length; i17++) {
			this.$packMessage(this.reqMixedInherited[i17]);
		}
		if (this.optInt8 != null) this.$packInt8(this.optInt8);
		if (this.optUint8 != null) this.$packUint8(this.optUint8);
		if (this.optInt16 != null) this.$packInt16(this.optInt16);
		if (this.optUint16 != null) this.$packUint16(this.optUint16);
		if (this.optInt32 != null) this.$packInt32(this.optInt32);
		if (this.optUint32 != null) this.$packUint32(this.optUint32);
		if (this.optInt64 != null) this.$packInt64(this.optInt64);
		if (this.optUint64 != null) this.$packUint64(this.optUint64);
		if (this.optFloat != null) this.$packFloat(this.optFloat);
		if (this.optDouble != null) this.$packDouble(this.optDouble);
		if (this.optBool != null) this.$packBool(this.optBool);
		if (this.optString != null) this.$packString(this.optString);
		if (this.optList != null) {
			this.$packUint32(this.optList.length);
			for (let i7 = 0; i7 < this.optList.length; i7++) {
				this.$packUint8(this.optList[i7]);
			}
		}
		if (this.optEnum != null) this.$packUint8(this.optEnum);
		if (this.optNested != null) this.$packMessage(this.optNested);
		if (this.optNestedList != null) {
			this.$packUint32(this.optNestedList.length);
			for (let i13 = 0; i13 < this.optNestedList.length; i13++) {
				this.$packUint32(this.optNestedList[i13].length);
				for (let i18 = 0; i18 < this.optNestedList[i13].length; i18++) {
					this.$packInt32(this.optNestedList[i13][i18]);
				}
			}
		}
		if (this.optInherited != null) this.$packMessage(this.optInherited);
		if (this.optInheritedMore != null) this.$packMessage(this.optInheritedMore);
		if (this.optMixedInherited != null) {
			this.$packUint32(this.optMixedInherited.length);
			for (let i17 = 0; i17 < this.optMixedInherited.length; i17++) {
				this.$packMessage(this.optMixedInherited[i17]);
			}
		}
	}

	$unpack() {
		this.$initUnpack();
		for (let i = 0; i < 3; i++) this.$flags.push(this.$unpackUint8());
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
		this.reqUint8 = this.$unpackUint8();
		this.reqInt16 = this.$unpackInt16();
		this.reqUint16 = this.$unpackUint16();
		this.reqInt32 = this.$unpackInt32();
		this.reqUint32 = this.$unpackUint32();
		this.reqInt64 = this.$unpackInt64();
		this.reqUint64 = this.$unpackUint64();
		this.reqFloat = this.$unpackFloat();
		this.reqDouble = this.$unpackDouble();
		this.reqBool = this.$unpackBool();
		this.reqString = this.$unpackString();
		this.reqList = Array.from({ length: this.$unpackUint32() }, () => {
			return this.$unpackUint8();
		})
		this.reqEnum = this.$unpackUint8();
		this.reqNested = this.$unpackMessage(NestedObject.$emptyKin(this.$unpackUint32()));
		this.reqNestedList = Array.from({ length: this.$unpackUint32() }, () => {
			return Array.from({ length: this.$unpackUint32() }, () => {
				return this.$unpackInt32();
			})
		})
		this.reqInherited = this.$unpackMessage(NestedObject.$emptyKin(this.$unpackUint32()));
		this.reqInheritedMore = this.$unpackMessage(NestedObject.$emptyKin(this.$unpackUint32()));
		this.reqMixedInherited = Array.from({ length: this.$unpackUint32() }, () => {
			return this.$unpackMessage(NestedObject.$emptyKin(this.$unpackUint32()));
		})
		if (this.$getFlag()) this.optInt8 = this.$unpackInt8();
		if (this.$getFlag()) this.optUint8 = this.$unpackUint8();
		if (this.$getFlag()) this.optInt16 = this.$unpackInt16();
		if (this.$getFlag()) this.optUint16 = this.$unpackUint16();
		if (this.$getFlag()) this.optInt32 = this.$unpackInt32();
		if (this.$getFlag()) this.optUint32 = this.$unpackUint32();
		if (this.$getFlag()) this.optInt64 = this.$unpackInt64();
		if (this.$getFlag()) this.optUint64 = this.$unpackUint64();
		if (this.$getFlag()) this.optFloat = this.$unpackFloat();
		if (this.$getFlag()) this.optDouble = this.$unpackDouble();
		if (this.$getFlag()) this.optBool = this.$unpackBool();
		if (this.$getFlag()) this.optString = this.$unpackString();
		if (this.$getFlag()) {
			this.optList = Array.from({ length: this.$unpackUint32() }, () => {
				return this.$unpackUint8();
			})
		}
		if (this.$getFlag()) this.optEnum = this.$unpackUint8();
		if (this.$getFlag()) this.optNested = this.$unpackMessage(NestedObject.$emptyKin(this.$unpackUint32()));
		if (this.$getFlag()) {
			this.optNestedList = Array.from({ length: this.$unpackUint32() }, () => {
				return Array.from({ length: this.$unpackUint32() }, () => {
					return this.$unpackInt32();
				})
			})
		}
		if (this.$getFlag()) this.optInherited = this.$unpackMessage(NestedObject.$emptyKin(this.$unpackUint32()));
		if (this.$getFlag()) this.optInheritedMore = this.$unpackMessage(NestedObject.$emptyKin(this.$unpackUint32()));
		if (this.$getFlag()) {
			this.optMixedInherited = Array.from({ length: this.$unpackUint32() }, () => {
				return this.$unpackMessage(NestedObject.$emptyKin(this.$unpackUint32()));
			})
		}
	}

	/** @returns {string} */
	toString() {
		return `TestMessage\x1b[0m(reqId: ${PackMe.dye(this.reqId)}, optId: ${PackMe.dye(this.optId)}, reqIds: ${PackMe.dye(this.reqIds)}, optIds: ${PackMe.dye(this.optIds)}, reqInt8: ${PackMe.dye(this.reqInt8)}, reqUint8: ${PackMe.dye(this.reqUint8)}, reqInt16: ${PackMe.dye(this.reqInt16)}, reqUint16: ${PackMe.dye(this.reqUint16)}, reqInt32: ${PackMe.dye(this.reqInt32)}, reqUint32: ${PackMe.dye(this.reqUint32)}, reqInt64: ${PackMe.dye(this.reqInt64)}, reqUint64: ${PackMe.dye(this.reqUint64)}, reqFloat: ${PackMe.dye(this.reqFloat)}, reqDouble: ${PackMe.dye(this.reqDouble)}, reqBool: ${PackMe.dye(this.reqBool)}, reqString: ${PackMe.dye(this.reqString)}, reqList: ${PackMe.dye(this.reqList)}, reqEnum: ${PackMe.dye(this.reqEnum)}, reqNested: ${PackMe.dye(this.reqNested)}, reqNestedList: ${PackMe.dye(this.reqNestedList)}, reqInherited: ${PackMe.dye(this.reqInherited)}, reqInheritedMore: ${PackMe.dye(this.reqInheritedMore)}, reqMixedInherited: ${PackMe.dye(this.reqMixedInherited)}, optInt8: ${PackMe.dye(this.optInt8)}, optUint8: ${PackMe.dye(this.optUint8)}, optInt16: ${PackMe.dye(this.optInt16)}, optUint16: ${PackMe.dye(this.optUint16)}, optInt32: ${PackMe.dye(this.optInt32)}, optUint32: ${PackMe.dye(this.optUint32)}, optInt64: ${PackMe.dye(this.optInt64)}, optUint64: ${PackMe.dye(this.optUint64)}, optFloat: ${PackMe.dye(this.optFloat)}, optDouble: ${PackMe.dye(this.optDouble)}, optBool: ${PackMe.dye(this.optBool)}, optString: ${PackMe.dye(this.optString)}, optList: ${PackMe.dye(this.optList)}, optEnum: ${PackMe.dye(this.optEnum)}, optNested: ${PackMe.dye(this.optNested)}, optNestedList: ${PackMe.dye(this.optNestedList)}, optInherited: ${PackMe.dye(this.optInherited)}, optInheritedMore: ${PackMe.dye(this.optInheritedMore)}, optMixedInherited: ${PackMe.dye(this.optMixedInherited)})`;
	}
}

export const packmeTestMessageFactory = Object.freeze({
	184530025: () => new TestMessage(),
});