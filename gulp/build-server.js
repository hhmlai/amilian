'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'uglify-save-license', 'del']
});


gulp.task('other-server', function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src([
    path.join(conf.paths.src_main),
    path.join('!'+ conf.paths.src_client),
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist_main)));
});

gulp.task('build-server', ['other-server']);
