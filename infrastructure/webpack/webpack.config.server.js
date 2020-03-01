// const _ = require('lodash')
const path = require('path')
const slsw = require('serverless-webpack')
const webpack = require('webpack')
const WebpackNodeExternalsPlugin = require('webpack-node-externals')
const TerserPlugin = require('terser-webpack-plugin')

const CWD = process.cwd()
const BUILD = path.resolve(CWD, 'build/server')
const SRC = path.resolve(CWD, 'src')
const SERVER_SRC = path.resolve(SRC, 'server')
const PRODUCTION = process.env.NODE_ENV === 'production'

const plugins = [
  new webpack.NoEmitOnErrorsPlugin()
]

if (!PRODUCTION) {
  plugins.push(
    new webpack.EnvironmentPlugin({
      PRODUCTION,
      STAGE: 'development',
      SERVICE: slsw.lib.serverless.service.service
    })
  )
}

module.exports = {
  context: CWD,
  entry: slsw.lib.entries,
  devtool: 'source-map',
  externals: [WebpackNodeExternalsPlugin({
    whitelist: [/\.yml/]
  })],
  module: {
    rules: [{
      test: /\.html$/,
      use: ['html-loader']
    }, {
      exclude: /node_modules/,
      test: /\.js$/,
      use: ['babel-loader']
    }, {
      test: /\.yml$/,
      use: ['json-loader', 'yaml-loader']
    }, {
      test: /\.sql$/,
      use: ['raw-loader']
    }, {
      test: /\.crt$/,
      use: ['raw-loader']
    }, {
      test: /\.pem$/,
      use: ['raw-loader']
    }]
  },
  output: {
    filename: '[name].js',
    path: BUILD,
    libraryTarget: 'umd'
  },
  mode: PRODUCTION ? 'production' : 'development',
  // mode: 'development',
  optimization: {
    minimizer: [new TerserPlugin()]
  },
  resolve: {
    alias: {
      base: CWD,
      src: SRC,
      server: SERVER_SRC,
      config: `${SERVER_SRC}/config`,
      constant: `${SERVER_SRC}/constant`,
      helper: `${SERVER_SRC}/helper`,
      middleware: `${SERVER_SRC}/middleware`,
      route: `${SERVER_SRC}/route`,
      handlers: `${SERVER_SRC}/handlers`,
      service: `${SERVER_SRC}/service`
    }
  },
  plugins: plugins,
  target: 'node'
}
