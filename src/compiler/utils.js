// Color constants
export let RED = '\x1b[31m';
export let GREEN = '\x1b[32m';
export let YELLOW = '\x1b[33m';
export let RESET = '\x1b[0m';

// Reserved names you can't use as field names or enum values.
let reservedNames = [
	'assert', 'bool', 'break', 'case', 'catch', 'class', 'const', 'continue', 'covariant',
	'DateTime', 'default', 'deferred', 'do', 'double', 'else', 'enum', 'export', 'extends',
	'extension', 'external', 'factory', 'false', 'final', 'finally', 'for', 'if', 'in', 'int',
	'is', 'Iterable', 'List', 'Map', 'new', 'Null', 'null', 'PackMe', 'PackMeMessage', 'rethrow',
	'return', 'Set', 'super', 'switch', 'this', 'throw', 'true', 'try', 'values', 'var', 'void',
	'while', 'with', 'hashCode', 'noSuchMethod', 'runtimeType', 'String', 'toString', 'Uint8List'
];

/**
 * Check if a name is reserved.
 * @param {string} name
 * @returns {boolean}
 */
export function isReserved(name) {
	return reservedNames.includes(name);
}

/**
 * Converts lower case names with underscores to UpperCamelCase (for classes) or
 * lowerCamelCase (for fields).
 * @param {string} input
 * @param {boolean} [firstCapital=false]
 * @returns {string}
 */
export function validName(input, firstCapital = false) {
	let re = firstCapital ? /(^[a-z]|[^a-zA-Z][a-z])/g : /([^a-zA-Z\?][a-z])/g;
	let result = input.replace(re, match => match.toUpperCase());
	result = result.replace(/^\??\d+|[^a-zA-Z0-9]/g, '');
	return result;
}

/**
 * Auto indents an array of code lines.
 * @param {string[]} lines
 * @returns {string[]}
 */
export function formatCode(lines) {
	let indent = 0;
	let reOpen = /\{[^\}]*$/;
	let reClose = /^[^\{]*\}/;
	let reEmpty = /^\s*$/;
	for (let i = 0; i < lines.length; i++) {
		let increase = reOpen.test(lines[i]);
		let decrease = reClose.test(lines[i]);
		if (decrease) indent--;
		if (!reEmpty.test(lines[i])) lines[i] = '\t'.repeat(indent) + lines[i];
		if (increase) indent++;
	}
	return lines;
}

// Plural to singular conversion rules
let singularRules = new Map([
	[ /men$/i, () => 'man' ],
	[ /(eau)x?$/i, (_, p1) => p1 ],
	[ /(child)ren$/i, (_, p1) => p1 ],
	[ /(pe)(rson|ople)$/i, (_, p1) => p1 + 'rson' ],
	[ /(matr|append)ices$/i, (_, p1) => p1 + 'ix' ],
	[ /(cod|mur|sil|vert|ind)ices$/i, (_, p1) => p1 + 'ex' ],
	[ /(alumn|alg|vertebr)ae$/i, (_, p1) => p1 + 'a' ],
	[ /(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i, (_, p1) => p1 + 'on' ],
	[ /(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i, (_, p1) => p1 + 'um' ],
	[ /(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, (_, p1) => p1 + 'us' ],
	[ /(test)(?:is|es)$/i, (_, p1) => p1 + 'is' ],
	[ /(movie|twelve|abuse|e[mn]u)s$/i, (_, p1) => p1 ],
	[ /(analy|diagno|parenthe|progno|synop|the|empha|cri|ne)(?:sis|ses)$/i, (_, p1) => p1 + 'sis' ],
	[ /(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|t[lm]as|gas|(?:her|at|gr)o|[aeiou]ris)(?:es)?$/i, (_, p1) => p1 ],
	[ /(seraph|cherub)im$/i, (_, p1) => p1 ],
	[ /\b((?:tit)?m|l)ice$/i, (_, p1) => p1 + 'ouse' ],
	[ /\b(mon|smil)ies$/i, (_, p1) => p1 + 'ey' ],
	[ /\b(l|(?:neck|cross|hog|aun)?t|coll|faer|food|gen|goon|group|hipp|junk|vegg|(?:pork)?p|charl|calor|cut)ies$/i, (_, p1) => p1 + 'ie' ],
	[ /(dg|ss|ois|lk|ok|wn|mb|th|ch|ec|oal|is|ck|ix|sser|ts|wb)ies$/i, (_, p1) => p1 + 'ie' ],
	[ /ies$/i, () => 'y' ],
	[ /(ar|(?:wo|[ae])l|[eo][ao])ves$/i, (_, p1) => p1 + 'f' ],
	[ /(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i, (_, p1) => p1 + 'fe' ],
	[ /(ss)$/i, (_, p1) => p1 ],
	[ /s$/i, () => '' ]
]);

/**
 * Returns the singular form of a plural word.
 * @param {string} plural
 * @returns {string}
 */
export function toSingular(plural) {
	// If plural ends with an uppercase letter or digit, assume it's an abbreviation.
	if (/[A-Z0-9]$/.test(plural)) return plural;
	let singular = plural;
	for (let [regex, transform] of singularRules) {
		if (regex.test(plural)) {
			singular = plural.replace(regex, transform);
			break;
		}
	}
	return singular;
}

/**
 * Checks if value is an object.
 * @param {any} value
 * @returns {boolean}
 */
export function isObject(value) {
	return value != null && typeof value === 'object' && !(value instanceof Array);
}

/**
 * Calculates Dart-like hashCode of a string.
 * @param {string} str
 * @returns {number}
 */
export function hashCode(str) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		let code = str.charCodeAt(i);
		hash += code;
		hash += hash << 10;
		hash ^= hash >>> 6;
	}
	hash += hash << 3;
	hash ^= hash >>> 11;
	hash += hash << 15;
	hash &= (1 << 30) - 1;
	return (hash === 0) ? 1 : hash;
}

