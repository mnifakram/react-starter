const webpack = require('webpack');
const DashboardPlugin = require('webpack-dashboard/plugin');

const commonPaths = require('./paths');

module.exports = {
  mode: 'development',
  output: {
    filename: '[name].js',
    path: commonPaths.outputPath,
    chunkFilename: '[name].js',
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  devServer: {
    contentBase: commonPaths.outputPath,
    compress: true,
    hot: true,
    progress: true,
    port: 3001,
    historyApiFallback: true,
    open: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new DashboardPlugin({ port: 8000 }),
  ],
};
