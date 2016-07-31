'use strict';
var gulp = require('gulp');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var please = require('gulp-pleeease');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');

var SRC_ROOT = 'client/src';
var DIST_ROOT = 'public';

var options = {
  styles: {
    sass: {
      errLogToConsole: true,
      indentedSyntax: true
    },
    please: {
      minifier: false,
      autoprefixer: {
        browsers: [
          'last 4 version',
          'ie 8',
          'iOS 4',
          'Android 2.3'
        ]
      }
    }
  },
  scripts: {
    browserify: {
      entries: [SRC_ROOT + '/scripts/index.js'],
      transform: ['babelify'],
      extensions: ['.jsx', '.js']
    },
    watchify: {
      entries: [SRC_ROOT + '/scripts/index.js'],
      transform: ['babelify'],
      debug: true,
      extensions: ['.jsx', '.js'],
      cache: {},
      packageCache: {},
      plugin: [watchify]
    }
  },
  server: {
    browserSync: {
      // server: {
      //   baseDir: DIST_ROOT
      // },
      proxy: 'localhost:3000',
      notify: false,
      open: true
    }
  }
};

function buildMarkups(isWatch) {
  function build() {
    console.log('build: markups');
    return gulp.src([SRC_ROOT + '/index.jade', SRC_ROOT + '/styleguide.jade'])
      .pipe(plumber())
      .pipe(jade())
      .pipe(gulp.dest(DIST_ROOT))
      .pipe(browserSync.reload({ stream: true }));
  }

  if (isWatch) {
    return function() {
      build();
      gulp.watch([SRC_ROOT + '/index.jade', SRC_ROOT + '/styleguide.jade'], build);
    };
  } else {
    return function() {
      build();
    };
  }
}

function buildStyles(isWatch) {
  function build() {
    console.log('build: styles');
    return gulp.src(SRC_ROOT + '/styles/**/index.sass')
      .pipe(plumber())
      .pipe(sass(options.styles.sass))
      .pipe(please(options.styles.please))
      .pipe(gulp.dest(DIST_ROOT))
      .pipe(browserSync.reload({ stream: true }));
  }

  if (isWatch) {
    return function() {
      build();
      gulp.watch(SRC_ROOT + '/styles/**/*.sass', build);
    };
  } else {
    return function() {
      build();
    };
  }
}

function buildScripts(isWatch) {
  var options_ = (isWatch) ? options.scripts.watchify : options.scripts.browserify;
  var bundler = browserify(options_);

  function build() {
    return function() {
      console.log('build: scripts');
      bundler
        .bundle()
        .on('error', function(error) {
          console.error(error.message);
        })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(DIST_ROOT))
        .pipe(browserSync.reload({ stream: true }));
    };
  }

  bundler.on('update', build());
  return build();
}

function buildImages() {
  return gulp.src([SRC_ROOT + '/**/*.{png,jpg,gif}'])
    .pipe(plumber())
    .pipe(gulp.dest(DIST_ROOT));
}

function buildFiles() {
  return gulp.src([SRC_ROOT + '/**/*.{csv,json}'])
    .pipe(gulp.dest(DIST_ROOT));
}

function runServer() {
  return browserSync.init(null, options.server.browserSync);
}

// tasks
gulp.task('build:markups', buildMarkups(false));
gulp.task('watch:markups', buildMarkups(true));
gulp.task('build:styles', buildStyles(false));
gulp.task('watch:styles', buildStyles(true));
gulp.task('build:scripts', buildScripts(false));
gulp.task('watch:scripts', buildScripts(true));
gulp.task('build:images', buildImages);
gulp.task('build:files', buildFiles);
gulp.task('build', ['build:markups', 'build:styles', 'build:scripts', 'build:images', 'build:files']);
gulp.task('watch', ['watch:markups', 'watch:styles', 'watch:scripts', 'build:images', 'build:files']);
gulp.task('server', runServer);
gulp.task('develop', ['server', 'watch']);
