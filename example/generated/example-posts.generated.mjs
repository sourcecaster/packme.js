import {PackMe, PackMeMessage} from 'packme';

class GetAllResponsePostAuthor extends PackMeMessage {
	/** @type {!number[]} */ id;
	/** @type {!string} */ nickname;
	/** @type {!string} */ avatar;
	
	constructor(
		/** !number[] */ id,
		/** !string */ nickname,
		/** !string */ avatar,
	) {
		super();
		if (arguments.length > 0) {
			this.$check('id', id);
			this.$check('nickname', nickname);
			this.$check('avatar', avatar);
		}
		this.id = id;
		this.nickname = nickname;
		this.avatar = avatar;
	}
	
	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 0;
		bytes += 4;
		bytes += 1 * this.id.length;
		bytes += this.$stringBytes(this.nickname);
		bytes += this.$stringBytes(this.avatar);
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		this.$packUint32(this.id.length);
		for (let item of this.id) this.$packUint8(item);
		this.$packString(this.nickname);
		this.$packString(this.avatar);
	}

	/** @return {undefined} */
	$unpack() {
		this.id = [];
		let idLength = this.$unpackUint32();
		for (let i = 0; i < idLength; i++) {
			this.id.push(this.$unpackUint8());
		}
		this.nickname = this.$unpackString();
		this.avatar = this.$unpackString();
	}

	/** @return {string} */
	toString() {
		return `GetAllResponsePostAuthor\x1b[0m(id: ${PackMe.dye(this.id)}, nickname: ${PackMe.dye(this.nickname)}, avatar: ${PackMe.dye(this.avatar)})`;
	}
}

class GetAllResponsePost extends PackMeMessage {
	/** @type {!number[]} */ id;
	/** @type {!GetAllResponsePostAuthor} */ author;
	/** @type {!string} */ title;
	/** @type {!string} */ shortContent;
	/** @type {!Date} */ posted;
	
	constructor(
		/** !number[] */ id,
		/** !GetAllResponsePostAuthor */ author,
		/** !string */ title,
		/** !string */ shortContent,
		/** !Date */ posted,
	) {
		super();
		if (arguments.length > 0) {
			this.$check('id', id);
			this.$check('author', author);
			this.$check('title', title);
			this.$check('shortContent', shortContent);
			this.$check('posted', posted);
		}
		this.id = id;
		this.author = author;
		this.title = title;
		this.shortContent = shortContent;
		this.posted = posted;
	}
	
	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 8;
		bytes += 4;
		bytes += 1 * this.id.length;
		bytes += this.author.$estimate();
		bytes += this.$stringBytes(this.title);
		bytes += this.$stringBytes(this.shortContent);
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		this.$packUint32(this.id.length);
		for (let item of this.id) this.$packUint8(item);
		this.$packMessage(this.author);
		this.$packString(this.title);
		this.$packString(this.shortContent);
		this.$packDateTime(this.posted);
	}

	/** @return {undefined} */
	$unpack() {
		this.id = [];
		let idLength = this.$unpackUint32();
		for (let i = 0; i < idLength; i++) {
			this.id.push(this.$unpackUint8());
		}
		this.author = this.$unpackMessage(new GetAllResponsePostAuthor());
		this.title = this.$unpackString();
		this.shortContent = this.$unpackString();
		this.posted = this.$unpackDateTime();
	}

	/** @return {string} */
	toString() {
		return `GetAllResponsePost\x1b[0m(id: ${PackMe.dye(this.id)}, author: ${PackMe.dye(this.author)}, title: ${PackMe.dye(this.title)}, shortContent: ${PackMe.dye(this.shortContent)}, posted: ${PackMe.dye(this.posted)})`;
	}
}

class GetAllResponse extends PackMeMessage {
	/** @type {!GetAllResponsePost[]} */ posts;
	
