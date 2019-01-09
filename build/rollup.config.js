const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve'); // 解析node_modules第三方以来关系
const commonjs = require('rollup-plugin-commonjs'); // 处理非ES6的模块，如CommonJS的模块
const progress = require('rollup-plugin-progress'); // 展示打包进度
const filesize = require('rollup-plugin-filesize'); // 在CLI显示文件大小
const babel = require('rollup-plugin-babel');
const eslint = require('rollup-plugin-eslint');
const cleanup = require('rollup-plugin-cleanup');
const uglify = require('rollup-plugin-babel-minify');
const config = require('./config')
// const isDev = process.env.DEV === "dev";
let params = {}

process.argv.forEach((item, index) => {
  let newitem = item.replace(/\\s/ig, '')
  let paramsArray = newitem.split('=')
  if (paramsArray.length === 2 && paramsArray[0]) {
    params[paramsArray[0]] = paramsArray[1]
  }
})

// see below for details on the options
const inputOptions = {
  input: './src/index.js',
  plugins: [
    resolve(),
    commonjs(),
    eslint(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true
    }),
    cleanup({
      comments: 'all'
    }),
    filesize(),
    progress({
      clearLine: false
    })
  ]
};
const inputOptionsMinify = {
  input: './src/index.js',
  plugins: [
    resolve(),
    commonjs(),
    eslint(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true
    }),
    cleanup({
      maxEmptyLines: 1
    }),
    uglify(),
    filesize(),
    progress({
      clearLine: false
    })
  ]
};
const outputOptions = {
  file: `./dist/jfe.${params.format || 'esm'}.js`,
  format: params.format || 'es',
  banner: config.banner,
  name: params.name || ''
};
const outputOptionsMinify = {
  file: `./dist/jfe.${params.format || 'esm'}.min.js`,
  format: params.format || 'es',
  banner: config.banner,
  name: params.name || ''
};
async function build() {
  const bundle = await rollup.rollup(inputOptions);
  const bundleMinify = await rollup.rollup(inputOptionsMinify);

  await bundle.write(outputOptions);
  await bundleMinify.write(outputOptionsMinify);
}
build();