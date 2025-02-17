// This class describes object field of object type { ... }.

import Field from '../field.js';
import Obj from './object.js';
import { toSingular } from '../utils.js';

export default class ObjectField extends Field {
	constructor(node, tag, manifest, parentIsArray = false) {
		super(node, tag, manifest);
		this.embeddedObject = new Obj(node.container, `${node.tag}_${parentIsArray ? toSingular(tag) : tag}`, manifest);
		node.embed(this.embeddedObject);
	}

	get type() {
		return this.embeddedObject.name;
	}

	estimator(name = '') {
		return `${name}.$estimate()`;
	}

	packer(name = '') {
		return `this.$packMessage(${name})`;
	}

	unpacker() {
		return `this.$unpackMessage(${this.embeddedObject.name}.$empty())`;
	}

	output() {
		return this.embeddedObject.output();
	}
}
