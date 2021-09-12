import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default [
	{
		input: 'lib/packme.js',
		output: {
			sourcemap: true,
			format: 'iife',
			name: 'packme',
			file: 'build/packme.min.js'
		},
		plugins: [
			production && terser()
		],
		watch: {
			clearScreen: false
		}
	},
	{
		input: 'lib/compiler.js',
		output: {
			sourcemap: true,
			format: 'iife',
			name: 'compiler',
			file: 'build/compile.min.js'
		},
		plugins: [
			production && terser()
		],
		watch: {
			clearScreen: false
		}
	}
];
