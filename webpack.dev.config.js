const nodeExternals = require('webpack-node-externals');

module.exports = {
  context: __dirname,
  entry: './src/server.js',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: '/'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
};
