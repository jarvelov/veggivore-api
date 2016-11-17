const path = require('path');
const nodemon = require('nodemon');

const Webpack = require('webpack');
const webpackConfig = require('../webpack.dev.config.js');

// First we fire up Webpack and pass in the configuration
const compiler = Webpack(webpackConfig);

const startServer = () => {
  nodemon({
    execMap: {
      js: 'node'
    },
    script: path.join(__dirname, 'build/server.js'),
    ignore: ['*'],
    ext: 'noop'
  });
};

const restartServer = () => {
  nodemon.restart();
  console.log('Server restarted!');
};

let initialized = false;
compiler.plugin('done', () => {
  if (!initialized) {
    startServer();
    initialized = true;
  }
});

compiler.watch({
  aggregateTimeout: 300 // wait so long for more changes
}, (err, stats) => {
  if (err) {
    console.error(err);
  } else {
    restartServer();
  }
});
