import {PackMeMessage} from './message.mjs';

class PackMe {
	#onError;
	#factory = {};

	constructor(/** handler */ onError) {
		this.#onError = onError;
	}

	/** @return {string} */
	static dye(/** any */ x) {
		return typeof x === 'string' ? `\x1b[32m${x}\x1b[0m`
		: typeof x === 'number' || typeof x === 'bigint' || typeof x === 'boolean' ? `\x1b[34m${x}\x1b[0m`
		: `\x1b[35m${x}\x1b[0m`;
	}

	/** @return {undefined} */
	register(/** Object */ messageFactory) {
		for (let key in messageFactory) {
			this.#factory[key] = messageFactory[key];
		}
	}

	/** @return {?Uint8Array} */
	pack(/** PackMeMessage */ message) {
		try {
			message.$pack();
			return message.$data;
		}
		catch (err) {
			if (this.#onError != null) this.#onError(`Packing message failed: ${err.message}`, err.stack);
			return null;
		}
	}

	/** @return {?PackMeMessage} */
	unpack(/** Uint8Array */ data) {
		try {
			if (data.length < 4) return null;
			let view = new DataView(data.buffer);
			let id = view.getUint32(0, false);
			let message = this.#factory[id]();
			message.$data = data;
			message.$view = view;
			message.$unpack();
			return message;
		}
		catch (err) {
			if (this.#onError != null) this.#onError(`Unpacking message failed: ${err.message}`, err.stack);
			return null;
		}
	}
}

export {PackMe, PackMeMessage};