'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var run = require('gulp-run');

gulp.task('serve', ['watch'], function () {
   run('electron src').exec();
});

gulp.task('serve:dist', ['build'], function () {
   run('electron dist').exec();
});

