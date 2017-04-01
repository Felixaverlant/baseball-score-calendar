var gulp = require('gulp'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    concatCss = require('gulp-concat-css'),
    uglifycss = require('gulp-uglifycss'),
    concat = require('gulp-concat');

gulp.task('css', function() {
    return gulp.src([
            "node_modules/chosen-js/chosen.css",
            "node_modules/normalize.css/normalize.css",
            'src/css/**/*'
        ])
        .pipe(sass().on('error', sass.logError))
        .pipe(concatCss("bundle.css"))
        .pipe(uglifycss())
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('js', function() {

    return gulp.src([
          'node_modules/jquery/dist/jquery.min.js',
          'node_modules/d3/build/d3.min.js',
          'node_modules/chosen-js/chosen.jquery.js',
          'src/js/main.js',
          'src/js/viz.js'
        ])
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('dist/js/'));
});


gulp.task('watch', function() {
    gulp.watch('src/js/**/*', ['js']);
    gulp.watch('src/css/**/*', ['css']);
});

gulp.task('default', ['run', 'watch']);

gulp.task('run', ['css', 'js']);