	constructor(
		/** !GetAllResponsePost[] */ posts,
	) {
		super();
		if (arguments.length > 0) {
			this.$check('posts', posts);
		}
		this.posts = posts;
	}
	
	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 8;
		bytes += 4;
		for (let i = 0; i < this.posts.length; i++) bytes += this.posts[i].$estimate();
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		this.$initPack(280110613);
		this.$packUint32(this.posts.length);
		for (let item of this.posts) this.$packMessage(item);
	}

	/** @return {undefined} */
	$unpack() {
		this.$initUnpack();
		this.posts = [];
		let postsLength = this.$unpackUint32();
		for (let i = 0; i < postsLength; i++) {
			this.posts.push(this.$unpackMessage(new GetAllResponsePost()));
		}
	}

	/** @return {string} */
	toString() {
		return `GetAllResponse\x1b[0m(posts: ${PackMe.dye(this.posts)})`;
	}
}

class GetAllRequest extends PackMeMessage {
	
	constructor() {
		super();
	}
	
	/** @return {GetAllResponse} */
	$response({
			/** !GetAllResponsePost[] */ posts,
	}) {
		let message = new GetAllResponse(posts);
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
		this.$initPack(63570112);
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

class GetResponseAuthor extends PackMeMessage {
	/** @type {!number[]} */ id;
	/** @type {!string} */ nickname;
	/** @type {!string} */ avatar;
	/** @type {?string} */ facebookId;
	/** @type {?string} */ twitterId;
	/** @type {?string} */ instagramId;
	
	constructor(
		/** !number[] */ id,
		/** !string */ nickname,
		/** !string */ avatar,
		/** ?string */ facebookId,
		/** ?string */ twitterId,
		/** ?string */ instagramId,
	) {
		super();
		if (arguments.length > 0) {
			this.$check('id', id);
			this.$check('nickname', nickname);
			this.$check('avatar', avatar);
		}
		this.id = id;
		this.nickname = nickname;
		this.avatar = avatar;
		this.facebookId = facebookId;
		this.twitterId = twitterId;
		this.instagramId = instagramId;
	}
	
	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 1;
		bytes += 4;
		bytes += 1 * this.id.length;
		bytes += this.$stringBytes(this.nickname);
		bytes += this.$stringBytes(this.avatar);
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
		this.$packUint32(this.id.length);
		for (let item of this.id) this.$packUint8(item);
		this.$packString(this.nickname);
		this.$packString(this.avatar);
		if (this.facebookId != null) this.$packString(this.facebookId);
		if (this.twitterId != null) this.$packString(this.twitterId);
		if (this.instagramId != null) this.$packString(this.instagramId);
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
		this.avatar = this.$unpackString();
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
		return `GetResponseAuthor\x1b[0m(id: ${PackMe.dye(this.id)}, nickname: ${PackMe.dye(this.nickname)}, avatar: ${PackMe.dye(this.avatar)}, facebookId: ${PackMe.dye(this.facebookId)}, twitterId: ${PackMe.dye(this.twitterId)}, instagramId: ${PackMe.dye(this.instagramId)})`;
	}
}

class GetResponseStats extends PackMeMessage {
	/** @type {!number} */ likes;
	/** @type {!number} */ dislikes;
	
	constructor(
		/** !number */ likes,
		/** !number */ dislikes,
	) {
		super();
		if (arguments.length > 0) {
			this.$check('likes', likes);
			this.$check('dislikes', dislikes);
		}
		this.likes = likes;
		this.dislikes = dislikes;
	}
	
	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 8;
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		this.$packUint32(this.likes);
		this.$packUint32(this.dislikes);
	}

	/** @return {undefined} */
	$unpack() {
		this.likes = this.$unpackUint32();
		this.dislikes = this.$unpackUint32();
	}

	/** @return {string} */
	toString() {
		return `GetResponseStats\x1b[0m(likes: ${PackMe.dye(this.likes)}, dislikes: ${PackMe.dye(this.dislikes)})`;
	}
}

class GetResponseCommentAuthor extends PackMeMessage {
	/** @type {!number[]} */ id;
	/** @type {!string} */ nickname;
	/** @type {!string} */ avatar;
	
