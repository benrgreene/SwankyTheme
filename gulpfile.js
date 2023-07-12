const gulp                 = require('gulp');
const { series, parallel } = require('gulp');
const flatten              = require('gulp-flatten');
const fs                   = require("fs");
const watch                = require('gulp-watch');
const themeKit             = require('@shopify/themekit');
const touch                = require('gulp-touch-fd');
const through              = require('through2');
const browserSync          = require('browser-sync').create();
const reload               = browserSync.reload;
const readConfig           = require('read-config');
const config               = readConfig('./config.yml');
const sass                 = require('gulp-sass');
sass.compiler              = require('node-sass');
const webpack              = require('webpack');
const webpackConfig        = require('./webpack.config.js');

/*
 * ---------------------------------
 * Scripts
 * ---------------------------------
 */
const buildAssets = (cb) => {
  return new Promise((resolve, reject) => {
    // check if we should be in production mode
    if (config.development.mode && config.development.mode === 'production') {
      webpackConfig.mode = 'production';
    }

    webpack(webpackConfig, (err, stats) => {
      if (err) {
        console.log(err);
      }
      if (stats.hasErrors()) {
        console.log(new Error(stats.compilation.errors.join('\n')));
      }
      resolve();
    })
  })
};


/*
 * ---------------------------------
 * Liquid & Assets
 * ---------------------------------
 */
const gulpLiquid = () => {
  const directories = ['layout', 'snippets', 'sections', 'assets', 'config', 'locales'];
  directories.forEach((directory) => {
    // Cannot flatten templates since customer account templates
    // need to be in the 'customers' directory
    if (directory === 'templates') {
      gulp.src(`src/${directory}/**/*.*`)
        .pipe(gulp.dest(`dist/${directory}/`));
    } else {
      gulp.src(`src/${directory}/**/*.*`)
        .pipe(flatten())
        .pipe(gulp.dest(`dist/${directory}/`));
    }
  });
};


/*
 * ---------------------------------
 * Styling
 * ---------------------------------
 */
const gulpStyles = () => {
  return gulp.src('src/styles/theme.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/assets'));
};


/*
 * ---------------------------------
 * Browser Sync
 * ---------------------------------
 */
const initSync = () => {
  browserSync.init({
    directory: true,
    https: true,
    reloadDelay: 2500,
    proxy: `https://${config.development.store_proxy}?preview_theme_id=${config.development.theme_id}`,
    snippetOptions: {
      rule: {
        match: /<\/body>/i,
        fn: function (snippet, match) {
          return snippet + match;
        }
      }
    }
  })
};


/*
 * ---------------------------------
 * Public Tasks
 * ---------------------------------
 */
const gulpBuild = () => {
  gulpLiquid();
  return buildAssets();
};

const gulpWatch = () => {
  watch('src/**/*.*', gulpBuild)
    .on('change', reload);

  return new Promise((resolve, reject) => resolve());
};

const themeDeploy = () => themeKit.command('deploy');
const themeWatch = () => themeKit.command('watch', {
  'notify': '/var/tmp/theme_ready'
});

gulp.task('build', series(gulpBuild, themeDeploy));
gulp.task('watch', parallel(buildAssets, gulpWatch, themeWatch, initSync));