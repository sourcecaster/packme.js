import { PackMe, PackMeMessage } from 'packme';

/**
 * @enum {number}
 */
export const HalfLifeVersion = Object.freeze({
	one: 0,
	two: 1,
	four: 2,
})

export class InfoEntity extends PackMeMessage {
	/** @type {!string} */ string;
	/** @type {!number} */ value;
	/** @type {!boolean} */ flag;
	/** @type {!HalfLifeVersion} */ version;

	$kinIds = new Map([
		[InfoEntity, 0],
		[InfoSubclass, 320635948],
	]);

	static $emptyKin(id) {
		switch (id) {
			case 320635948: return new InfoSubclass();
			default: return new InfoEntity();
		}
	}

	/**
	 * @param {!string} string
	 * @param {!number} value
	 * @param {!boolean} flag
	 * @param {!HalfLifeVersion} version
	 */
	constructor (string, value, flag, version) {
		if (arguments.length === 0) return super();
		super();
		this.string = this.$ensure('string', string);
		this.value = this.$ensure('value', value);
		this.flag = this.$ensure('flag', flag);
		this.version = this.$ensure('version', version);
	}

	$estimate() {
		this.$reset();
		let bytes = 10;
		bytes += this.$stringBytes(this.string);
		return bytes;
	}

	$pack() {
		this.$packUint32(this.$kinIds.get(Object.getPrototypeOf(this).constructor) ?? 0);
		this.$packString(this.string);
		this.$packUint32(this.value);
		this.$packBool(this.flag);
		this.$packUint8(this.version);
	}

	$unpack() {
		this.string = this.$unpackString();
		this.value = this.$unpackUint32();
		this.flag = this.$unpackBool();
		this.version = this.$unpackUint8();
	}

	/** @returns {string} */
	toString() {
		return `InfoEntity\x1b[0m(string: ${PackMe.dye(this.string)}, value: ${PackMe.dye(this.value)}, flag: ${PackMe.dye(this.flag)}, version: ${PackMe.dye(this.version)})`;
	}
}

export class InfoSubclass extends InfoEntity {
	/** @type {!number} */ weight;
	/** @type {!string} */ comment;

	/**
	 * @param {!string} string
	 * @param {!number} value
	 * @param {!boolean} flag
	 * @param {!HalfLifeVersion} version
	 * @param {!number} weight
	 * @param {!string} comment
	 */
	constructor (string, value, flag, version, weight, comment) {
		if (arguments.length === 0) return super();
		super(string, value, flag, version);
		this.weight = this.$ensure('weight', weight);
		this.comment = this.$ensure('comment', comment);
	}

	$estimate() {
		let bytes = super.$estimate();
		bytes += 8;
		bytes += this.$stringBytes(this.comment);
		return bytes;
	}

	$pack() {
		super.$pack();
		this.$packDouble(this.weight);
		this.$packString(this.comment);
	}

	$unpack() {
		super.$unpack();
		this.weight = this.$unpackDouble();
		this.comment = this.$unpackString();
	}

	/** @returns {string} */
	toString() {
		return `InfoSubclass\x1b[0m(string: ${PackMe.dye(this.string)}, value: ${PackMe.dye(this.value)}, flag: ${PackMe.dye(this.flag)}, version: ${PackMe.dye(this.version)}, weight: ${PackMe.dye(this.weight)}, comment: ${PackMe.dye(this.comment)})`;
	}
}

export class GetDataResponseItem extends PackMeMessage {
	/** @type {?string} */ string;
	/** @type {?number} */ value;
	/** @type {?boolean} */ flag;
	/** @type {?HalfLifeVersion} */ version;

	/**
	 * @param {?string} [string]
	 * @param {?number} [value]
	 * @param {?boolean} [flag]
	 * @param {?HalfLifeVersion} [version]
	 */
	constructor (string, value, flag, version) {
		if (arguments.length === 0) return super();
		super();
		this.string = string;
		this.value = value;
		this.flag = flag;
		this.version = version;
	}

	$estimate() {
		this.$reset();
		let bytes = 1;
		this.$setFlag(this.string != null);
		if (this.string != null) bytes += this.$stringBytes(this.string);
		this.$setFlag(this.value != null);
		if (this.value != null) bytes += 4;
		this.$setFlag(this.flag != null);
		if (this.flag != null) bytes += 1;
		this.$setFlag(this.version != null);
		if (this.version != null) bytes += 1;
		return bytes;
	}

	$pack() {
		for (let i = 0; i < 1; i++) this.$packUint8(this.$flags[i]);
		if (this.string != null) this.$packString(this.string);
		if (this.value != null) this.$packUint32(this.value);
		if (this.flag != null) this.$packBool(this.flag);
		if (this.version != null) this.$packUint8(this.version);
	}

	$unpack() {
		for (let i = 0; i < 1; i++) this.$flags.push(this.$unpackUint8());
		if (this.$getFlag()) this.string = this.$unpackString();
		if (this.$getFlag()) this.value = this.$unpackUint32();
		if (this.$getFlag()) this.flag = this.$unpackBool();
		if (this.$getFlag()) this.version = this.$unpackUint8();
	}

	/** @returns {string} */
	toString() {
		return `GetDataResponseItem\x1b[0m(string: ${PackMe.dye(this.string)}, value: ${PackMe.dye(this.value)}, flag: ${PackMe.dye(this.flag)}, version: ${PackMe.dye(this.version)})`;
	}
}

