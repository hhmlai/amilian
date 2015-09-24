'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var livereload = require('gulp-livereload');

function isOnlyChange(event) {
  return event.type === 'changed';
}

gulp.task('reload', function () {
  return livereload.reload();
});
  
gulp.task('watch', ['inject'], function () {
  livereload.listen()
  
  gulp.watch([path.join(conf.paths.src, '/*.html'), 'bower.json'], ['inject']);

  gulp.watch(path.join(conf.paths.src, '/app/**/*.css'), function(event) {
    if(isOnlyChange(event)) {
      gulp.start('reload');
    } else {
      gulp.start('reload',['inject']);
    }
  });

  gulp.watch(path.join(conf.paths.src, '/app/**/*.js'), function(event) {
    if(isOnlyChange(event)) {
      gulp.start('reload',['scripts']);
    } else {
      gulp.start('reload',['inject']);
    }
  });

  gulp.watch(path.join(conf.paths.src, '/app/**/*.html'), function(event) {
      gulp.start('reload');
  });
});