	constructor(
		/** !number[] */ id,
		/** !string */ nickname,
		/** !string */ avatar,
	) {
		super();
		if (arguments.length > 0) {
			this.$check('id', id);
			this.$check('nickname', nickname);
			this.$check('avatar', avatar);
		}
		this.id = id;
		this.nickname = nickname;
		this.avatar = avatar;
	}
	
	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 0;
		bytes += 4;
		bytes += 1 * this.id.length;
		bytes += this.$stringBytes(this.nickname);
		bytes += this.$stringBytes(this.avatar);
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		this.$packUint32(this.id.length);
		for (let item of this.id) this.$packUint8(item);
		this.$packString(this.nickname);
		this.$packString(this.avatar);
	}

	/** @return {undefined} */
	$unpack() {
		this.id = [];
		let idLength = this.$unpackUint32();
		for (let i = 0; i < idLength; i++) {
			this.id.push(this.$unpackUint8());
		}
		this.nickname = this.$unpackString();
		this.avatar = this.$unpackString();
	}

	/** @return {string} */
	toString() {
		return `GetResponseCommentAuthor\x1b[0m(id: ${PackMe.dye(this.id)}, nickname: ${PackMe.dye(this.nickname)}, avatar: ${PackMe.dye(this.avatar)})`;
	}
}

class GetResponseComment extends PackMeMessage {
	/** @type {!GetResponseCommentAuthor} */ author;
	/** @type {!string} */ comment;
	/** @type {!Date} */ posted;
	
	constructor(
		/** !GetResponseCommentAuthor */ author,
		/** !string */ comment,
		/** !Date */ posted,
	) {
		super();
		if (arguments.length > 0) {
			this.$check('author', author);
			this.$check('comment', comment);
			this.$check('posted', posted);
		}
		this.author = author;
		this.comment = comment;
		this.posted = posted;
	}
	
	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 8;
		bytes += this.author.$estimate();
		bytes += this.$stringBytes(this.comment);
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		this.$packMessage(this.author);
		this.$packString(this.comment);
		this.$packDateTime(this.posted);
	}

	/** @return {undefined} */
	$unpack() {
		this.author = this.$unpackMessage(new GetResponseCommentAuthor());
		this.comment = this.$unpackString();
		this.posted = this.$unpackDateTime();
	}

	/** @return {string} */
	toString() {
		return `GetResponseComment\x1b[0m(author: ${PackMe.dye(this.author)}, comment: ${PackMe.dye(this.comment)}, posted: ${PackMe.dye(this.posted)})`;
	}
}

class GetResponse extends PackMeMessage {
	/** @type {!string} */ title;
	/** @type {!string} */ content;
	/** @type {!Date} */ posted;
	/** @type {!GetResponseAuthor} */ author;
	/** @type {!GetResponseStats} */ stats;
	/** @type {!GetResponseComment[]} */ comments;
	
