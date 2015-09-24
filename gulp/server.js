'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var run = require('gulp-run');

gulp.task('serve', ['watch'], function () {
   run('node_modules/.bin/electron src').exec();
});

gulp.task('serve:dist', ['build'], function () {
   run('node_modules/.bin/electron dist').exec();
});

