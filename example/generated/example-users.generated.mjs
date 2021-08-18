import {PackMe, PackMeMessage} from 'packme';
import {UserProfile, UserSession, UserStatus} from 'example-types.generated.mjs';

class GetUsersResponseUser extends PackMeMessage {
	/** @type {!number[]} */ id;
	/** @type {!UserProfile} */ profile;
	/** @type {!UserStatus} */ status;
	
	constructor(
		/** !number[] */ id,
		/** !UserProfile */ profile,
		/** !UserStatus */ status,
	) {
		super();
		if (arguments.length > 0) {
			this.$check('id', id);
			this.$check('profile', profile);
			this.$check('status', status);
		}
		this.id = id;
		this.profile = profile;
		this.status = status;
	}
	
	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 1;
		bytes += 4;
		bytes += 1 * this.id.length;
		bytes += this.profile.$estimate();
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		this.$packUint32(this.id.length);
		for (let item of this.id) this.$packUint8(item);
		this.$packMessage(this.profile);
		this.$packUint8(this.status);
	}

	/** @return {undefined} */
	$unpack() {
		this.id = [];
		let idLength = this.$unpackUint32();
		for (let i = 0; i < idLength; i++) {
			this.id.push(this.$unpackUint8());
		}
		this.profile = this.$unpackMessage(new UserProfile());
		this.status = this.$unpackUint8();
	}

	/** @return {string} */
	toString() {
		return `GetUsersResponseUser\x1b[0m(id: ${PackMe.dye(this.id)}, profile: ${PackMe.dye(this.profile)}, status: ${PackMe.dye(this.status)})`;
	}
}

class GetUsersResponse extends PackMeMessage {
	/** @type {!GetUsersResponseUser[]} */ users;
	
	constructor(
		/** !GetUsersResponseUser[] */ users,
	) {
		super();
		if (arguments.length > 0) {
			this.$check('users', users);
		}
		this.users = users;
	}
	
	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 8;
		bytes += 4;
		for (let i = 0; i < this.users.length; i++) bytes += this.users[i].$estimate();
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		this.$initPack(1070081631);
		this.$packUint32(this.users.length);
		for (let item of this.users) this.$packMessage(item);
	}

	/** @return {undefined} */
	$unpack() {
		this.$initUnpack();
		this.users = [];
		let usersLength = this.$unpackUint32();
		for (let i = 0; i < usersLength; i++) {
			this.users.push(this.$unpackMessage(new GetUsersResponseUser()));
		}
	}

	/** @return {string} */
	toString() {
		return `GetUsersResponse\x1b[0m(users: ${PackMe.dye(this.users)})`;
	}
}

class GetUsersRequest extends PackMeMessage {
	/** @type {?UserStatus} */ status;
	
	constructor(
		/** ?UserStatus */ status,
	) {
		super();
		if (arguments.length > 0) {
		}
		this.status = status;
	}
	
	/** @return {GetUsersResponse} */
	$response({
			/** !GetUsersResponseUser[] */ users,
	}) {
		let message = new GetUsersResponse(users);
		message.$request = this;
		return message;
	}

	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 9;
		this.$setFlag(this.status != null);
		if (this.status != null) {
			bytes += 1;
		}
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		this.$initPack(103027201);
		for (let i = 0; i < 1; i++) this.$packUint8(this.$flags[i]);
		if (this.status != null) this.$packUint8(this.status);
	}

	/** @return {undefined} */
	$unpack() {
		this.$initUnpack();
		for (let i = 0; i < 1; i++) this.$flags.push(this.$unpackUint8());
		if (this.$getFlag()) {
			this.status = this.$unpackUint8();
		}
	}

	/** @return {string} */
	toString() {
		return `GetUsersRequest\x1b[0m(status: ${PackMe.dye(this.status)})`;
	}
}

class GetUserResponseSocial extends PackMeMessage {
	/** @type {?string} */ facebookId;
	/** @type {?string} */ twitterId;
	/** @type {?string} */ instagramId;
	
