const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const gulpClean = require('gulp-clean');

const config = require('./webpack.config');

gulp.task('clean', (cb) => {
  return gulp.src(config.buildDir, {read: false})
    .pipe(gulpClean());
});

gulp.task('build', (cb) => {
    webpack(config).run((err, info) => {
      if(err) {
        console.error('Error', err);
      } else {
        console.log(stats.toString());
      }

      cb();
    });
});

gulp.task('watch', (cb) => {
  webpack(config).watch(100, (err, stats) => {
    nodemon.restart();
    cb();
  });
});

gulp.task('run', ['watch'], () => {
  nodemon({
    execMap: {
      js: 'node'
    },
    script: path.join(__dirname, 'build/server.js'),
    ignore: ['*'],
    ext: 'noop'
  }).on('restart', () => {
    console.log('Patched!');
  });
});

gulp.task('default', ['clean', 'build', 'watch']);