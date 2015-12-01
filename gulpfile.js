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
    _ = require('underscore');

gulp.task('clean', function(){
    return del(['dist']);
});

gulp.task('copy-dev', ['clean'], function(){
    return es.merge(
        gulp.src(['bower_components/**/*min.js'])
            .pipe(gulp.dest('dist/vendor')),
        gulp.src(['src/*.js'])
            .pipe(gulp.dest('dist/src')),
        gulp.src(['demo/demo.js'])
            .pipe(gulp.dest('dist'))
    );
});

gulp.task('inject-dev', ['copy-dev'], function(){
    return gulp.src('demo/index.html')
        .pipe(inject(series(
            gulp.src(['dist/vendor/angular/angular.min.js'], {read : false}),
            gulp.src(['dist/vendor/**/*min.js', '!dist/vendor/angular/angular.min.js'], {read : false}),
            gulp.src(['dist/src/module.js'], {read: false}),
            gulp.src(['dist/src/*.js', '!dist/src/module.js'], {read: false}),
            gulp.src(['dist/demo.js'], {read: false})
        ),{relative : false, ignorePath: 'dist'}))
        .pipe(gulp.dest('dist'));

});

gulp.task('build-dev', ['inject-dev']);

gulp.task('default', ['build-dev']);
