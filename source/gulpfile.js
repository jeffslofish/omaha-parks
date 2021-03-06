/*!
 * gulp
 * $ npm install gulp-ruby-sass gulp-autoprefixer gulp-cssnano gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */

// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    sequence = require('run-sequence');;

// Styles
gulp.task('styles', function() {
  return sass('app/css/style.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('app/js/**/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

// HTML
gulp.task('html', function() {
  return gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
});

// Clean
gulp.task('clean', function() {
  return del(['dist']);
});

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'scripts', 'html');
  // sequence('styles', 'scripts', 'watch');
});

// Watch
gulp.task('watch', function() {
  gulp.watch('app/css/**/*.scss', ['styles']);
  gulp.watch('app/js/**/*.js', ['scripts']);
  gulp.watch('app/*.html', ['html']);

  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', livereload.changed);

    // Create LiveReload server
  browserSync.init({
    // tunnel: true,
    // open: false,
    port: 8000,
    ui: {
      port: 8001
    },
    server: {
      baseDir: 'app'
    }
  });
});


gulp.task('serve', function() {
  // Create LiveReload server
  browserSync.init({
    // tunnel: true,
    // open: false,
    port: 8000,
    ui: {
      port: 8001
    },
    server: {
      baseDir: 'dist'
    }
  });
});
