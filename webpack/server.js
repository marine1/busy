const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const WebpackBar = require('webpackbar');
const StartServerPlugin = require('start-server-webpack-plugin');

const { MATCH_JS, MATCH_CSS_LESS, DEFINE_PLUGIN } = require('./configUtils');

const baseDir = path.resolve(__dirname, '..');
const buildDir = path.resolve(baseDir, './build');

module.exports = {
  entry: ['webpack/hot/poll?300', path.resolve(baseDir, './src/server/index.js')],
  output: {
    path: buildDir,
    filename: 'busy.server.js',
  },
  watch: true,
  context: process.cwd(),
  target: 'node',
  externals: nodeExternals({
    whitelist: ['webpack/hot/poll?300'],
  }),
  node: {
    __filename: true,
    __dirname: true,
  },
  module: {
    loaders: [
      {
        test: MATCH_JS,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react', 'stage-2'],
            plugins: ['transform-decorators-legacy', 'transform-runtime', 'dynamic-import-node'],
            cacheDirectory: true,
          },
        },
      },
    ],
  },
  plugins: [
    DEFINE_PLUGIN,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NormalModuleReplacementPlugin(MATCH_CSS_LESS, 'identity-obj-proxy'),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    new webpack.WatchIgnorePlugin([path.resolve(buildDir, './assets.json')]),
    new WebpackBar({
      name: 'server',
      color: '#c065f4',
    }),
    new StartServerPlugin({
      name: 'busy.server.js',
    }),
  ],
};
