
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
const compress = process.env.compress=="compress"?true:false
const format = process.env.format?process.env.format:'umd' 
const name = process.env.name?process.env.name:'JFE' 
const enter = process.env.enter?process.env.enter:'./src/index.js' 
const output = process.env.output?process.env.output:'./dist/bundle.js' 
// see below for details on the options

const inputOptions = {
   input:enter,
    plugins: [
      resolve(),
      commonjs(),
      eslint(),
      babel({
          exclude: 'node_modules/**' , 
          runtimeHelpers: true 
        }),
      compress?cleanup():'',
      compress?uglify():'',
      
    ]
 
};
const outputOptions = {
      file: output, 
      format: format, 
      name: name, 
};
async function build() {
  const bundle = await rollup.rollup(inputOptions);
  await bundle.write(outputOptions);
}

build();