export class SendInfoMessage extends PackMeMessage {
	/** @type {!number[]} */ id;
	/** @type {!string[]} */ notes;
	/** @type {!HalfLifeVersion} */ version;
	/** @type {!InfoEntity} */ entity;
	/** @type {!InfoSubclass} */ subEntity;

	/**
	 * @param {!number[]} id
	 * @param {!string[]} notes
	 * @param {!HalfLifeVersion} version
	 * @param {!InfoEntity} entity
	 * @param {!InfoSubclass} subEntity
	 */
	constructor (id, notes, version, entity, subEntity) {
		if (arguments.length === 0) return super();
		super();
		this.id = this.$ensure('id', id);
		this.notes = this.$ensure('notes', notes);
		this.version = this.$ensure('version', version);
		this.entity = this.$ensure('entity', entity);
		this.subEntity = this.$ensure('subEntity', subEntity);
	}

	$estimate() {
		this.$reset();
		let bytes = 9;
		bytes += 4 + this.id.length * 1;
		bytes += 4 + this.notes.reduce((a, b) => a + this.$stringBytes(b), 0);
		bytes += this.entity.$estimate();
		bytes += this.subEntity.$estimate();
		return bytes;
	}

	$pack() {
		this.$initPack(511521838);
		this.$packUint32(this.id.length);
		for (let i2 = 0; i2 < this.id.length; i2++) {
			this.$packUint8(this.id[i2]);
		}
		this.$packUint32(this.notes.length);
		for (let i5 = 0; i5 < this.notes.length; i5++) {
			this.$packString(this.notes[i5]);
		}
		this.$packUint8(this.version);
		this.$packMessage(this.entity);
		this.$packMessage(this.subEntity);
	}

	$unpack() {
		this.$initUnpack();
		this.id = Array.from({ length: this.$unpackUint32() }, () => {
			return this.$unpackUint8();
		})
		this.notes = Array.from({ length: this.$unpackUint32() }, () => {
			return this.$unpackString();
		})
		this.version = this.$unpackUint8();
		this.entity = this.$unpackMessage(InfoEntity.$emptyKin(this.$unpackUint32()));
		this.subEntity = this.$unpackMessage(InfoEntity.$emptyKin(this.$unpackUint32()));
	}

	/** @returns {string} */
	toString() {
		return `SendInfoMessage\x1b[0m(id: ${PackMe.dye(this.id)}, notes: ${PackMe.dye(this.notes)}, version: ${PackMe.dye(this.version)}, entity: ${PackMe.dye(this.entity)}, subEntity: ${PackMe.dye(this.subEntity)})`;
	}
}

export class GetDataRequest extends PackMeMessage {
	/** @type {!number[]} */ id;
	/** @type {?number} */ limit;

	/**
	 * @param {!number[]} id
	 * @param {?number} [limit]
	 */
	constructor (id, limit) {
		if (arguments.length === 0) return super();
		super();
		this.id = this.$ensure('id', id);
		this.limit = limit;
	}

	/**
	 * @param {!GetDataResponseItem[]} items
	 * @returns {GetDataResponse}
	 */
	$response(items) {
		let message = new GetDataResponse(items);
		message.$request = this;
		return message;
	}

	$estimate() {
		this.$reset();
		let bytes = 9;
		bytes += 4 + this.id.length * 1;
		this.$setFlag(this.limit != null);
		if (this.limit != null) bytes += 2;
		return bytes;
	}

	$pack() {
		this.$initPack(845589919);
		for (let i = 0; i < 1; i++) this.$packUint8(this.$flags[i]);
		this.$packUint32(this.id.length);
		for (let i2 = 0; i2 < this.id.length; i2++) {
			this.$packUint8(this.id[i2]);
		}
		if (this.limit != null) this.$packUint16(this.limit);
	}

	$unpack() {
		this.$initUnpack();
		for (let i = 0; i < 1; i++) this.$flags.push(this.$unpackUint8());
		this.id = Array.from({ length: this.$unpackUint32() }, () => {
			return this.$unpackUint8();
		})
		if (this.$getFlag()) this.limit = this.$unpackUint16();
	}

	/** @returns {string} */
	toString() {
		return `GetDataRequest\x1b[0m(id: ${PackMe.dye(this.id)}, limit: ${PackMe.dye(this.limit)})`;
	}
}

export class GetDataResponse extends PackMeMessage {
	/** @type {!GetDataResponseItem[]} */ items;

	/**
	 * @param {!GetDataResponseItem[]} items
	 */
	constructor (items) {
		if (arguments.length === 0) return super();
		super();
		this.items = this.$ensure('items', items);
	}

	$estimate() {
		this.$reset();
		let bytes = 8;
		bytes += 4 + this.items.reduce((a, b) => a + b.$estimate(), 0);
		return bytes;
	}

	$pack() {
		this.$initPack(160528308);
		this.$packUint32(this.items.length);
		for (let i5 = 0; i5 < this.items.length; i5++) {
			this.$packMessage(this.items[i5]);
		}
	}

	$unpack() {
		this.$initUnpack();
		this.items = Array.from({ length: this.$unpackUint32() }, () => {
			return this.$unpackMessage(new GetDataResponseItem());
		})
	}

	/** @returns {string} */
	toString() {
		return `GetDataResponse\x1b[0m(items: ${PackMe.dye(this.items)})`;
	}
}

export const compilerTestMessageFactory = Object.freeze({
	511521838: () => new SendInfoMessage(),
	845589919: () => new GetDataRequest(),
	160528308: () => new GetDataResponse(),
});