// This class describes a container of nodes which corresponds to single manifest file.

import { validName } from './utils.js';
import Node from './node.js';
import Enum from './nodes/enum.js';
import Obj from './nodes/object.js';
import Message from './nodes/message.js';
import Request from './nodes/request.js';

export default class Container {
	includes = {};
	embedded = [];

	constructor(filename, manifest, containers) {
		this.filename = filename;
		this.manifest = manifest;
		this.containers = containers;
		this.nodes = Object.entries(manifest).map(entry => Node.fromEntry(this, entry));
		this.enums = this.nodes.filter(node => node instanceof Enum);
		this.objects = this.nodes.filter(node => node instanceof Obj);
		this.messages = this.nodes.filter(node => node instanceof Message);
		this.requests = this.nodes.filter(node => node instanceof Request);
	}

	output(containers) {
		let code = [];
		code.push("import { PackMe, PackMeMessage } from 'packme';");
		Object.keys(this.includes).sort().forEach(filename => {
			code.push(`import { ${this.includes[filename].join(', ')} } from './${filename}';`);
		});
		this.enums.forEach(node => code.push(...node.output()));
		this.objects.forEach(node => code.push(...node.output()));
		this.embedded.forEach(node => code.push(...node.output()));
		this.messages.forEach(node => code.push(...node.output()));
		this.requests.forEach(node => code.push(...node.output()));
		if (this.messages.length > 0 || this.requests.length > 0) {
			code.push('');
			code.push(`export const ${validName(this.filename)}MessageFactory = Object.freeze({`);
			code.push(...this.messages.map(message => `${message.id}: () => new ${message.name}(),`));
			code.push(...this.requests.map(request => `${request.id}: () => new ${request.name}(),`));
			code.push(...this.requests.map(request => `${request.responseId}: () => new ${request.responseName}(),`));
			code.push('});');
		}
		return code;
	}
}