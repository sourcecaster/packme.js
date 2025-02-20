import { PackMe, PackMeMessage } from 'packme';

/**
 * @enum {number}
 */
export const UserStatus = Object.freeze({
	active: 0,
	suspended: 1,
	deleted: 2,
})

export class UserProfile extends PackMeMessage {
	/** @type {!string} */ email;
	/** @type {!string} */ nickname;
	/** @type {?string} */ firstName;
	/** @type {?string} */ lastName;
	/** @type {?number} */ age;
	/** @type {?Date} */ birthDate;

	/**
	 * @param {!string} email
	 * @param {!string} nickname
	 * @param {?string} [firstName]
	 * @param {?string} [lastName]
	 * @param {?number} [age]
	 * @param {?Date} [birthDate]
	 */
	constructor (email, nickname, firstName, lastName, age, birthDate) {
		if (arguments.length === 0) return super();
		super();
		this.email = this.$ensure('email', email);
		this.nickname = this.$ensure('nickname', nickname);
		this.firstName = firstName;
		this.lastName = lastName;
		this.age = age;
		this.birthDate = birthDate;
	}

	$estimate() {
		this.$reset();
		let bytes = 1;
		bytes += this.$stringBytes(this.email);
		bytes += this.$stringBytes(this.nickname);
		this.$setFlag(this.firstName != null);
		if (this.firstName != null) bytes += this.$stringBytes(this.firstName);
		this.$setFlag(this.lastName != null);
		if (this.lastName != null) bytes += this.$stringBytes(this.lastName);
		this.$setFlag(this.age != null);
		if (this.age != null) bytes += 1;
		this.$setFlag(this.birthDate != null);
		if (this.birthDate != null) bytes += 8;
		return bytes;
	}

	$pack() {
		for (let i = 0; i < 1; i++) this.$packUint8(this.$flags[i]);
		this.$packString(this.email);
		this.$packString(this.nickname);
		if (this.firstName != null) this.$packString(this.firstName);
		if (this.lastName != null) this.$packString(this.lastName);
		if (this.age != null) this.$packUint8(this.age);
		if (this.birthDate != null) this.$packDateTime(this.birthDate);
	}

	$unpack() {
		for (let i = 0; i < 1; i++) this.$flags.push(this.$unpackUint8());
		this.email = this.$unpackString();
		this.nickname = this.$unpackString();
		if (this.$getFlag()) this.firstName = this.$unpackString();
		if (this.$getFlag()) this.lastName = this.$unpackString();
		if (this.$getFlag()) this.age = this.$unpackUint8();
		if (this.$getFlag()) this.birthDate = this.$unpackDateTime();
	}

	/** @returns {string} */
	toString() {
		return `UserProfile\x1b[0m(email: ${PackMe.dye(this.email)}, nickname: ${PackMe.dye(this.nickname)}, firstName: ${PackMe.dye(this.firstName)}, lastName: ${PackMe.dye(this.lastName)}, age: ${PackMe.dye(this.age)}, birthDate: ${PackMe.dye(this.birthDate)})`;
	}
}

export class UserSession extends PackMeMessage {
	/** @type {!Date} */ created;
	/** @type {!Date} */ updated;
	/** @type {!string} */ ip;
	/** @type {!boolean} */ active;

	/**
	 * @param {!Date} created
	 * @param {!Date} updated
	 * @param {!string} ip
	 * @param {!boolean} active
	 */
	constructor (created, updated, ip, active) {
		if (arguments.length === 0) return super();
		super();
		this.created = this.$ensure('created', created);
		this.updated = this.$ensure('updated', updated);
		this.ip = this.$ensure('ip', ip);
		this.active = this.$ensure('active', active);
	}

	$estimate() {
		this.$reset();
		let bytes = 17;
		bytes += this.$stringBytes(this.ip);
		return bytes;
	}

	$pack() {
		this.$packDateTime(this.created);
		this.$packDateTime(this.updated);
		this.$packString(this.ip);
		this.$packBool(this.active);
	}

	$unpack() {
		this.created = this.$unpackDateTime();
		this.updated = this.$unpackDateTime();
		this.ip = this.$unpackString();
		this.active = this.$unpackBool();
	}

	/** @returns {string} */
	toString() {
		return `UserSession\x1b[0m(created: ${PackMe.dye(this.created)}, updated: ${PackMe.dye(this.updated)}, ip: ${PackMe.dye(this.ip)}, active: ${PackMe.dye(this.active)})`;
	}
}