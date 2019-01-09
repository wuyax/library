'use strict';
var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var del = require('del');
var connect = require('gulp-connect');
var jsdoc = require('gulp-jsdoc3');
var babel = require('rollup-plugin-babel');
var babel = require('rollup-plugin-babel');
var uglify2 = require('rollup-plugin-uglify');
var rollup = require('rollup');
var commonjs = require('rollup-plugin-commonjs');
var minify = require('rollup-plugin-babel-minify');
var resolve = require('rollup-plugin-node-resolve');
var minimist = require('minimist');



var DEMO_PATH = path.join(__dirname, 'docdash');
var DEMO_TEMPLATE_PATH = __dirname;
var DEMO_DESTINATION_PATH = 'docs';



/**
 * Watch file paths
 * @type {string[]}
 */
var watchPaths = [
    'src/**/**/**.js',
    'src/**/*.js',
    'src/*.js',
    'build/docdash/publish.js'
];



gulp.task('doc', function (cb) {
    var config = require('./build/docdash/fixtures/fixtures.conf.json');
    gulp.src(['README.md', './src/**/*.js'], {read: false})
        .pipe(jsdoc(config, cb));
});
/**
 * Reload server
 */
gulp.task('reload', ['doc'], function() {
    return gulp.src(watchPaths)
        .pipe(connect.reload())
});

/**
 * Regenerate demo document when a file changes
 */
gulp.task('watch', ['doc'], function() {
    var watcher = gulp.watch(watchPaths, ['doc', 'reload']);
    watcher.on('change', function(event) {
        console.log('File: ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

/**
 * Run web server
 */
gulp.task('connect', ['doc'], function() {
    connect.server({
        root: DEMO_DESTINATION_PATH,
        livereload: true,
        port:8123
    });
});


gulp.task('serve', ['connect', 'watch']);



/**
 * @command gulp del
 * Delete all demo-doc files
 */
gulp.task('del', function() {
    return del([DEMO_DESTINATION_PATH]);
});