	constructor(
		/** !string */ title,
		/** !string */ content,
		/** !Date */ posted,
		/** !GetResponseAuthor */ author,
		/** !GetResponseStats */ stats,
		/** !GetResponseComment[] */ comments,
	) {
		super();
		if (arguments.length > 0) {
			this.$check('title', title);
			this.$check('content', content);
			this.$check('posted', posted);
			this.$check('author', author);
			this.$check('stats', stats);
			this.$check('comments', comments);
		}
		this.title = title;
		this.content = content;
		this.posted = posted;
		this.author = author;
		this.stats = stats;
		this.comments = comments;
	}
	
	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 16;
		bytes += this.$stringBytes(this.title);
		bytes += this.$stringBytes(this.content);
		bytes += this.author.$estimate();
		bytes += this.stats.$estimate();
		bytes += 4;
		for (let i = 0; i < this.comments.length; i++) bytes += this.comments[i].$estimate();
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		this.$initPack(244485545);
		this.$packString(this.title);
		this.$packString(this.content);
		this.$packDateTime(this.posted);
		this.$packMessage(this.author);
		this.$packMessage(this.stats);
		this.$packUint32(this.comments.length);
		for (let item of this.comments) this.$packMessage(item);
	}

	/** @return {undefined} */
	$unpack() {
		this.$initUnpack();
		this.title = this.$unpackString();
		this.content = this.$unpackString();
		this.posted = this.$unpackDateTime();
		this.author = this.$unpackMessage(new GetResponseAuthor());
		this.stats = this.$unpackMessage(new GetResponseStats());
		this.comments = [];
		let commentsLength = this.$unpackUint32();
		for (let i = 0; i < commentsLength; i++) {
			this.comments.push(this.$unpackMessage(new GetResponseComment()));
		}
	}

	/** @return {string} */
	toString() {
		return `GetResponse\x1b[0m(title: ${PackMe.dye(this.title)}, content: ${PackMe.dye(this.content)}, posted: ${PackMe.dye(this.posted)}, author: ${PackMe.dye(this.author)}, stats: ${PackMe.dye(this.stats)}, comments: ${PackMe.dye(this.comments)})`;
	}
}

class GetRequest extends PackMeMessage {
	/** @type {!number[]} */ postId;
	
	constructor(
		/** !number[] */ postId,
	) {
		super();
		if (arguments.length > 0) {
			this.$check('postId', postId);
		}
		this.postId = postId;
	}
	
	/** @return {GetResponse} */
	$response({
			/** !string */ title,
			/** !string */ content,
			/** !Date */ posted,
			/** !GetResponseAuthor */ author,
			/** !GetResponseStats */ stats,
			/** !GetResponseComment[] */ comments,
	}) {
		let message = new GetResponse(title, content, posted, author, stats, comments);
		message.$request = this;
		return message;
	}

	/** @return {number} */
	$estimate() {
		this.$reset();
		let bytes = 8;
		bytes += 4;
		bytes += 1 * this.postId.length;
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		this.$initPack(187698222);
		this.$packUint32(this.postId.length);
		for (let item of this.postId) this.$packUint8(item);
	}

	/** @return {undefined} */
	$unpack() {
		this.$initUnpack();
		this.postId = [];
		let postIdLength = this.$unpackUint32();
		for (let i = 0; i < postIdLength; i++) {
			this.postId.push(this.$unpackUint8());
		}
	}

	/** @return {string} */
	toString() {
		return `GetRequest\x1b[0m(postId: ${PackMe.dye(this.postId)})`;
	}
}

class DeleteResponse extends PackMeMessage {
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
		this.$initPack(788388804);
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
	/** @type {!number[]} */ postId;
	
	constructor(
		/** !number[] */ postId,
	) {
		super();
		if (arguments.length > 0) {
			this.$check('postId', postId);
		}
		this.postId = postId;
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
		bytes += 1 * this.postId.length;
		return bytes;
	}

	/** @return {undefined} */
	$pack() {
		this.$initPack(486637631);
		this.$packUint32(this.postId.length);
		for (let item of this.postId) this.$packUint8(item);
	}

	/** @return {undefined} */
	$unpack() {
		this.$initUnpack();
		this.postId = [];
		let postIdLength = this.$unpackUint32();
		for (let i = 0; i < postIdLength; i++) {
			this.postId.push(this.$unpackUint8());
		}
	}

	/** @return {string} */
	toString() {
		return `DeleteRequest\x1b[0m(postId: ${PackMe.dye(this.postId)})`;
	}
}

const examplePostsMessageFactory = {
	'280110613': () => new GetAllResponse(),
	'63570112': () => new GetAllRequest(),
	'244485545': () => new GetResponse(),
	'187698222': () => new GetRequest(),
	'788388804': () => new DeleteResponse(),
	'486637631': () => new DeleteRequest(),
};

export {GetAllResponse, GetAllRequest, GetResponse, GetRequest, DeleteResponse, DeleteRequest, examplePostsMessageFactory};