import { PackMe, PackMeMessage } from 'packme';
import { UserProfile, UserSession, UserStatus } from './example-types.generated.js';

export class GetUserResponseSocial extends PackMeMessage {
	/** @type {?string} */ facebookId;
	/** @type {?string} */ twitterId;
	/** @type {?string} */ instagramId;

	/**
	 * @param {?string} [facebookId]
	 * @param {?string} [twitterId]
	 * @param {?string} [instagramId]
	 */
	constructor (facebookId, twitterId, instagramId) {
		if (arguments.length === 0) return super();
		super();
		this.facebookId = facebookId;
		this.twitterId = twitterId;
		this.instagramId = instagramId;
	}

	$estimate() {
		this.$reset();
		let bytes = 1;
		this.$setFlag(this.facebookId != null);
		if (this.facebookId != null) bytes += this.$stringBytes(this.facebookId);
		this.$setFlag(this.twitterId != null);
		if (this.twitterId != null) bytes += this.$stringBytes(this.twitterId);
		this.$setFlag(this.instagramId != null);
		if (this.instagramId != null) bytes += this.$stringBytes(this.instagramId);
		return bytes;
	}

	$pack() {
		for (let i = 0; i < 1; i++) this.$packUint8(this.$flags[i]);
		if (this.facebookId != null) this.$packString(this.facebookId);
		if (this.twitterId != null) this.$packString(this.twitterId);
		if (this.instagramId != null) this.$packString(this.instagramId);
	}

	$unpack() {
		for (let i = 0; i < 1; i++) this.$flags.push(this.$unpackUint8());
		if (this.$getFlag()) this.facebookId = this.$unpackString();
		if (this.$getFlag()) this.twitterId = this.$unpackString();
		if (this.$getFlag()) this.instagramId = this.$unpackString();
	}

	/** @returns {string} */
	toString() {
		return `GetUserResponseSocial\x1b[0m(facebookId: ${PackMe.dye(this.facebookId)}, twitterId: ${PackMe.dye(this.twitterId)}, instagramId: ${PackMe.dye(this.instagramId)})`;
	}
}

export class GetUsersResponseUser extends PackMeMessage {
	/** @type {!number[]} */ id;
	/** @type {!UserProfile} */ profile;
	/** @type {!UserStatus} */ status;

	/**
	 * @param {!number[]} id
	 * @param {!UserProfile} profile
	 * @param {!UserStatus} status
	 */
	constructor (id, profile, status) {
		if (arguments.length === 0) return super();
		super();
		this.id = this.$ensure('id', id);
		this.profile = this.$ensure('profile', profile);
		this.status = this.$ensure('status', status);
	}

	$estimate() {
		this.$reset();
		let bytes = 1;
		bytes += 4 + this.id.length * 1;
		bytes += this.profile.$estimate();
		return bytes;
	}

	$pack() {
		this.$packUint32(this.id.length);
		for (let i2 = 0; i2 < this.id.length; i2++) {
			this.$packUint8(this.id[i2]);
		}
		this.$packMessage(this.profile);
		this.$packUint8(this.status);
	}

	$unpack() {
		this.id = Array.from({ length: this.$unpackUint32() }, () => {
			return this.$unpackUint8();
		})
		this.profile = this.$unpackMessage(new UserProfile());
		this.status = this.$unpackUint8();
	}

	/** @returns {string} */
	toString() {
		return `GetUsersResponseUser\x1b[0m(id: ${PackMe.dye(this.id)}, profile: ${PackMe.dye(this.profile)}, status: ${PackMe.dye(this.status)})`;
	}
}

export class GetUsersRequest extends PackMeMessage {
	/** @type {?UserStatus} */ status;

	/**
	 * @param {?UserStatus} [status]
	 */
	constructor (status) {
		if (arguments.length === 0) return super();
		super();
		this.status = status;
	}

	/**
	 * @param {!GetUsersResponseUser[]} users
	 * @returns {GetUsersResponse}
	 */
	$response(users) {
		let message = new GetUsersResponse(users);
		message.$request = this;
		return message;
	}

