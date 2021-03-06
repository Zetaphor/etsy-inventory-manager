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
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    NwBuilder = require('node-webkit-builder');

// Compile Sass
gulp.task('sass', function() {
    return gulp.src('scss/**/*.scss')
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sass({
            sourcemap: true,
            outputStyle: 'compressed',
            errLogToConsole: false,
            onError: function(err) {
                return notify().write(err);
            }
        }))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(autoprefixer('last 3 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(concat('main.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('../www/css'))
});

gulp.task('fileinclude', function() {
    gulp.src(['index.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        //.pipe(rename({extname: '.min.html'}))
        .pipe(gulp.dest('../www'));
});

gulp.task('images', function () {
    gulp.src('img/**/*.{png,jpg,jpeg,gif,svg}')
        .pipe(gulp.dest('../www/img'));
});

gulp.task('modules', function () {
    gulp.src('node_modules/materialize-css/**/*')
        .pipe(gulp.dest('../www/vendor/materialize-css'));

    gulp.src('node_modules/dexie/**/*')
        .pipe(gulp.dest('../www/vendor/dexie'));

    gulp.src('node_modules/moment/**/*')
        .pipe(gulp.dest('../www/vendor/moment'));

    gulp.src('node_modules/jquery/dist/**/*')
        .pipe(gulp.dest('../www/vendor/jquery'));

    gulp.src('node/**/*.js')
        .pipe(gulp.dest('../www/node'));

    gulp.src('vendor/**/*.js')
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('../www/vendor'));
});

// Compile JS
gulp.task('scripts', function() {
    return gulp.src(['js/**/*.js'])
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
        .pipe(gulp.dest('../www/js'))
});

// Watch files for changes
gulp.task('watch', function() {
    gulp.watch('**/*.html', ['fileinclude']);
    gulp.watch(['js/**/*.js'], ['scripts']);
    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('img/**/*', ['images']);
});

// Default Task
gulp.task('default', ['sass', 'scripts', 'fileinclude', 'modules', 'images', 'watch']);