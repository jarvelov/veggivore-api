const path = require('path');
const nodeExternals = require('webpack-node-externals');
const srcDir = path.join(__dirname, 'src');
const buildDir = path.join(__dirname, '/build/');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const JsDocPlugin = require('jsdoc-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: './src/server.js',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: buildDir,
    filename: 'server.js'
  },
  module: {
    preLoaders: [{
      test: /\.js$/,
      loader: 'eslint',
      include: srcDir,
      exclude: /node_modules/
    }],
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
  plugins: [
    new CleanWebpackPlugin([buildDir]),
    new JsDocPlugin({
      conf: './jsdoc.conf'
    })
  ],
  production: true
};
