/// This file allows you to generate JS source code files for PackMe data protocol using JSON manifest files.
///
/// Usage: node compiler.js <srcDir> <outDir> [filenames (optionally)]
///
/// JSON manifest file represents a set of nodes representing different entities declarations: enumerations, objects,
/// messages and requests. In your server code you mostly listen for requests from client and reply with responses.
/// However, it totally depends on your architecture: server may as well send messages to inform clint of some data
/// changes or send requests and expect clients to send back responses with corresponding data.
///
/// Enumeration declaration is represented with an array of strings. Object declaration is just an object. Message or
/// request declarations consist of array of 1 or 2 objects respectively. In case of request the second object
/// represents response declaration. Here's an example of JSON manifest file:
///
/// [
/// 	"some_enum": [
/// 		"one",
/// 		"two",
/// 		"three"
/// 	],
/// 	"some_object": {
/// 		"name": "string",
/// 		"volume": "double",
/// 		"type": "@some_enum"
/// 	},
/// 	"some_message": [
/// 		{
/// 			"update_timestamp": "uint64",
/// 			"update_coordinates": ["double"]
/// 		}
/// 	],
/// 	"some_request": [
/// 		{
/// 			"search_query": "string",
/// 			"type_filter": "@some_enum"
/// 		},
/// 		{
/// 			"search_results": ["@some_object"]
/// 		}
/// 	]
/// ]
///
/// Nested object in command request or response will be represented with new class named like
/// SomeCommandResponse<object_name>. For example compiling next manifest:
///
/// 	"get_posts": [
/// 		{
/// 			"from": "datetime",
/// 			"amount": "uint16"
/// 		},
/// 		{
/// 			"posts": [{
/// 				"id": "binary12",
/// 				"author": "string",
///					"created: "datetime",
///					"title": "string",
///					"contents": "string"
/// 			}],
/// 			"stats": {
/// 				"loaded": "uint16",
/// 				"remaining": "uint32",
/// 				"total": "uint32",
/// 			},
/// 			"?error": "string"
/// 		}
/// 	]
///
/// will result, for instance, in creating class GetPostsResponsePost (note that it has a singular form "Post", not
/// "Posts" - that is because "posts" is an array of nested object) which will contain four fields: Uint8List<int> id,
/// String author, DateTime created, String title and String contents. Also, there will be class GetPostsResponseStats
/// (plural this time, same as field name "stats", because it's just a nested object, not an array) which will contain
/// three int fields: loaded, remaining and total.
///
/// Here's the short list of supported features (see more details in README.md):
/// 	- prefix "?" in field declaration means it is optional (null by default);
/// 	- enumeration declaration: "color": ["black", "white", "yellow"];
/// 	- object declaration: "person": { "name": "string", "age": "uint8" };
/// 	- enumeration/object reference (filed of type enum/object declared earlier): "persons": ["@person"];
/// 	- referencing to entity from another file: "persons": ["@protocol_types:person"];
/// 	- object inheritance in object declaration: "animal": { "legs": "uint8" }, "cat@animal": { "fur": "bool" }.

import fs from 'fs';
import path from 'path';
import { formatCode, GREEN, YELLOW, RED, RESET } from './utils.js';
import Container from './container.js';

import { nodes } from './node.js';
import Enum from './nodes/enum.js';
import Message from './nodes/message.js';
import Obj from './nodes/object.js';
import Request from './nodes/request.js';

nodes.Enum = Enum;
nodes.Message = Message;
nodes.Obj = Obj;
nodes.Request = Request;

import ArrayField from './fields/array.js';
import BinaryField from './fields/binary.js';
import BoolField from './fields/bool.js';
import DateTimeField from './fields/datetime.js';
import FloatField from './fields/float.js';
import IntField from './fields/int.js';
import ObjectField from './fields/object.js';
import ReferenceField from './fields/reference.js';
import StringField from './fields/string.js';

import { fields } from './field.js';
fields.ArrayField = ArrayField;
fields.BinaryField = BinaryField;
fields.BoolField = BoolField;
fields.DateTimeField = DateTimeField;
fields.FloatField = FloatField;
fields.IntField = IntField;
fields.ObjectField = ObjectField;
fields.ReferenceField = ReferenceField;
fields.StringField = StringField;

function processFiles(srcPath, outPath, filenames, isTest) {
	let files;
	try {
		if (!fs.existsSync(srcPath) || !fs.lstatSync(srcPath).isDirectory()) throw `Path not found: ${srcPath}`;
		if (!fs.existsSync(outPath)) fs.mkdirSync(outPath, { recursive: true });
		else if (!fs.lstatSync(outPath).isDirectory()) throw `Path is not a directory: ${outPath}`;
		files = fs.readdirSync(srcPath);
	}
	catch (err) {
		throw `Unable to process files: ${err}`;
	}

	// Filter file system entities, leave only manifest files to process
	let reJson = /\.json$/;
	let reName = /(.+?)\.json$/;
	files = files.filter(f => reJson.test(f) && (filenames.length === 0 || filenames.includes(f)));
	for (let filename of filenames) {
		if (!files.includes(filename)) throw `File not found: ${filename}`;
	}
	if (files.length === 0) throw 'No manifest files found';

	let containers = {};

	for (let file of files) {
		let filename = reName.exec(file)[1];

		// Try to get the file contents as potential JSON string
		let json;
		try {
			json = fs.readFileSync(path.join(srcPath, file), { encoding: 'utf8' });
		}
		catch (err) {
			throw `Unable to open manifest file: ${err}`;
		}

		// Try to parse JSON
		let manifest;
		try {
			manifest = JSON.parse(json);
		} catch (err) {
			throw `Unable to parse ${filename}.json: ${err}`;
		}

		// Create container with nodes from the parsed data
		containers[filename] = new Container(filename, manifest, containers);
	}

	let codePerFile = {};

	// Process nodes and get resulting code strings
	for (let container of Object.values(containers)) {
		codePerFile[container.filename] ??= [];
		codePerFile[container.filename].push(...container.output(containers));
	}

	// Output resulting code
	for (let filename in codePerFile) {
		let code = formatCode(codePerFile[filename]).join('\n');
		if (!isTest) fs.writeFileSync(`${outPath}/${filename}.generated.js`, code, 'utf8');
		else console.log(`${filename}.generated.js: ~${code.length} bytes`);
	}

	console.log(`${GREEN}${files.length} file${files.length > 1 ? 's are' : ' is'} successfully processed${RESET}`);
}

let args = process.argv.slice(2);
let isTest = args[0] === '--test';
if (isTest) args.shift();
let srcPath = path.resolve(args[0] ?? '');
let outPath = path.resolve(args[1] ?? '');
let filenames = args.slice(2);

// Remove duplicates and add file extension if not specified
filenames = [...new Set(filenames.map(f => f.endsWith('.json') ? f : f + '.json'))];

try {
	console.log(`${GREEN}Compiling ${filenames.length === 0 ? 'all .json files...' : `${filenames.length} files: ${filenames.join(', ')}...`}${RESET}`);
	console.log(`${GREEN}    Input directory: ${YELLOW}${srcPath}${RESET}`);
	console.log(`${GREEN}    Output directory: ${YELLOW}${outPath}${RESET}`);
	processFiles(srcPath, outPath, filenames, isTest);
}
catch (err) {
	if (isTest) throw err;
	else console.log(`${RED}${err}${RESET}`);
}