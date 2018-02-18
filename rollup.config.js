import resolve from 'rollup-plugin-node-resolve'
// import commonjs from 'rollup-plugin-commonjs'

const external = ['aws-sdk', 'readline']

const plugins = [
  resolve({
    extensions: ['.js'], // Default: ['.js']
    jsnext: true, // Default: false
    main: true, // Default: true
    module: true, // Default: true
  }),
  // commonjs({
  //   include: 'node_modules/**',
  // }),
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
