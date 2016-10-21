const gulp = require('gulp');
const gutil = require('gulp-util');
const nodemon = require('nodemon');
const webpack = require('webpack');

const config = require('./webpack.config');

gulp.task('webpack:build', (cb) => {
  let called = false;
  webpack(config).watch(100, (err, info) => {
    if (err) {
      throw new gutil.PluginError("webpack:build", err);
    }
    gutil.log("[webpack:build]", info.toString({
      colors: true
    }));

    if (!called) {
      called = true;
      cb();
    }

    nodemon.restart();
  });
});

gulp.task('run', ['webpack:build'], () => {
  nodemon({
    execMap: {
      js: 'node'
    },
    script: config.output.path + config.output.filename,
    ignore: ['*'],
    ext: 'noop'
  });
});

gulp.task('default', ['run']);