	constructor(
		/** ?string */ facebookId,
		/** ?string */ twitterId,
		/** ?string */ instagramId,
	) {
		super();
		if (arguments.length > 0) {
		}
		this.facebookId = facebookId;
		this.twitterId = twitterId;
		this.instagramId = instagramId;
	}
	
	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 1;
		this.$setFlag(this.facebookId != null);
		if (this.facebookId != null) {
			bytes += this.$stringBytes(this.facebookId);
		}
		this.$setFlag(this.twitterId != null);
		if (this.twitterId != null) {
			bytes += this.$stringBytes(this.twitterId);
		}
		this.$setFlag(this.instagramId != null);
		if (this.instagramId != null) {
			bytes += this.$stringBytes(this.instagramId);
		}
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		for (let i = 0; i < 1; i++) this.$packUint8(this.$flags[i]);
		if (this.facebookId != null) this.$packString(this.facebookId);
		if (this.twitterId != null) this.$packString(this.twitterId);
		if (this.instagramId != null) this.$packString(this.instagramId);
	}

	/** @return {undefined} */
	$unpack() {
		for (let i = 0; i < 1; i++) this.$flags.push(this.$unpackUint8());
		if (this.$getFlag()) {
			this.facebookId = this.$unpackString();
		}
		if (this.$getFlag()) {
			this.twitterId = this.$unpackString();
		}
		if (this.$getFlag()) {
			this.instagramId = this.$unpackString();
		}
	}

	/** @return {string} */
	toString() {
		return `GetUserResponseSocial\x1b[0m(facebookId: ${PackMe.dye(this.facebookId)}, twitterId: ${PackMe.dye(this.twitterId)}, instagramId: ${PackMe.dye(this.instagramId)})`;
	}
}

class GetUserResponse extends PackMeMessage {
	/** @type {!UserProfile} */ profile;
	/** @type {!Date} */ created;
	/** @type {!UserSession[]} */ sessions;
	/** @type {?GetUserResponseSocial} */ social;
	
	constructor(
		/** !UserProfile */ profile,
		/** !Date */ created,
		/** !UserSession[] */ sessions,
		/** ?GetUserResponseSocial */ social,
	) {
		super();
		if (arguments.length > 0) {
			this.$check('profile', profile);
			this.$check('created', created);
			this.$check('sessions', sessions);
		}
		this.profile = profile;
		this.created = created;
		this.sessions = sessions;
		this.social = social;
	}
	
	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 17;
		bytes += this.profile.$estimate();
		bytes += 4;
		for (let i = 0; i < this.sessions.length; i++) bytes += this.sessions[i].$estimate();
		this.$setFlag(this.social != null);
		if (this.social != null) {
			bytes += this.social.$estimate();
		}
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		this.$initPack(164269114);
		for (let i = 0; i < 1; i++) this.$packUint8(this.$flags[i]);
		this.$packMessage(this.profile);
		this.$packDateTime(this.created);
		this.$packUint32(this.sessions.length);
		for (let item of this.sessions) this.$packMessage(item);
		if (this.social != null) this.$packMessage(this.social);
	}

	/** @return {undefined} */
	$unpack() {
		this.$initUnpack();
		for (let i = 0; i < 1; i++) this.$flags.push(this.$unpackUint8());
		this.profile = this.$unpackMessage(new UserProfile());
		this.created = this.$unpackDateTime();
		this.sessions = [];
		let sessionsLength = this.$unpackUint32();
		for (let i = 0; i < sessionsLength; i++) {
			this.sessions.push(this.$unpackMessage(new UserSession()));
		}
		if (this.$getFlag()) {
			this.social = this.$unpackMessage(new GetUserResponseSocial());
		}
	}

	/** @return {string} */
	toString() {
		return `GetUserResponse\x1b[0m(profile: ${PackMe.dye(this.profile)}, created: ${PackMe.dye(this.created)}, sessions: ${PackMe.dye(this.sessions)}, social: ${PackMe.dye(this.social)})`;
	}
}

