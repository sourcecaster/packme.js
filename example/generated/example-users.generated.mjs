import {PackMe, PackMeMessage} from 'packme';

class GetAllResponseUser extends PackMeMessage {
	/** @type {!number[]} */ id;
	/** @type {!string} */ nickname;
	/** @type {?string} */ firstName;
	/** @type {?string} */ lastName;
	/** @type {?number} */ age;
	
	constructor(
		/** !number[] */ id,
		/** !string */ nickname,
		/** ?string */ firstName,
		/** ?string */ lastName,
		/** ?number */ age,
	) {
		super();
		this.$check('id', id);
		this.$check('nickname', nickname);
		this.id = id;
		this.nickname = nickname;
		this.firstName = firstName;
		this.lastName = lastName;
		this.age = age;
	}
	
	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 1;
		bytes += 4;
		bytes += 1 * this.id.length;
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
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		for (let i = 0; i < 1; i++) this.$packUint8(this.$flags[i]);
		this.$packUint32(this.id.length);
		for (let item of this.id) this.$packUint8(item);
		this.$packString(this.nickname);
		if (this.firstName != null) this.$packString(this.firstName);
		if (this.lastName != null) this.$packString(this.lastName);
		if (this.age != null) this.$packUint8(this.age);
	}

	/** @return {undefined} */
	$unpack() {
		for (let i = 0; i < 1; i++) this.$flags.push(this.$unpackUint8());
		this.id = [];
		let idLength = this.$unpackUint32();
		for (let i = 0; i < idLength; i++) {
			this.id.push(this.$unpackUint8());
		}
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
	}

	/** @return {string} */
	toString() {
		return `GetAllResponseUser\x1b[0m(id: ${PackMe.dye(this.id)}, nickname: ${PackMe.dye(this.nickname)}, firstName: ${PackMe.dye(this.firstName)}, lastName: ${PackMe.dye(this.lastName)}, age: ${PackMe.dye(this.age)})`;
	}
}

class GetAllResponse extends PackMeMessage {
	/** @type {!GetAllResponseUser[]} */ users;
	
	constructor(
		/** !GetAllResponseUser[] */ users,
	) {
		super();
		this.$check('users', users);
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
		this.$initPack(242206268);
		this.$packUint32(this.users.length);
		for (let item of this.users) this.$packMessage(item);
	}

	/** @return {undefined} */
	$unpack() {
		this.$initUnpack();
		this.users = [];
		let usersLength = this.$unpackUint32();
		for (let i = 0; i < usersLength; i++) {
			this.users.push(this.$unpackMessage(new GetAllResponseUser()));
		}
	}

	/** @return {string} */
	toString() {
		return `GetAllResponse\x1b[0m(users: ${PackMe.dye(this.users)})`;
	}
}

class GetAllRequest extends PackMeMessage {
	
	constructor() {
		super();
	}
	
	/** @return {GetAllResponse} */
	$response({
			/** !GetAllResponseUser[] */ users,
	}) {
		let message = new GetAllResponse(users);
		message.$request = this;
		return message;
	}

	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 8;
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		this.$initPack(12982278);
	}

	/** @return {undefined} */
	$unpack() {
		this.$initUnpack();
	}

	/** @return {string} */
	toString() {
		return `GetAllRequest\x1b[0m()`;
	}
}

class GetResponseInfo extends PackMeMessage {
	/** @type {?string} */ firstName;
	/** @type {?string} */ lastName;
	/** @type {?number} */ male;
	/** @type {?number} */ age;
	/** @type {?Date} */ birthDate;
	
	constructor(
		/** ?string */ firstName,
		/** ?string */ lastName,
		/** ?number */ male,
		/** ?number */ age,
		/** ?Date */ birthDate,
	) {
		super();
		this.firstName = firstName;
		this.lastName = lastName;
		this.male = male;
		this.age = age;
		this.birthDate = birthDate;
	}
	
	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 1;
		this.$setFlag(this.firstName != null);
		if (this.firstName != null) {
			bytes += this.$stringBytes(this.firstName);
		}
		this.$setFlag(this.lastName != null);
		if (this.lastName != null) {
			bytes += this.$stringBytes(this.lastName);
		}
		this.$setFlag(this.male != null);
		if (this.male != null) {
			bytes += 1;
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
		if (this.firstName != null) this.$packString(this.firstName);
		if (this.lastName != null) this.$packString(this.lastName);
		if (this.male != null) this.$packUint8(this.male);
		if (this.age != null) this.$packUint8(this.age);
		if (this.birthDate != null) this.$packDateTime(this.birthDate);
	}

