// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    notify = require('gulp-notify'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    fileinclude = require('gulp-file-include'),
    concat = require('gulp-concat')

// Compile Sass
gulp.task('sass', function() {
    return gulp.src('scss/**/*.scss')
        .pipe(sass({
            sourcemap: true,
            outputStyle: 'compressed',
            errLogToConsole: true
        }))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(autoprefixer('last 3 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(concat('main.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./css'))
});

gulp.task('fileinclude', function() {
    gulp.src(['index.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(rename({extname: '.min.html'}))
        .pipe(gulp.dest('./'));
});

// Compile JS
gulp.task('scripts', function() {
    return gulp.src(['js/**/*.js', '!js/min/**/*'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'))
        .on('error', function (error) {
            //return 'JSHint failed, see console for details';
        })
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .on('error', notify.onError(function (error) {
            return error.message;
        }))
        .pipe(rename({extname: '.min.js'}))
        .pipe(sourcemaps.write('./_sourcemaps'))
        .pipe(gulp.dest('js/min'))
});

// Watch files for changes
gulp.task('watch', function() {
    gulp.watch('**/*.html', ['fileinclude']);
    gulp.watch('js/**/*.js', ['scripts']);
    gulp.watch('scss/**/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['sass', 'scripts', 'fileinclude', 'watch']);