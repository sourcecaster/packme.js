import {Enum} from './enum.mjs';

const RED = '\x1b[31m';
const RESET = '\x1b[0m';

Object.defineProperty(String.prototype, 'hashCode', {
    get: function() {
        let hash = 0;
        for (let i = 0; i < this.length; i++) {
            let code = this.charCodeAt(i);
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
});

function fatal(message, stack) {
    console.log(`${RED}${message}${RESET}`);
    if (stack != null) console.log(stack);
    process.exit(-1);
}

/// Reserved names you can't use as field names.
const reserved = [
    'assert', 'break', 'case', 'catch', 'class', 'const', 'continue', 'default',
    'do', 'else', 'enum', 'extends', 'false', 'final', 'finally', 'for', 'if',
    'in', 'is', 'new', 'null', 'rethrow', 'return', 'super', 'switch', 'this',
    'throw', 'true', 'try', 'var', 'void', 'while', 'with', 'hashCode',
    'noSuchMethod', 'runtimeType', 'toString'
];

/// How many bytes required to store.
const _sizeOf = {
    bool: 1,
    int8: 1,
    uint8: 1,
    int16: 2,
    uint16: 2,
    int32: 4,
    uint32: 4,
    int64: 8,
    uint64: 8,
    float: 4,
    double: 8,
    datetime: 8,
};

function sizeOf(type) {
    if (typeof type == 'string') return _sizeOf[type];
    if (type instanceof Enum) return 1;
    return null;
}

/// Converts lower case names with underscore to UpperCamelCase (for classes) or
/// lowerCamelCase (for class fields).
function validName(input, firstCapital = false) {
    let re = firstCapital ? /^[a-z]|[^a-zA-Z][a-z]/g : /[^a-zA-Z?][a-z]/g;
    let result = input.replace(re, (match) => match.toUpperCase());
    re = /[^a-zA-Z0-9]/g;
    result = result.replace(re, '');
    return result;
}

/// Auto indents.
function format(lines) {
    let indent = 0;
    let reOpen = /{[^}]*$/;
    let reClose = /^[^{]*}/;
    for (let i = 0; i < lines.length; i++) {
        let increase = reOpen.test(lines[i]);
        let decrease = reClose.test(lines[i]);
        if (decrease) indent--;
        lines[i] = '\t'.repeat(indent) + lines[i];
        if (increase) indent++;
    }
    return lines;
}

export {fatal, reserved, sizeOf, validName, format};