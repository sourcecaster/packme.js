// This class describes request node declared in manifest.

import Node from '../node.js';
import Obj from './object.js';
import { validName, isReserved, hashCode } from '../utils.js';

export default class Request extends Node {
	constructor(container, tag, manifest) {
		let name = `${validName(tag, true)}Request`;
		super(container, tag, name, manifest);
		this.id = hashCode(`${container.filename}${name}`);
		this.responseName = `${validName(tag, true)}Response`;
		this.responseId = hashCode(`${container.filename}${this.responseName}`);
		if (isReserved(name)) {
			throw `Request node "${tag}" in ${container.filename}.json is resulted with the name "${name}", which is a reserved keyword.`;
		}
		if (isReserved(this.responseName)) {
			throw `Response node "${tag}" in ${container.filename}.json is resulted with the name "${this.responseName}", which is a reserved keyword.`;
		}
		this.responseObject = new Obj(container, `${tag}_response`, manifest[1], this.responseId);
		this.requestObject = new Obj(container, `${tag}_request`, manifest[0], this.id, this.responseObject);
		if (this.responseObject.inheritTag !== '' || this.requestObject.inheritTag !== '') {
			throw `Request node "${tag}" in ${container.filename}.json cannot be inherited from any other node.`;
		}
	}

	output() {
		return [...this.requestObject.output(), ...this.responseObject.output()];
	}
}
