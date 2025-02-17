// This class describes a single entity (node) in manifest file (whether it's enum, object, message or request).

import { validName, isObject } from './utils.js';

export let nodes = {};

export default class Node {
	constructor(container, tag, name, manifest) {
		this.container = container;
		this.tag = tag;
		this.name = name;
		this.manifest = manifest;
	}

	// Try to create a Node instance of corresponding type
	static fromEntry(container, entry) {
		let [key, value] = entry;
		if (validName(key) === '') throw `Node "${key}" in ${container.filename}.json is resulted with the name parsed into an empty string.`;
		if (isObject(value)) return new nodes.Obj(container, key, value);
		if (value instanceof Array) {
			if (value.length === 1 && isObject(value[0])) return new nodes.Message(container, key, value);
			if (value.length === 2 && isObject(value[0]) && isObject(value[1])) return new nodes.Request(container, key, value);
			if (value.length > 0 && value.every(item => typeof item === 'string')) return new nodes.Enum(container, key, value);
		}
		throw `Node "${key}" in ${container.filename}.json has invalid format. Use array of strings for enum declaration, object for object declaration or array of 1 or 2 objects for message or request correspondingly.`;
	}

	// Adds a reference to import from another file
	include(filename, name) {
		filename += '.generated.js';
		name = validName(name, true);
		this.container.includes[filename] ??= [];
		if (!this.container.includes[filename].includes(name)) {
			this.container.includes[filename].push(name);
			this.container.includes[filename].sort();
		}
	}

	// Adds an embedded node to output its code
	embed(node) {
		this.container.embedded.push(node);
		this.container.embedded.sort((a, b) => a.name.localeCompare(b.name));
	}

	// Return resulting code, must be overridden.
	output() {
		return [];
	}
}
