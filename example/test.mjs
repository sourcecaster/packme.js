import {PackMe, PackMeMessage} from "../lib/packme.mjs";
import {TestMessage, NestedObject, TypeEnum, exampleMessageFactory} from "./generated/example.generated.mjs";

console.log('ok');
let pm = new PackMe(console.error);
pm.register(exampleMessageFactory);
let msg = new TestMessage(
	23,
	1,
	3.3,
	true,
	'something new',
	24,
	2,
	4.4,
	false,
	'whatever',
	[1,2,3,4,5],
	[9,8,7,6,5,4,3,2,1,0],
	TypeEnum.one,
	TypeEnum.four,
	new NestedObject(123, 'la-la-la'),
	new NestedObject(255, 'oops')
);

let data;
console.log(data = pm.pack(msg));
console.log(pm.unpack(data));
