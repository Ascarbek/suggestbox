/**
 * Created by Ascarbek on 28.12.2015.
 */

var gulp = require('gulp'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    nano = require('gulp-cssnano'),
    inject = require('gulp-inject'),
    es = require('event-stream'),
    series = require('stream-series'),
    ngTemplates = require('gulp-ng-templates'),
    replace = require('gulp-replace'),
    _ = require('underscore');

gulp.task('inject-prod', function(){
    return gulp.src('index.html')
        .pipe(inject(series(
            gulp.src(['vendor/angular/angular.min.js'], {read : false}),
            gulp.src(['vendor/**/*min.js', '!vendor/angular/angular.min.js'], {read : false}),
            gulp.src(['app/demo.js'], {read: false}),
            gulp.src(['app/**/*.js', '!app/demo.js'], {read: false})
        ), {relative : true}))
        .pipe(inject(series(
            gulp.src(['vendor/**/*min.css'], {read: false}),
            gulp.src(['app/**/*.css'], {read: false})
        ), {relative: true}))
        .pipe(gulp.dest('.'));
});

gulp.task('default', ['inject-prod']);