	/** @return {undefined} */
	$unpack() {
		for (let i = 0; i < 1; i++) this.$flags.push(this.$unpackUint8());
		if (this.$getFlag()) {
			this.firstName = this.$unpackString();
		}
		if (this.$getFlag()) {
			this.lastName = this.$unpackString();
		}
		if (this.$getFlag()) {
			this.male = this.$unpackUint8();
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
		return `GetResponseInfo\x1b[0m(firstName: ${PackMe.dye(this.firstName)}, lastName: ${PackMe.dye(this.lastName)}, male: ${PackMe.dye(this.male)}, age: ${PackMe.dye(this.age)}, birthDate: ${PackMe.dye(this.birthDate)})`;
	}
}

class GetResponseSocial extends PackMeMessage {
	/** @type {?string} */ facebookId;
	/** @type {?string} */ twitterId;
	/** @type {?string} */ instagramId;
	
	constructor(
		/** ?string */ facebookId,
		/** ?string */ twitterId,
		/** ?string */ instagramId,
	) {
		super();
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
		return `GetResponseSocial\x1b[0m(facebookId: ${PackMe.dye(this.facebookId)}, twitterId: ${PackMe.dye(this.twitterId)}, instagramId: ${PackMe.dye(this.instagramId)})`;
	}
}

class GetResponseStats extends PackMeMessage {
	/** @type {!number} */ posts;
	/** @type {!number} */ comments;
	/** @type {!number} */ likes;
	/** @type {!number} */ dislikes;
	/** @type {!number} */ rating;
	
	constructor(
		/** !number */ posts,
		/** !number */ comments,
		/** !number */ likes,
		/** !number */ dislikes,
		/** !number */ rating,
	) {
		super();
		this.$check('posts', posts);
		this.$check('comments', comments);
		this.$check('likes', likes);
		this.$check('dislikes', dislikes);
		this.$check('rating', rating);
		this.posts = posts;
		this.comments = comments;
		this.likes = likes;
		this.dislikes = dislikes;
		this.rating = rating;
	}
	
	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 20;
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		this.$packUint32(this.posts);
		this.$packUint32(this.comments);
		this.$packUint32(this.likes);
		this.$packUint32(this.dislikes);
		this.$packFloat(this.rating);
	}

	/** @return {undefined} */
	$unpack() {
		this.posts = this.$unpackUint32();
		this.comments = this.$unpackUint32();
		this.likes = this.$unpackUint32();
		this.dislikes = this.$unpackUint32();
		this.rating = this.$unpackFloat();
	}

	/** @return {string} */
	toString() {
		return `GetResponseStats\x1b[0m(posts: ${PackMe.dye(this.posts)}, comments: ${PackMe.dye(this.comments)}, likes: ${PackMe.dye(this.likes)}, dislikes: ${PackMe.dye(this.dislikes)}, rating: ${PackMe.dye(this.rating)})`;
	}
}

class GetResponseLastActive extends PackMeMessage {
	/** @type {!Date} */ datetime;
	/** @type {!string} */ ip;
	
	constructor(
		/** !Date */ datetime,
		/** !string */ ip,
	) {
		super();
		this.$check('datetime', datetime);
		this.$check('ip', ip);
		this.datetime = datetime;
		this.ip = ip;
	}
	
	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 8;
		bytes += this.$stringBytes(this.ip);
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		this.$packDateTime(this.datetime);
		this.$packString(this.ip);
	}

	/** @return {undefined} */
	$unpack() {
		this.datetime = this.$unpackDateTime();
		this.ip = this.$unpackString();
	}

	/** @return {string} */
	toString() {
		return `GetResponseLastActive\x1b[0m(datetime: ${PackMe.dye(this.datetime)}, ip: ${PackMe.dye(this.ip)})`;
	}
}

