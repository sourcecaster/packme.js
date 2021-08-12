/// This class describes Enum type declared in manifest.

import {FieldType} from './fieldtype.mjs';
import {validName, reserved} from './utils.mjs';

class Enum extends FieldType {
    manifest;
    values = [];

    constructor(filename, name, manifest) {
        super(filename, name);
        this.manifest = manifest;
        for (let value of manifest) {
            value = validName(value);
            if (value.isEmpty) throw new Error(`Enum "${this.name}" contains invalid value.`);
            if (this.values.indexOf(value) !== -1) throw new Error(`Enum "${this.name}" value "${value}" is duplicated.`);
            if (reserved.indexOf(value) !== -1) throw new Error(`Enum "${this.name}" value "${value}" is reserved by Dart.`);
            this.values.push(value);
        }
    }

    /// Return resulting code for Enum.
    output() {
        return [
            `enum ${this.name} {`,
            ...this.values.map((value) => `${value},`),
            '}\n',
        ];
    }
}

export {Enum};