const path = require('path');
const nodeExternals = require('webpack-node-externals');
const buildDir = path.join(__dirname, 'build');

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: './src/server.js',
  target: 'node',
  watch: true,
  externals: [nodeExternals()],
  output: {
    path: buildDir,
    filename: 'server.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  plugins: [
    new CleanWebpackPlugin([buildDir]),
    new webpack.BannerPlugin('require("source-map-support").install();', {
      raw: true,
      entryOnly: false
    })
  ]
};
