
const rollup = require('rollup');
const watch = require('rollup-watch');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const progress = require('rollup-plugin-progress');
const filesize = require('rollup-plugin-filesize');
const babel = require('rollup-plugin-babel');
const eslint = require('rollup-plugin-eslint');
const cleanup = require('rollup-plugin-cleanup');
const uglify = require('rollup-plugin-babel-minify');
const multientry = require('rollup-plugin-multi-entry');

export default {
  input:'./src/*/index.js',     // 必须
  plugins:[
      multientry(),
      resolve(),
      commonjs(),
      eslint(),
      babel({
          exclude: 'node_modules/**' , 
          runtimeHelpers: true 
        }),
      filesize(),
      progress({clearLine: false})
    ],
  output: {
      file: './dist/jfe.js', 
      format: 'umd', 
      name: 'JFE'
  }
};



