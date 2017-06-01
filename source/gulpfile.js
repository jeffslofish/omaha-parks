var gulp 		= require('gulp');
var sass 		= require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref 		= require('gulp-useref');
var uglify 		= require('gulp-uglify');
var gulpIf 		= require('gulp-if');
var runSequence = require('run-sequence');

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  })
})

gulp.task('sass', function() {
  return gulp.src('app/css/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
    .pipe(gulp.dest('app/css')) // Outputs it in the css folder
});

// Watchers
// gulp.task('watch', function() {
//   gulp.watch('app/scss/**/*.scss', ['sass']);
//   gulp.watch('app/*.html', browserSync.reload);
//   gulp.watch('app/js/**/*.js', browserSync.reload);
// })

// Optimization Tasks 
// ------------------

// Optimizing CSS and JavaScript 
gulp.task('useref', function() {

  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'));
});

// Cleaning 
gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
})

// Build Sequences
// ---------------
// 'gulp serve' -- open site in browser and watch for changes
// in source files and update them when needed
gulp.task('serve', (done) => {
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
  done();

  // watch various files for changes
  gulp.watch('app/css/**/*.scss', ['sass']);
  gulp.watch('app/*.html');
  gulp.watch('app/js/**/*.js');
});

gulp.task('default', ['sass', 'useref', 'serve']);

// gulp.task('default', ['watch', 'scripts', 'images']);


