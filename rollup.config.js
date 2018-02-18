import resolve from 'rollup-plugin-node-resolve'
// import commonjs from 'rollup-plugin-commonjs'

const external = ['aws-sdk', 'readline']

export default [
  {
    external,
    input: 'dist/src/index.js',
    output: [
      { file: 'dist/lib.cjs.js', format: 'cjs' },
      { file: 'dist/lib.es.js', format: 'es' },
    ],
    plugins: [
      resolve({
        module: true, // Default: true
        jsnext: true, // Default: false
        main: true, // Default: true
        extensions: ['.js'], // Default: ['.js']
        // Lock the module search in this path (like a chroot). Module defined
        // outside this path will be mark has external
        // jail: './', // Default: '/'
        // If true, inspect resolved files to check that they are
        // ES2015 modules
        // modulesOnly: true, // Default: false
      }),
      // commonjs({
      //   include: 'node_modules/**',
      // }),
    ],
  },
  {
    external,
    input: 'dist/src/cli.js',
    output: [{ file: 'dist/cli.js', format: 'cjs' }],
    plugins: [
      resolve({
        module: true, // Default: true
        jsnext: true, // Default: false
        main: true, // Default: true
        extensions: ['.js'], // Default: ['.js']
        // Lock the module search in this path (like a chroot). Module defined
        // outside this path will be mark has external
        // jail: './', // Default: '/'
        // If true, inspect resolved files to check that they are
        // ES2015 modules
        // modulesOnly: true, // Default: false
      }),
      // commonjs({
      //   include: 'node_modules/**',
      // }),
    ],
  },
]