	$estimate() {
		this.$reset();
		let bytes = 9;
		this.$setFlag(this.status != null);
		if (this.status != null) bytes += 1;
		return bytes;
	}

	$pack() {
		this.$initPack(103027201);
		for (let i = 0; i < 1; i++) this.$packUint8(this.$flags[i]);
		if (this.status != null) this.$packUint8(this.status);
	}

	$unpack() {
		this.$initUnpack();
		for (let i = 0; i < 1; i++) this.$flags.push(this.$unpackUint8());
		if (this.$getFlag()) this.status = this.$unpackUint8();
	}

	/** @returns {string} */
	toString() {
		return `GetUsersRequest\x1b[0m(status: ${PackMe.dye(this.status)})`;
	}
}

export class GetUsersResponse extends PackMeMessage {
	/** @type {!GetUsersResponseUser[]} */ users;

	/**
	 * @param {!GetUsersResponseUser[]} users
	 */
	constructor (users) {
		if (arguments.length === 0) return super();
		super();
		this.users = this.$ensure('users', users);
	}

	$estimate() {
		this.$reset();
		let bytes = 8;
		bytes += 4 + this.users.reduce((a, b) => a + b.$estimate(), 0);
		return bytes;
	}

	$pack() {
		this.$initPack(1070081631);
		this.$packUint32(this.users.length);
		for (let i5 = 0; i5 < this.users.length; i5++) {
			this.$packMessage(this.users[i5]);
		}
	}

	$unpack() {
		this.$initUnpack();
		this.users = Array.from({ length: this.$unpackUint32() }, () => {
			return this.$unpackMessage(new GetUsersResponseUser());
		})
	}

	/** @returns {string} */
	toString() {
		return `GetUsersResponse\x1b[0m(users: ${PackMe.dye(this.users)})`;
	}
}

export class GetUserRequest extends PackMeMessage {
	/** @type {!number[]} */ userId;

	/**
	 * @param {!number[]} userId
	 */
	constructor (userId) {
		if (arguments.length === 0) return super();
		super();
		this.userId = this.$ensure('userId', userId);
	}

	/**
	 * @param {!UserProfile} profile
	 * @param {!Date} created
	 * @param {!UserSession[]} sessions
	 * @param {?GetUserResponseSocial} [social]
	 * @returns {GetUserResponse}
	 */
	$response(profile, created, sessions, social) {
		let message = new GetUserResponse(profile, created, sessions, social);
		message.$request = this;
		return message;
	}

	$estimate() {
		this.$reset();
		let bytes = 8;
		bytes += 4 + this.userId.length * 1;
		return bytes;
	}

	$pack() {
		this.$initPack(711286423);
		this.$packUint32(this.userId.length);
		for (let i6 = 0; i6 < this.userId.length; i6++) {
			this.$packUint8(this.userId[i6]);
		}
	}

	$unpack() {
		this.$initUnpack();
		this.userId = Array.from({ length: this.$unpackUint32() }, () => {
			return this.$unpackUint8();
		})
	}

	/** @returns {string} */
	toString() {
		return `GetUserRequest\x1b[0m(userId: ${PackMe.dye(this.userId)})`;
	}
}

export class GetUserResponse extends PackMeMessage {
	/** @type {!UserProfile} */ profile;
	/** @type {!Date} */ created;
	/** @type {!UserSession[]} */ sessions;
	/** @type {?GetUserResponseSocial} */ social;

	/**
	 * @param {!UserProfile} profile
	 * @param {!Date} created
	 * @param {!UserSession[]} sessions
	 * @param {?GetUserResponseSocial} [social]
	 */
	constructor (profile, created, sessions, social) {
		if (arguments.length === 0) return super();
		super();
		this.profile = this.$ensure('profile', profile);
		this.created = this.$ensure('created', created);
		this.sessions = this.$ensure('sessions', sessions);
		this.social = social;
	}

