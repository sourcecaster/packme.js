import compile from '../bin/compile.js';
import {
	compilerTestMessageFactory,
	SendInfoMessage,
	GetDataResponse,
	GetDataRequest,
	GetDataResponseItem,
	InfoEntity,
	InfoSubclass,
	HalfLifeVersion
} from './generated/compiler-test.generated.js';
import { test, expect } from 'vitest';

test('Compiler run check: run compiler with test args', () => {
	compile(['--test', 'test/packme', 'test/generated']);
});

test('compilerTestMessageFactory contains SendInfoMessage, GetDataResponse, GetDataRequest', () => {
	expect(compilerTestMessageFactory[511521838]).toBeDefined();
	expect(compilerTestMessageFactory[160528308]).toBeDefined();
	expect(compilerTestMessageFactory[845589919]).toBeDefined();
});

test('compilerTestMessageFactory returns proper instances', () => {
	expect(compilerTestMessageFactory[511521838]()).toBeInstanceOf(SendInfoMessage);
	expect(compilerTestMessageFactory[160528308]()).toBeInstanceOf(GetDataResponse);
	expect(compilerTestMessageFactory[845589919]()).toBeInstanceOf(GetDataRequest);
});

test('PackMeMessage.$estimate() returns required buffer length in bytes', () => {
	// Construct a SendInfoMessage using positional parameters.
	let sendInfoMessage = new SendInfoMessage(
		[2, 4],
		[''],
		HalfLifeVersion.two,
		new InfoEntity('Alyx', 19, true, HalfLifeVersion.four),
		new InfoSubclass('Alyx Vance', 19, false, HalfLifeVersion.two, 1, 'Doctor Freeman, I presume?')
	);
	let getDataRequest = new GetDataRequest([1, 7]);
	let getDataResponse = getDataRequest.$response([
		new GetDataResponseItem('impulse', 101, null, HalfLifeVersion.one),
		new GetDataResponseItem('impulse', 203, false, HalfLifeVersion.one),
		new GetDataResponseItem(),
		new GetDataResponseItem(null, null, true)
	]);

	expect(sendInfoMessage.$estimate()).toEqual(103);
	expect(getDataResponse.$estimate()).toEqual(50);
	expect(getDataRequest.$estimate()).toEqual(15);
});
