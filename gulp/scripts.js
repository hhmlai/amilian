'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var livereload = require('gulp-livereload');

var $ = require('gulp-load-plugins')();

gulp.task('scripts', function () {
  return gulp.src(path.join(conf.paths.src, '/app/**/*.js'))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.size())
});
