import buble from 'rollup-plugin-buble';

var external = Object.keys(require('./package.json').dependencies);

export default {
	input: 'src/index.js',
	output: [
		{ file: 'dist/rollup-plugin-merge-and-inject-css.cjs.js', format: 'cjs'},
		{ file: 'dist/rollup-plugin-merge-and-inject-css.es.js', format: 'es'}
	],
	external: external,
	plugins: [buble()]
};
