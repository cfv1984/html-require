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
      compress: {
        warnings: false,
        dead_code: true,
        conditionals: true,
        comparisons: true,
        evaluate: true,
        booleans: true,
        unused: true,
        loops: true,
        hoist_funs: true,
        cascade: true,
        if_return: true,
        join_vars: true,
      },
      mangle: {
        toplevel: true,
        sort: true,
        eval: true,
        properties: true
      },
      sourcemaps: false,
    })
  ],
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  }
}
