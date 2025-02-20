import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default [
	{
		input: 'src/index.js',
		output: {
			file: 'dist/packme.min.js',
			format: 'es',
			sourcemap: !production
		},
		plugins: [
			production && terser()
		],
		watch: {
			clearScreen: false
		}
	},
	{
		input: 'src/compiler/index.js',
		output: {
			file: 'bin/compile.js',
			format: 'es',
			sourcemap: !production,
			banner: '#!/usr/bin/env node'
		},
		watch: {
			clearScreen: false
		}
	}
];
