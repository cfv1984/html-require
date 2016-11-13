var webpack = require("webpack");

module.exports = {
  entry: './src/entry.ts',
  output: {
    filename: './dist/html-require.min.js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: true,
      sourcemaps: true
    })
  ],
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  }
}
