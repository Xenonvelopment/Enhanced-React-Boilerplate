const SriPlugin = require('webpack-subresource-integrity')
const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const BrotliPlugin = require('brotli-webpack-plugin')
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const OfflinePlugin = require('offline-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const ROOT = process.cwd()
const SRC = path.resolve(ROOT, 'src/client')
const BUILD = path.resolve(ROOT, 'build/client')
const PRODUCTION = process.env.NODE_ENV === 'production'

const plugins = [
  new webpack.NamedModulesPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.EnvironmentPlugin({
    BUILD_STAGE: 'staging'
  })
  // new FaviconsWebpackPlugin({
  //   logo: `${SRC}/assets/favicon.png`,
  //   theme_color: '#000000',
  //   inject: true,
  //   title: 'Test',
  //   persistentCache: false,
  //   icons: {
  //     android: true,
  //     appleIcon: true,
  //     appleStartup: true,
  //     coast: true,
  //     favicons: true,
  //     firefox: true,
  //     opengraph: true,
  //     twitter: true,
  //     yandex: true,
  //     windows: true
  //   }
  // })
]

if (PRODUCTION) {
  plugins.unshift(
    new CleanWebpackPlugin(),
    new MiniCSSExtractPlugin({
      allChunks: true,
      filename: '[name].[chunkhash].css'
    })
  )
  plugins.push(
    new SriPlugin({
      hashFuncNames: ['sha512'],
      enabled: true
    }),
    new CompressionPlugin({
      compressionOptions: { level: 9 },
      algorithm: 'gzip',
      minRatio: 0.99,
      filename: 'gz/[path][query]'
    }),
    new BrotliPlugin({
      asset: 'br/[path][query]',
      threshold: 0,
      minRatio: 0.99
    }),
    new OfflinePlugin({
      responseStrategy: 'network-first',
      autoUpdate: true,
      ServiceWorker: {
        output: 'offline-cache.js'
      },
      externals: [
        '/'
      ]
    })
  )
} else {
  plugins.unshift(
    new webpack.HotModuleReplacementPlugin()
  )
}

const cssModules =
  [
    [/src\/client\/js/, true, /\.scss$/, 'sass'],
    [/src\/client\/scss/, false, /\.scss$/, 'sass'],
    [/node_modules/, false, /\.scss$/, 'sass']
    // [/node_modules/, false, /\.css$/, 'css']
  ].map(([include, modules, test, loader]) => {
    const config = [{
      loader: 'css-loader',
      options: {
        modules,
        sourceMap: true
      }
    }]

    if (!PRODUCTION) {
      config.unshift('style-loader')
    }

    if (loader !== 'css') {
      const preprocessors = [{
        loader: 'postcss-loader',
        options: {
          modules,
          sourceMap: true,
          plugins: (loader) => [
            require('postcss-cssnext')()
          ]
        }
      }, 'resolve-url-loader', {
        loader: `${loader}-loader`,
        options: {
          sourceMap: true
        }
      }]

      config.push(...preprocessors)
    }

    return {
      include,
      test,
      use: PRODUCTION ? [{
        loader: WebpackMiniExtractPlugin.loader
      }, ...config] : config
    }
  })

const devModules = PRODUCTION ? ['react-hot-loader/patch'] : []

module.exports = {
  context: SRC,
  entry: {
    app: [
      'core-js/stable',
      'regenerator-runtime/runtime',
      ...devModules,
      'whatwg-fetch',
      './js/app',
      './scss/app'
    ]
  },
  devtool: PRODUCTION ? false : 'source-map',
  module: {
    rules: [
      {
        test: /\.(eot|woff2?|ttf|svg)/,
        include: /font/,
        use: [{
          loader: 'file-loader',
          query: {
            name: 'asset/font/[name].[ext]?[hash]'
          }
        }]
      }, {
        test: /\.(jpg|png|svg|gif)/,
        include: /img/,
        use: [{
          loader: 'file-loader',
          query: {
            name: 'asset/img/[name].[ext]?[hash]'
          }
        }, 'img-loader']
      },
      {
        test: /\.jsx?/,
        exclude: /node_modules\/(?!(qs|leven)\/).*/,
        use: [{
          loader: 'babel-loader'
        }]
      }, {
        test: /\.yml$/,
        use: ['json-loader', 'yaml-loader']
      }, {
        test: /\.worker\.js$/,
        use: [
          { loader: 'worker-loader' },
          { loader: 'babel-loader' }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader' // translates CSS into CommonJS
        }, {
          loader: 'less-loader', // compiles Less to CSS
          options: {
            javascriptEnabled: true
          }
        }]
      }
    ].concat(cssModules)
  },
  output: {
    filename: '[name].[hash].js',
    path: `${BUILD}`,
    publicPath: '/',
    globalObject: 'this',
    crossOriginLoading: 'anonymous'
  },
  mode: PRODUCTION ? 'production' : 'development',
  optimization: {
    minimizer: PRODUCTION ? [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})] : [],
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        },
        css: {
          name: 'css',
          test: /\.(css|scss)$/,
          priority: -8
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
      }
    }
  },
  resolve: {
    alias: {
      base: process.cwd()
    },
    extensions: ['.html', '.js', '.jsx', '.json', '.scss']
  },
  devServer: {
    contentBase: `${BUILD}/client/`,
    historyApiFallback: true,
    hot: true,
    hotOnly: true,
    open: true,
    disableHostCheck: true,
    inline: true,
    publicPath: '/',
    compress: true,
    http2: true,
    https: {
      key: path.resolve(ROOT, 'infrastructure/ssl-certs/localhost/key.pem'),
      cert: path.resolve(ROOT, 'infrastructure/ssl-certs/localhost/cert.pem')
    },
    port: 3000,
    proxy: {
      '/api': 'http://localhost:3001',
      '/auth': 'http://localhost:3001'
    }
  },
  resolve: {
    alias: {
      base: process.cwd(),
      action: `${SRC}/js/action`,
      config: `${SRC}/config`,
      constant: `${SRC}/js/constant`,
      helper: `${SRC}/js/helper`,
      img: `${SRC}/img`,
      font: `${SRC}/font`,
      js: `${SRC}/js`,
      json: `${SRC}/json`,
      scss: `${SRC}/scss`,
      view: `${SRC}/js/view`,
      assets: `${SRC}/assets`,
      data: `${SRC}/data`,
      nm: `${ROOT}/node_modules`
    },
    extensions: ['.html', '.js', '.jsx', '.json', '.scss']
  },
  plugins: [
    new HTMLWebpackPlugin({
      hash: true,
      inject: false,
      minify: PRODUCTION ? {
        html5: true,
        collapseWhitespace: true
      } : false,
      chunks: ['app'],
      template: './html',
      filename: 'index.html'
    }),
    ...plugins
  ]
}