class GetResponseSession extends PackMeMessage {
	/** @type {!Date} */ created;
	/** @type {!string} */ ip;
	/** @type {!boolean} */ active;
	
	constructor(
		/** !Date */ created,
		/** !string */ ip,
		/** !boolean */ active,
	) {
		super();
		this.$check('created', created);
		this.$check('ip', ip);
		this.$check('active', active);
		this.created = created;
		this.ip = ip;
		this.active = active;
	}
	
	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 9;
		bytes += this.$stringBytes(this.ip);
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		this.$packDateTime(this.created);
		this.$packString(this.ip);
		this.$packBool(this.active);
	}

	/** @return {undefined} */
	$unpack() {
		this.created = this.$unpackDateTime();
		this.ip = this.$unpackString();
		this.active = this.$unpackBool();
	}

	/** @return {string} */
	toString() {
		return `GetResponseSession\x1b[0m(created: ${PackMe.dye(this.created)}, ip: ${PackMe.dye(this.ip)}, active: ${PackMe.dye(this.active)})`;
	}
}

class GetResponse extends PackMeMessage {
	/** @type {!string} */ email;
	/** @type {!string} */ nickname;
	/** @type {!boolean} */ hidden;
	/** @type {!Date} */ created;
	/** @type {!GetResponseInfo} */ info;
	/** @type {!GetResponseSocial} */ social;
	/** @type {!GetResponseStats} */ stats;
	/** @type {?GetResponseLastActive} */ lastActive;
	/** @type {!GetResponseSession[]} */ sessions;
	
	constructor(
		/** !string */ email,
		/** !string */ nickname,
		/** !boolean */ hidden,
		/** !Date */ created,
		/** !GetResponseInfo */ info,
		/** !GetResponseSocial */ social,
		/** !GetResponseStats */ stats,
		/** ?GetResponseLastActive */ lastActive,
		/** !GetResponseSession[] */ sessions,
	) {
		super();
		this.$check('email', email);
		this.$check('nickname', nickname);
		this.$check('hidden', hidden);
		this.$check('created', created);
		this.$check('info', info);
		this.$check('social', social);
		this.$check('stats', stats);
		this.$check('sessions', sessions);
		this.email = email;
		this.nickname = nickname;
		this.hidden = hidden;
		this.created = created;
		this.info = info;
		this.social = social;
		this.stats = stats;
		this.lastActive = lastActive;
		this.sessions = sessions;
	}
	
	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 18;
		bytes += this.$stringBytes(this.email);
		bytes += this.$stringBytes(this.nickname);
		bytes += this.info.$estimate();
		bytes += this.social.$estimate();
		bytes += this.stats.$estimate();
		this.$setFlag(this.lastActive != null);
		if (this.lastActive != null) {
			bytes += this.lastActive.$estimate();
		}
		bytes += 4;
		for (let i = 0; i < this.sessions.length; i++) bytes += this.sessions[i].$estimate();
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		this.$initPack(430536944);
		for (let i = 0; i < 1; i++) this.$packUint8(this.$flags[i]);
		this.$packString(this.email);
		this.$packString(this.nickname);
		this.$packBool(this.hidden);
		this.$packDateTime(this.created);
		this.$packMessage(this.info);
		this.$packMessage(this.social);
		this.$packMessage(this.stats);
		if (this.lastActive != null) this.$packMessage(this.lastActive);
		this.$packUint32(this.sessions.length);
		for (let item of this.sessions) this.$packMessage(item);
	}

	/** @return {undefined} */
	$unpack() {
		this.$initUnpack();
		for (let i = 0; i < 1; i++) this.$flags.push(this.$unpackUint8());
		this.email = this.$unpackString();
		this.nickname = this.$unpackString();
		this.hidden = this.$unpackBool();
		this.created = this.$unpackDateTime();
		this.info = this.$unpackMessage(new GetResponseInfo());
		this.social = this.$unpackMessage(new GetResponseSocial());
		this.stats = this.$unpackMessage(new GetResponseStats());
		if (this.$getFlag()) {
			this.lastActive = this.$unpackMessage(new GetResponseLastActive());
		}
		this.sessions = [];
		let sessionsLength = this.$unpackUint32();
		for (let i = 0; i < sessionsLength; i++) {
			this.sessions.push(this.$unpackMessage(new GetResponseSession()));
		}
	}

	/** @return {string} */
	toString() {
		return `GetResponse\x1b[0m(email: ${PackMe.dye(this.email)}, nickname: ${PackMe.dye(this.nickname)}, hidden: ${PackMe.dye(this.hidden)}, created: ${PackMe.dye(this.created)}, info: ${PackMe.dye(this.info)}, social: ${PackMe.dye(this.social)}, stats: ${PackMe.dye(this.stats)}, lastActive: ${PackMe.dye(this.lastActive)}, sessions: ${PackMe.dye(this.sessions)})`;
	}
}

