const fs = require('fs');
const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const progress = require('rollup-plugin-progress');
const filesize = require('rollup-plugin-filesize');
const babel = require('rollup-plugin-babel');
const eslint = require('rollup-plugin-eslint');
const cleanup = require('rollup-plugin-cleanup');
const uglify = require('rollup-plugin-babel-minify');
const config = require('./config')

let fileList = [],
fileListMinfy = [],
params = {}

process.argv.forEach((item, index) => {
    let newitem = item.replace(/\\s/ig, '')
    let paramsArray = newitem.split('=')
    if (paramsArray.length === 2 && paramsArray[0]) {
        params[paramsArray[0]] = paramsArray[1]
    }
})

fs.readdir('./src/', function (err, files) {
    files.map(async function (v, i) {
        if (v != '.DS_Store' && v != 'common' && v != 'index.js' && v != '.babelrc') {
            fileList[i] = await rollup.rollup({
                input: `./src/${v}/index.js`,
                plugins: [
                    resolve(),
                    commonjs(),
                    eslint(),
                    babel({
                        plugins: ['transform-class-properties'],
                        exclude: 'node_modules/**',
                        runtimeHelpers: true
                    }),
                    filesize(),
                    progress({
                        clearLine: false
                    })
                ],
            });
            await fileList[i].write({
                file: `./dist/jfe.${v}.${params.format || 'esm'}.js`,
                format: params.format || 'es',
                banner: config.banner,
                name: params.name || ''
            });
            fileListMinfy[i] = await rollup.rollup({
                input: `./src/${v}/index.js`,
                plugins: [
                    resolve(),
                    commonjs(),
                    eslint(),
                    babel({
                        plugins: ['transform-class-properties'],
                        exclude: 'node_modules/**',
                        runtimeHelpers: true
                    }),
                    cleanup(),
                    uglify(),
                    filesize(),
                    progress({
                        clearLine: false
                    })
                ],
            });
            await fileListMinfy[i].write({
                file: `./dist/jfe.${v}.${params.format || 'esm'}.min.js`,
                format: params.format || 'es',
                banner: config.banner,
                name: params.name || ''
            });
        }
    })
})