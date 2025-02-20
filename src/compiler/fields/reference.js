// This class describes object field of reference type @[filename:]<node>.

import Field from '../field.js';
import Enum from '../nodes/enum.js';
import Obj from '../nodes/object.js';

export default class ReferenceField extends Field {
	constructor(node, tag, manifest) {
		super(node, tag, manifest);
		let colonIndex = manifest.indexOf(':');
		this.filename = colonIndex > 1 ? manifest.substring(1, colonIndex) : node.container.filename;
		this.external = colonIndex > 1 && manifest.substring(1, colonIndex) !== node.container.filename;
		this.referenceTag = colonIndex > 1 ? manifest.substring(colonIndex + 1) : manifest.substring(1);
		if (this.referenceTag === '') {
			throw `Field "${tag}" of node "${node.tag}" in ${node.container.filename}.json has reference filename "${this.filename}.json" but no reference node.`;
		}
		if (this.filename !== node.container.filename) node.include(this.filename, this.referenceTag);
	}

	get referenceNode() {
		let container = this.node.container.containers[this.filename];
		if (container == null) {
			throw `Field "${this.tag}" of node "${this.node.tag}" in ${this.node.container.filename}.json refers to file "${this.filename}.json" which is not found within the current compilation process.`;
		}
		let ref = container.nodes.find(n => (n instanceof Enum || n instanceof Obj) && n.tag === this.referenceTag);
		if (ref == null) {
			throw `Field "${this.tag}" of node "${this.node.tag}" in ${this.node.container.filename}.json refers to node "${this.referenceTag}" in ${this.filename}.json, but such enum/object node does not exist.`;
		}
		return ref;
	}

	get type() {
		return this.referenceNode.name;
	}

	get size() {
		return this.static ? 1 : 0;
	}

	get static() {
		return !this.optional && this.referenceNode instanceof Enum;
	}

	estimator(name = '', local = false) {
		return this.referenceNode instanceof Enum
			? '1'
			: `${local ? '' : 'this.'}${name}.$estimate()`;
	}

	packer(name = '') {
		return this.referenceNode instanceof Enum
			? `this.$packUint8(this.${name})`
			: `this.$packMessage(this.${name})`;
	}

	unpacker(name = '') {
		let ref = this.referenceNode;
		return ref instanceof Enum
			? `this.$unpackUint8()`
			: ref instanceof Obj && (ref.inheritTag !== '' || Object.keys(ref._getChildObjects()).length > 0)
				? `this.$unpackMessage(${ref._getInheritedRoot().name}.$emptyKin(this.$unpackUint32()))`
				: `this.$unpackMessage(new ${ref.name}())`;
	}
}