class GetUserRequest extends PackMeMessage {
	/** @type {!number[]} */ userId;
	
	constructor(
		/** !number[] */ userId,
	) {
		super();
		if (arguments.length > 0) {
			this.$check('userId', userId);
		}
		this.userId = userId;
	}
	
	/** @return {GetUserResponse} */
	$response({
			/** !UserProfile */ profile,
			/** !Date */ created,
			/** !UserSession[] */ sessions,
			/** ?GetUserResponseSocial */ social,
	}) {
		let message = new GetUserResponse(profile, created, sessions, social);
		message.$request = this;
		return message;
	}

	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 8;
		bytes += 4;
		bytes += 1 * this.userId.length;
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		this.$initPack(711286423);
		this.$packUint32(this.userId.length);
		for (let item of this.userId) this.$packUint8(item);
	}

	/** @return {undefined} */
	$unpack() {
		this.$initUnpack();
		this.userId = [];
		let userIdLength = this.$unpackUint32();
		for (let i = 0; i < userIdLength; i++) {
			this.userId.push(this.$unpackUint8());
		}
	}

	/** @return {string} */
	toString() {
		return `GetUserRequest\x1b[0m(userId: ${PackMe.dye(this.userId)})`;
	}
}

class DeleteUserResponse extends PackMeMessage {
	/** @type {?string} */ error;
	
	constructor(
		/** ?string */ error,
	) {
		super();
		if (arguments.length > 0) {
		}
		this.error = error;
	}
	
	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 9;
		this.$setFlag(this.error != null);
		if (this.error != null) {
			bytes += this.$stringBytes(this.error);
		}
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		this.$initPack(196281846);
		for (let i = 0; i < 1; i++) this.$packUint8(this.$flags[i]);
		if (this.error != null) this.$packString(this.error);
	}

	/** @return {undefined} */
	$unpack() {
		this.$initUnpack();
		for (let i = 0; i < 1; i++) this.$flags.push(this.$unpackUint8());
		if (this.$getFlag()) {
			this.error = this.$unpackString();
		}
	}

	/** @return {string} */
	toString() {
		return `DeleteUserResponse\x1b[0m(error: ${PackMe.dye(this.error)})`;
	}
}

class DeleteUserRequest extends PackMeMessage {
	/** @type {!number[]} */ userId;
	
	constructor(
		/** !number[] */ userId,
	) {
		super();
		if (arguments.length > 0) {
			this.$check('userId', userId);
		}
		this.userId = userId;
	}
	
	/** @return {DeleteUserResponse} */
	$response({
			/** ?string */ error,
	}) {
		let message = new DeleteUserResponse(error);
		message.$request = this;
		return message;
	}

	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 8;
		bytes += 4;
		bytes += 1 * this.userId.length;
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		this.$initPack(117530906);
		this.$packUint32(this.userId.length);
		for (let item of this.userId) this.$packUint8(item);
	}

	/** @return {undefined} */
	$unpack() {
		this.$initUnpack();
		this.userId = [];
		let userIdLength = this.$unpackUint32();
		for (let i = 0; i < userIdLength; i++) {
			this.userId.push(this.$unpackUint8());
		}
	}

	/** @return {string} */
	toString() {
		return `DeleteUserRequest\x1b[0m(userId: ${PackMe.dye(this.userId)})`;
	}
}

const exampleUsersMessageFactory = {
	'1070081631': () => new GetUsersResponse(),
	'103027201': () => new GetUsersRequest(),
	'164269114': () => new GetUserResponse(),
	'711286423': () => new GetUserRequest(),
	'196281846': () => new DeleteUserResponse(),
	'117530906': () => new DeleteUserRequest(),
};

export {GetUsersResponse, GetUsersRequest, GetUserResponse, GetUserRequest, DeleteUserResponse, DeleteUserRequest, exampleUsersMessageFactory};