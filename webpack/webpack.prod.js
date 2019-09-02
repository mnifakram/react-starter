const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const S3Uploader = require('webpack-s3-uploader');
const WebpackRedisPlugin = require('webpack-redis-plugin');
const HtmlWebpackPrefixPlugin = require('html-webpack-prefix-plugin');

const commonPaths = require('./paths');

module.exports = {
  mode: 'production',
  output: {
    filename: `${commonPaths.jsFolder}/[name].[hash].js`,
    path: commonPaths.outputPath,
    chunkFilename: `${commonPaths.jsFolder}/[name].[chunkhash].js`,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin(),
    ],
    // Automatically split vendor and commons
    // https://twitter.com/wSokra/status/969633336732905474
    // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'initial',
        },
        async: {
          test: /[\\/]node_modules[\\/]/,
          name: 'async',
          chunks: 'async',
          minChunks: 4,
        },
      },
    },
    // Keep the runtime chunk seperated to enable long term caching
    // https://twitter.com/wSokra/status/969679223278505985
    runtimeChunk: true,
  },

  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              localsConvention: 'camelCase',
              modules: {
                localIdentName: '[local]___[hash:base64:5]',
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new MiniCssExtractPlugin({
      filename: `${commonPaths.cssFolder}/[name].css`,
      chunkFilename: `${commonPaths.cssFolder}/[name].css`,
    }),
    new HtmlWebpackPlugin({
      template: commonPaths.templatePath,
      prefix: `//${process.env.AWS_BUCKET}.s3.amazonaws.com/frontend/assets/`,
      inject: true,
      minify: true,
      hash: true,
    }),
    new HtmlWebpackPrefixPlugin(),
    new S3Uploader({
      // Exclude uploading of html
      exclude: /.*\.html$/,
      s3Options: {
        accessKeyId: process.env.AWS_KEY,
        secretAccessKey: process.env.AWS_SECRET,
        region: process.env.AWS_S3_REGION,
      },
      s3UploadOptions: {
        Bucket: process.env.AWS_BUCKET,
      },
      basePath: 'frontend/assets',
    }),
    new WebpackRedisPlugin({
      config: {
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD,
      },
      filter: (key, asset) => key === 'index.html' && asset.size(),
      transform: (key, asset) => ({
        key: 'frontend:index:current-content',
        value: asset.source(),
      }),
    }),
  ],
  devtool: 'source-map',
};
