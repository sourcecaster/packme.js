// This class describes message node declared in manifest.

import Node from '../node.js';
import Obj from './object.js';
import { validName, isReserved, hashCode } from '../utils.js';

export default class Message extends Node {
	constructor(container, tag, manifest) {
		let name = `${validName(tag, true)}Message`;
		super(container, tag, name, manifest);
		this.id = hashCode(container.filename + name);
		if (isReserved(name)) {
			throw `Message node "${tag}" in ${container.filename}.json is resulted with the name "${name}", which is a reserved keyword.`;
		}
		this.messageObject = new Obj(container, `${tag}_message`, manifest[0], this.id);
		if (this.messageObject.inheritTag !== '') {
			throw `Message node "${tag}" in ${container.filename}.json cannot be inherited from any other node.`;
		}
	}

	output() {
		return this.messageObject.output();
	}
}
