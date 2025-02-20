// This class describes enum node declared in manifest.

import Node from '../node.js';
import { validName, isReserved } from '../utils.js';

export default class Enum extends Node {
	values = [];

	constructor(container, tag, manifest) {
		super(container, tag, validName(tag, true), manifest);
		if (isReserved(this.name)) {
			throw new Error(`Enum node "${tag}" in ${container.filename}.json is resulted with the name "${this.name}", which is a reserved keyword.`);
		}
		for (let row of manifest) {
			let value = validName(row);
			if (value === '') throw `Enum declaration "${tag}" in ${container.filename}.json contains invalid value "${row}" which is parsed into an empty string.`;
			if (this.values.includes(value)) throw `Enum declaration "${tag}" in ${container.filename}.json value "${row}" is parsed into a duplicating value "${value}".`;
			if (isReserved(value)) throw `Enum declaration "${tag}" in ${container.filename}.json value "${row}" is parsed as "${value}" which is a reserved keyword.`;
			this.values.push(value);
		}
	}

	// Return resulting code for Enum.
	output() {
		return [
			'',
			'/**',
			' * @enum {number}',
			' */',
			`export const ${this.name} = Object.freeze({`,
			...this.values.map((v, i) => `${v}: ${i},`),
			'})'
		];
	}
}
