class PackMe {
	#onError;
	#factory = {};

	constructor(/** function */ onError) {
		this.#onError = onError;
	}

	/** @returns {string} */
	static dye(/** any */ x) {
		return typeof x === 'string' ? `\x1b[32m${x}\x1b[0m`
			: typeof x === 'number' || typeof x === 'bigint' || typeof x === 'boolean' ? `\x1b[34m${x}\x1b[0m`
				: x instanceof Uint8Array ? `\x1b[36m[${x}]\x1b[0m`
					: x instanceof Array ? `[${x.map((item) => this.dye(item)).join(', ')}]`
						: `\x1b[35m${x}\x1b[0m`;
	}

	/** @returns {undefined} */
	register(/** Object */ messageFactory) {
		for (let key in messageFactory) {
			this.#factory[key] = messageFactory[key];
		}
	}

	/** @returns {?Uint8Array} */
	pack(/** PackMeMessage */ message) {
		try {
			message.$pack();
			return message.$data;
		}
		catch (err) {
			this.#onError?.(`Packing message failed: ${err.message}`, err.stack);
			return null;
		}
	}

	/** @returns {?PackMeMessage} */
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
			this.#onError?.(`Unpacking message failed: ${err.message}`, err.stack);
			return null;
		}
	}
}

export default PackMe;