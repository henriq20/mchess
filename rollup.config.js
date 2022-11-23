import dts from 'rollup-plugin-dts';
import typescript from '@rollup/plugin-typescript';
import packageJson from './package.json' assert { type: 'json' };

export default [
	{
		input: 'src/index.ts',
		output: [
			{
				file: packageJson.main,
				format: 'esm'
			},
			{
				file: packageJson.module,
				format: 'cjs'
			}
		],
		plugins: [
			typescript({
				declaration: false
			})
		]
	},
	{
		input: 'src/index.ts',
		output: {
			file: 'dist/types.d.ts',
			format: 'es'
		},
		plugins: [ dts() ]
	}
];
