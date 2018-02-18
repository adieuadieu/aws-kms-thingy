import hashbang from 'rollup-plugin-hashbang'
import resolve from 'rollup-plugin-node-resolve'

const external = ['aws-sdk', 'readline']

const plugins = [
  hashbang(),
  resolve({
    extensions: ['.js'],
    jsnext: true,
    main: true,
    module: true,
  }),
]

export default [
  {
    external,
    input: 'dist/src/index.js',
    output: [
      { file: 'dist/lib.cjs.js', format: 'cjs' },
      { file: 'dist/lib.es.js', format: 'es' },
    ],
    plugins,
  },
  {
    external,
    input: 'dist/src/cli.js',
    output: [{ file: 'dist/cli.js', format: 'cjs' }],
    plugins,
  },
]
