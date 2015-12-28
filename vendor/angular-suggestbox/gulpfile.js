/**
 * Created by Ascarbek on 01.12.2015.
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

gulp.task('clean', function(){
    return del(['dist']);
});

/*
* Development
* */

gulp.task('build-dev', ['clean'], function(){
    return gulp.src('server/env.config.json')
        .pipe(replace('dist', 'src'))
        .pipe(gulp.dest('server'));
});

gulp.task('inject-dev', ['build-dev'], function(){
    return gulp.src('src/demo.html')
        .pipe(inject(series(
            gulp.src(['src/vendor/angular/angular.min.js'], {read : false}),
            gulp.src(['src/vendor/**/*min.js', '!src/vendor/angular/angular.min.js'], {read : false}),
            gulp.src(['src/js/module.js'], {read: false}),
            gulp.src(['src/js/*.js', '!src/js/module.js'], {read: false}),
            gulp.src(['src/demo/demo.js'], {read: false})
        ), {relative : true, ignorePath: 'src'}))
        .pipe(inject(
            gulp.src([
                'src/vendor/**/*min.css',
                'src/css/suggest.box.css',
                'src/demo/demo.css'
            ], {read: false}), {relative: true, ignorePath: 'src'}
        ))
        .pipe(gulp.dest('src'));
});

/*
* Production
* */

gulp.task('copy-prod', ['clean'], function(){
    return es.merge(
        gulp.src(['src/vendor/**/*min.js', 'src/vendor/**/*min.css'])
            .pipe(gulp.dest('dist/vendor')),
        gulp.src(['src/vendor/font-awesome/fonts/*'])
            .pipe(gulp.dest('dist/vendor/font-awesome/fonts'))
    );
});

gulp.task('build-prod', ['copy-prod'], function(){
    return es.merge(
        gulp.src('server/env.config.json')
            .pipe(replace('src', 'dist'))
            .pipe(gulp.dest('server')),
        es.merge(
            series(
                gulp.src(['src/js/module.js']),
                gulp.src(['src/js/*.js', '!src/js/module.js'])
            ).pipe(concat('suggest.box.js'))
                .pipe(gulp.dest('dist')),
            series(
                gulp.src(['src/js/module.js']),
                gulp.src(['src/js/*.js', '!src/js/module.js'])
            ).pipe(concat('suggest.box.min.js'))
                .pipe(uglify())
                .pipe(gulp.dest('dist'))
        ),es.merge(
            gulp.src('src/css/suggest.box.css')
                .pipe(gulp.dest('dist')),
            gulp.src('src/demo/demo.css')
                .pipe(gulp.dest('dist')),
            gulp.src('src/css/suggest.box.css')
                .pipe(concat('suggest.box.min.css'))
                .pipe(nano())
                .pipe(gulp.dest('dist'))
        ),
        gulp.src('src/demo/demo.js')
            .pipe(gulp.dest('dist'))
    );
});

gulp.task('inject-prod', ['build-prod'], function(){
    return gulp.src('src/demo.html')
        .pipe(inject(series(
            gulp.src(['dist/vendor/angular/angular.min.js'], {read : false}),
            gulp.src(['dist/vendor/**/*min.js', '!dist/vendor/angular/angular.min.js'], {read : false}),
            gulp.src(['dist/suggest.box.js'], {read: false}),
            gulp.src(['dist/demo.js'], {read: false})
        ), {relative : false, ignorePath: 'dist'}))
        .pipe(inject(series(
            gulp.src(['dist/vendor/**/*min.css'], {read: false}),
            gulp.src(['dist/suggest.box.css'], {read: false}),
            gulp.src(['dist/demo.css'], {read: false})
        ), {relative: false, ignorePath: 'dist'}))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['inject-prod']);
