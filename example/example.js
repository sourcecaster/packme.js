import { PackMe, PackMeMessage } from '../dist/packme.min.js';
import { TestMessage, NestedObject, TypeEnum, exampleMessageFactory } from './generated/example.generated.js';

console.log('ok');
let pm = new PackMe(console.error);
pm.register(exampleMessageFactory);
let msg = new TestMessage(
	new Uint8Array([1,2,3,4,5,6,7,8,9,10,11,12]),
	new Uint8Array([201,202,203,204,205,206,207,208,209,210,211,212]),
	[new Uint8Array([10, 20, 30, 40]), new Uint8Array([210, 220, 230, 240])],
	[new Uint8Array([4, 3, 2, 1]), new Uint8Array([40, 30, 20, 10]), new Uint8Array([255, 255, 255, 255])],
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
console.log(msg.toString())
console.log(data = pm.pack(msg));
console.log(pm.unpack(data).toString());
