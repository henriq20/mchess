import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import packageJson from './package.json' assert { type: 'json' };

export default [
	{
		input: 'src/index.ts',
		output: [
			{
				file: packageJson.main,
				format: 'esm',
				plugins: [ terser({ module: true }) ]
			},
			{
				file: packageJson.module,
				format: 'cjs',
				plugins: [ terser({ module: false }) ]
			}
		],
		plugins: [ typescript({ declaration: false }) ]
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
