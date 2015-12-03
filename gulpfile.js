/**
 * Created by Ascarbek on 01.12.2015.
 */

var gulp = require('gulp'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    minifyCss = require('gulp-minify-css'),
    inject = require('gulp-inject'),
    es = require('event-stream'),
    series = require('stream-series'),
    ngTemplates = require('gulp-ng-templates'),
    replace = require('gulp-replace'),
    _ = require('underscore');

gulp.task('clean', function(){
    return del(['dist']);
});

gulp.task('inject-dev', ['clean'], function(){
    return gulp.src('src/demo.html')
        .pipe(inject(series(
            gulp.src(['src/vendor/angular/angular.min.js'], {read : false}),
            gulp.src(['src/vendor/**/*min.js', '!src/vendor/angular/angular.min.js'], {read : false}),
            gulp.src(['src/js/module.js'], {read: false}),
            gulp.src(['src/js/*.js', '!src/js/module.js'], {read: false}),
            gulp.src(['src/demo/demo.js'], {read: false})
        ), {relative : false, ignorePath: 'src'}))
        .pipe(inject(series(
            gulp.src(['src/vendor/**/*min.css'], {read: false}),
            gulp.src(['src/css/*.css'], {read: false})
        ), {relative: false, ignorePath: 'src'}))
        .pipe(gulp.dest('src'));
});

gulp.task('build-dev', ['inject-dev'], function(){
    return gulp.src('server/env.config.json')
        .pipe(replace('dist', 'src'))
        .pipe(gulp.dest('server'));
});

gulp.task('default', ['build-dev']);
