/* eslint-disable */
const copy = require('rollup-plugin-copy');
const { terser } = require('rollup-plugin-terser');
const typescript = require('rollup-plugin-typescript2');
const del = require('rollup-plugin-delete');
const generatePackageJson = require('rollup-plugin-generate-package-json');
const pkg = require('./package.json');

const peerDependencies =
	pkg.config?.lib?.peerDependencies?.reduce((peerDependencies, packageName) => {
		if (Object.keys(pkg.dependencies).includes(packageName)) {
			return {
				...peerDependencies,
				[packageName]: pkg.dependencies[packageName],
			};
		}

		if (Object.keys(pkg.devDependencies).includes(packageName)) {
			return {
				...peerDependencies,
				[packageName]: pkg.devDependencies[packageName],
			};
		}

		console.warn(
			'Cannot include ' + packageName + ' as a peer dependency. Unable to find package version.'
		);
		return peerDependencies;
	}, {}) ?? {};

console.log('Generated peer dependencies:\n' + JSON.stringify(peerDependencies));

module.exports = [
	{
		input: 'src/index.ts',
		plugins: [
			del({ targets: 'dist/*' }),
			typescript({
				typescript: require('typescript'),
			}),
			copy({
				targets: [
					{ src: 'README.md', dest: 'dist' },
					{ src: 'CHANGELOG.md', dest: 'dist' },
				],
			}),
			generatePackageJson({
				baseContents: (pkg) => ({
					...pkg,
					name: pkg.name,
					scripts: undefined,
					dependencies: {},
					devDependencies: {},
					peerDependencies,
					private: false,
					config: undefined,
				}),
			}),
			terser(),
		],
		output: [
			{
				name: pkg.name,
				file: `dist/${pkg.main}`,
				format: 'umd',
				sourcemap: true,
			},
			{ file: `dist/${pkg.module}`, format: 'es', sourcemap: true },
		],
	},
];