class GetRequest extends PackMeMessage {
	/** @type {!number[]} */ userId;
	
	constructor(
		/** !number[] */ userId,
	) {
		super();
		this.$check('userId', userId);
		this.userId = userId;
	}
	
	/** @return {GetResponse} */
	$response({
			/** !string */ email,
			/** !string */ nickname,
			/** !boolean */ hidden,
			/** !Date */ created,
			/** !GetResponseInfo */ info,
			/** !GetResponseSocial */ social,
			/** !GetResponseStats */ stats,
			/** ?GetResponseLastActive */ lastActive,
			/** !GetResponseSession[] */ sessions,
	}) {
		let message = new GetResponse(email, nickname, hidden, created, info, social, stats, lastActive, sessions);
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
		this.$initPack(781905656);
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
		return `GetRequest\x1b[0m(userId: ${PackMe.dye(this.userId)})`;
	}
}

class DeleteResponse extends PackMeMessage {
	/** @type {?string} */ error;
	
	constructor(
		/** ?string */ error,
	) {
		super();
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
		this.$initPack(69897231);
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
		return `DeleteResponse\x1b[0m(error: ${PackMe.dye(this.error)})`;
	}
}

class DeleteRequest extends PackMeMessage {
	/** @type {!number[]} */ userId;
	
	constructor(
		/** !number[] */ userId,
	) {
		super();
		this.$check('userId', userId);
		this.userId = userId;
	}
	
	/** @return {DeleteResponse} */
	$response({
			/** ?string */ error,
	}) {
		let message = new DeleteResponse(error);
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
		this.$initPack(808423104);
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
		return `DeleteRequest\x1b[0m(userId: ${PackMe.dye(this.userId)})`;
	}
}

class UpdateSessionMessage extends PackMeMessage {
	/** @type {!number[]} */ userId;
	/** @type {!string} */ sessionId;
	
	constructor(
		/** !number[] */ userId,
		/** !string */ sessionId,
	) {
		super();
		this.$check('userId', userId);
		this.$check('sessionId', sessionId);
		this.userId = userId;
		this.sessionId = sessionId;
	}
	
	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 8;
		bytes += 4;
		bytes += 1 * this.userId.length;
		bytes += this.$stringBytes(this.sessionId);
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		this.$initPack(743336169);
		this.$packUint32(this.userId.length);
		for (let item of this.userId) this.$packUint8(item);
		this.$packString(this.sessionId);
	}

	/** @return {undefined} */
	$unpack() {
		this.$initUnpack();
		this.userId = [];
		let userIdLength = this.$unpackUint32();
		for (let i = 0; i < userIdLength; i++) {
			this.userId.push(this.$unpackUint8());
		}
		this.sessionId = this.$unpackString();
	}

	/** @return {string} */
	toString() {
		return `UpdateSessionMessage\x1b[0m(userId: ${PackMe.dye(this.userId)}, sessionId: ${PackMe.dye(this.sessionId)})`;
	}
}

const exampleUsersMessageFactory = {
	'242206268': () => new GetAllResponse(),
	'12982278': () => new GetAllRequest(),
	'430536944': () => new GetResponse(),
	'781905656': () => new GetRequest(),
	'69897231': () => new DeleteResponse(),
	'808423104': () => new DeleteRequest(),
	'743336169': () => new UpdateSessionMessage(),
};