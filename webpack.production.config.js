const path = require('path');

const nodeExternals = require('webpack-node-externals');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const buildDir = path.join(__dirname, '/build/');

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
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([buildDir])
  ]
};