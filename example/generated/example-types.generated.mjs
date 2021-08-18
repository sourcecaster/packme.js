import {PackMe, PackMeMessage} from 'packme';

/** @enum {number} */
const UserStatus = {
	active: 0,
	suspended: 1,
	deleted: 2,
};

class UserProfile extends PackMeMessage {
	/** @type {!string} */ email;
	/** @type {!string} */ nickname;
	/** @type {?string} */ firstName;
	/** @type {?string} */ lastName;
	/** @type {?number} */ age;
	/** @type {?Date} */ birthDate;
	
	constructor(
		/** !string */ email,
		/** !string */ nickname,
		/** ?string */ firstName,
		/** ?string */ lastName,
		/** ?number */ age,
		/** ?Date */ birthDate,
	) {
		super();
		if (arguments.length > 0) {
			this.$check('email', email);
			this.$check('nickname', nickname);
		}
		this.email = email;
		this.nickname = nickname;
		this.firstName = firstName;
		this.lastName = lastName;
		this.age = age;
		this.birthDate = birthDate;
	}
	
	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 1;
		bytes += this.$stringBytes(this.email);
		bytes += this.$stringBytes(this.nickname);
		this.$setFlag(this.firstName != null);
		if (this.firstName != null) {
			bytes += this.$stringBytes(this.firstName);
		}
		this.$setFlag(this.lastName != null);
		if (this.lastName != null) {
			bytes += this.$stringBytes(this.lastName);
		}
		this.$setFlag(this.age != null);
		if (this.age != null) {
			bytes += 1;
		}
		this.$setFlag(this.birthDate != null);
		if (this.birthDate != null) {
			bytes += 8;
		}
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		for (let i = 0; i < 1; i++) this.$packUint8(this.$flags[i]);
		this.$packString(this.email);
		this.$packString(this.nickname);
		if (this.firstName != null) this.$packString(this.firstName);
		if (this.lastName != null) this.$packString(this.lastName);
		if (this.age != null) this.$packUint8(this.age);
		if (this.birthDate != null) this.$packDateTime(this.birthDate);
	}

	/** @return {undefined} */
	$unpack() {
		for (let i = 0; i < 1; i++) this.$flags.push(this.$unpackUint8());
		this.email = this.$unpackString();
		this.nickname = this.$unpackString();
		if (this.$getFlag()) {
			this.firstName = this.$unpackString();
		}
		if (this.$getFlag()) {
			this.lastName = this.$unpackString();
		}
		if (this.$getFlag()) {
			this.age = this.$unpackUint8();
		}
		if (this.$getFlag()) {
			this.birthDate = this.$unpackDateTime();
		}
	}

	/** @return {string} */
	toString() {
		return `UserProfile\x1b[0m(email: ${PackMe.dye(this.email)}, nickname: ${PackMe.dye(this.nickname)}, firstName: ${PackMe.dye(this.firstName)}, lastName: ${PackMe.dye(this.lastName)}, age: ${PackMe.dye(this.age)}, birthDate: ${PackMe.dye(this.birthDate)})`;
	}
}

class UserSession extends PackMeMessage {
	/** @type {!Date} */ created;
	/** @type {!Date} */ updated;
	/** @type {!string} */ ip;
	/** @type {!boolean} */ active;
	
	constructor(
		/** !Date */ created,
		/** !Date */ updated,
		/** !string */ ip,
		/** !boolean */ active,
	) {
		super();
		if (arguments.length > 0) {
			this.$check('created', created);
			this.$check('updated', updated);
			this.$check('ip', ip);
			this.$check('active', active);
		}
		this.created = created;
		this.updated = updated;
		this.ip = ip;
		this.active = active;
	}
	
	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 17;
		bytes += this.$stringBytes(this.ip);
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		this.$packDateTime(this.created);
		this.$packDateTime(this.updated);
		this.$packString(this.ip);
		this.$packBool(this.active);
	}

	/** @return {undefined} */
	$unpack() {
		this.created = this.$unpackDateTime();
		this.updated = this.$unpackDateTime();
		this.ip = this.$unpackString();
		this.active = this.$unpackBool();
	}

	/** @return {string} */
	toString() {
		return `UserSession\x1b[0m(created: ${PackMe.dye(this.created)}, updated: ${PackMe.dye(this.updated)}, ip: ${PackMe.dye(this.ip)}, active: ${PackMe.dye(this.active)})`;
	}
}


export {UserStatus, UserProfile, UserSession};