	$estimate() {
		this.$reset();
		let bytes = 17;
		bytes += this.profile.$estimate();
		bytes += 4 + this.sessions.reduce((a, b) => a + b.$estimate(), 0);
		this.$setFlag(this.social != null);
		if (this.social != null) bytes += this.social.$estimate();
		return bytes;
	}

	$pack() {
		this.$initPack(164269114);
		for (let i = 0; i < 1; i++) this.$packUint8(this.$flags[i]);
		this.$packMessage(this.profile);
		this.$packDateTime(this.created);
		this.$packUint32(this.sessions.length);
		for (let i8 = 0; i8 < this.sessions.length; i8++) {
			this.$packMessage(this.sessions[i8]);
		}
		if (this.social != null) this.$packMessage(this.social);
	}

	$unpack() {
		this.$initUnpack();
		for (let i = 0; i < 1; i++) this.$flags.push(this.$unpackUint8());
		this.profile = this.$unpackMessage(new UserProfile());
		this.created = this.$unpackDateTime();
		this.sessions = Array.from({ length: this.$unpackUint32() }, () => {
			return this.$unpackMessage(new UserSession());
		})
		if (this.$getFlag()) this.social = this.$unpackMessage(new GetUserResponseSocial());
	}

	/** @returns {string} */
	toString() {
		return `GetUserResponse\x1b[0m(profile: ${PackMe.dye(this.profile)}, created: ${PackMe.dye(this.created)}, sessions: ${PackMe.dye(this.sessions)}, social: ${PackMe.dye(this.social)})`;
	}
}

export class DeleteUserRequest extends PackMeMessage {
	/** @type {!number[]} */ userId;

	/**
	 * @param {!number[]} userId
	 */
	constructor (userId) {
		if (arguments.length === 0) return super();
		super();
		this.userId = this.$ensure('userId', userId);
	}

	/**
	 * @param {?string} [error]
	 * @returns {DeleteUserResponse}
	 */
	$response(error) {
		let message = new DeleteUserResponse(error);
		message.$request = this;
		return message;
	}

	$estimate() {
		this.$reset();
		let bytes = 8;
		bytes += 4 + this.userId.length * 1;
		return bytes;
	}

	$pack() {
		this.$initPack(117530906);
		this.$packUint32(this.userId.length);
		for (let i6 = 0; i6 < this.userId.length; i6++) {
			this.$packUint8(this.userId[i6]);
		}
	}

	$unpack() {
		this.$initUnpack();
		this.userId = Array.from({ length: this.$unpackUint32() }, () => {
			return this.$unpackUint8();
		})
	}

	/** @returns {string} */
	toString() {
		return `DeleteUserRequest\x1b[0m(userId: ${PackMe.dye(this.userId)})`;
	}
}

export class DeleteUserResponse extends PackMeMessage {
	/** @type {?string} */ error;

	/**
	 * @param {?string} [error]
	 */
	constructor (error) {
		if (arguments.length === 0) return super();
		super();
		this.error = error;
	}

	$estimate() {
		this.$reset();
		let bytes = 9;
		this.$setFlag(this.error != null);
		if (this.error != null) bytes += this.$stringBytes(this.error);
		return bytes;
	}

	$pack() {
		this.$initPack(196281846);
		for (let i = 0; i < 1; i++) this.$packUint8(this.$flags[i]);
		if (this.error != null) this.$packString(this.error);
	}

	$unpack() {
		this.$initUnpack();
		for (let i = 0; i < 1; i++) this.$flags.push(this.$unpackUint8());
		if (this.$getFlag()) this.error = this.$unpackString();
	}

	/** @returns {string} */
	toString() {
		return `DeleteUserResponse\x1b[0m(error: ${PackMe.dye(this.error)})`;
	}
}

export const exampleUsersMessageFactory = Object.freeze({
	103027201: () => new GetUsersRequest(),
	711286423: () => new GetUserRequest(),
	117530906: () => new DeleteUserRequest(),
	1070081631: () => new GetUsersResponse(),
	164269114: () => new GetUserResponse(),
	196281846: () => new DeleteUserResponse(),
});