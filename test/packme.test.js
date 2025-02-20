import { PackMe } from 'packme';
import {
    packmeTestMessageFactory,
    TestMessage,
    SubObject,
    SubSubObject,
    NestedObject,
    TestEnum
} from './generated/packme-test.generated.js';

function generateTestMessage() {
    return new TestMessage(
        new Uint8Array([1,2,3,4,5,6,7,8,9,10,11,12]),
        new Uint8Array([1,2,3,4,5,6,7,8,9,10,11,12]),
        [
            new Uint8Array([1,2,3,4]),
            new Uint8Array([2,3,4,1]),
            new Uint8Array([3,4,1,2]),
            new Uint8Array([5,1,2,3])
        ],
        [
            new Uint8Array([1,2,3,4]),
            new Uint8Array([2,3,4,1]),
            new Uint8Array([3,4,1,2]),
            new Uint8Array([5,1,2,3])
        ],
        -128,
        255,
        -32768,
        65535,
        -2147483648,
        4294967295,
        -9223372036854775808n,
        9223372036854775807n,
        Infinity,
        Number.MAX_VALUE,
        true,
        "'👍 You're pretty good!",
        [9,8,7,6,5,4,3,2,1,0],
        TestEnum.two,
        new NestedObject(255, 'I am nested 😎'),
        [[1],[2,3],[4,5,6],[7,8,9,10]],
        new SubObject(128, 'I am inherited from nested 😎', Infinity),
        new SubSubObject(129, 'I am inherited from sub 😎', -Infinity, 1234567890),
        [
            new SubSubObject(100, '200', 300, 400),
            new NestedObject(1, '22'),
            new SubObject(3, '44',5.55)
        ],
        -128,
        255,
        -32768,
        65535,
        -2147483648,
        4294967295,
        -9223372036854775808n,
        9223372036854775807n,
        Infinity,
        Number.MAX_VALUE,
        true,
        "'👍 You're pretty good!",
        [9,8,7,6,5,4,3,2,1,0],
        TestEnum.two,
        new NestedObject(255, 'I am nested 😎'),
        [[1],[2,3],[4,5,6],[7,8,9,10]],
        new SubObject(128, 'I am inherited from nested 😎', Infinity),
        new SubSubObject(129, 'I am inherited from sub 😎', -Infinity, 1234567890),
        [
            new SubSubObject(100, '200', 300, 400),
            new NestedObject(1, '22'),
            new SubObject(3, '44',5.55)
        ]
    );
}

describe('PackMe', () => {
    test('PackMe.pack(PackMeMessage message) returns Uint8Array', () => {
        let packme = new PackMe();
        let data = packme.pack(generateTestMessage());
        expect(data).toBeInstanceOf(Uint8Array);
    });

    test('PackMe.unpack(Uint8Array data) returns TestMessage', () => {
        let packme = new PackMe((err, stack) => {
            console.error(err);
            if (stack) console.error(stack);
        });
        packme.register(packmeTestMessageFactory);
        let data = packme.pack(generateTestMessage());
        let message = packme.unpack(data);
        expect(message).toBeInstanceOf(TestMessage);
    });

    test('PackMe.unpack(PackMe.pack(message)) returns message with matching properties', () => {
        let packme = new PackMe();
        packme.register(packmeTestMessageFactory);
        let data = packme.pack(generateTestMessage());
        let message = packme.unpack(data);
        let sample = generateTestMessage();

        expect(message.reqId).toEqual(sample.reqId);
        expect(message.reqIds).toEqual(sample.reqIds);
        expect(message.reqInt8).toEqual(sample.reqInt8);
        expect(message.reqUint8).toEqual(sample.reqUint8);
        expect(message.reqInt16).toEqual(sample.reqInt16);
        expect(message.reqUint16).toEqual(sample.reqUint16);
        expect(message.reqInt32).toEqual(sample.reqInt32);
        expect(message.reqUint32).toEqual(sample.reqUint32);
        expect(message.reqInt64).toEqual(sample.reqInt64);
        expect(message.reqUint64).toEqual(sample.reqUint64);
        expect(message.reqFloat).toEqual(sample.reqFloat);
        expect(message.reqDouble).toEqual(sample.reqDouble);
        expect(message.reqBool).toEqual(sample.reqBool);
        expect(message.reqString).toEqual(sample.reqString);
        expect(message.reqList).toEqual(sample.reqList);
        expect(message.reqEnum).toEqual(sample.reqEnum);
        expect(message.reqNested.a).toEqual(sample.reqNested.a);
        expect(message.reqNested.b).toEqual(sample.reqNested.b);
        expect(message.reqNestedList).toEqual(sample.reqNestedList);
        expect(message.reqInherited.constructor.name).toEqual('SubObject');
        expect(message.reqInherited.a).toEqual(sample.reqInherited.a);
        expect(message.reqInherited.b).toEqual(sample.reqInherited.b);
        expect(message.reqInherited.c).toEqual(sample.reqInherited.c);
        expect(message.reqInheritedMore.constructor.name).toEqual('SubSubObject');
        expect(message.reqInheritedMore.a).toEqual(sample.reqInheritedMore.a);
        expect(message.reqInheritedMore.b).toEqual(sample.reqInheritedMore.b);
        expect(message.reqInheritedMore.c).toEqual(sample.reqInheritedMore.c);
        expect(message.reqInheritedMore.d).toEqual(sample.reqInheritedMore.d);
        expect(message.reqMixedInherited[0] instanceof SubSubObject).toBe(true);
        expect(message.reqMixedInherited[2] instanceof SubObject).toBe(true);
        expect(message.optId).toEqual(sample.optId);
        expect(message.optIds).toEqual(sample.optIds);
        expect(message.optInt8).toEqual(sample.optInt8);
        expect(message.optUint8).toEqual(sample.optUint8);
        expect(message.optInt16).toEqual(sample.optInt16);
        expect(message.optUint16).toEqual(sample.optUint16);
        expect(message.optInt32).toEqual(sample.optInt32);
        expect(message.optUint32).toEqual(sample.optUint32);
        expect(message.optInt64).toEqual(sample.optInt64);
        expect(message.optUint64).toEqual(sample.optUint64);
        expect(message.optFloat).toEqual(sample.optFloat);
        expect(message.optDouble).toEqual(sample.optDouble);
        expect(message.optBool).toEqual(sample.optBool);
        expect(message.optString).toEqual(sample.optString);
        expect(message.optList).toEqual(sample.optList);
        expect(message.optEnum).toEqual(sample.optEnum);
        expect(message.optNested.a).toEqual(sample.optNested.a);
        expect(message.optNested.b).toEqual(sample.optNested.b);
        expect(message.optNestedList).toEqual(sample.optNestedList);
        expect(message.optInherited.constructor.name).toEqual('SubObject');
        expect(message.optInherited.a).toEqual(sample.optInherited.a);
        expect(message.optInherited.b).toEqual(sample.optInherited.b);
        expect(message.optInherited.c).toEqual(sample.optInherited.c);
        expect(message.optInheritedMore.constructor.name).toEqual('SubSubObject');
        expect(message.optInheritedMore.a).toEqual(sample.optInheritedMore.a);
        expect(message.optInheritedMore.b).toEqual(sample.optInheritedMore.b);
        expect(message.optInheritedMore.c).toEqual(sample.optInheritedMore.c);
        expect(message.optInheritedMore.d).toEqual(sample.optInheritedMore.d);
        expect(message.optMixedInherited[0] instanceof SubSubObject).toBe(true);
        expect(message.optMixedInherited[2] instanceof SubObject).toBe(true);
    });
});
