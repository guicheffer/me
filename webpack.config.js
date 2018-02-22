const { config } = require('./package.json')

const webpack = require('webpack')
const fs = require('fs')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const minifyHtml = require('html-minifier').minify
const CopyPlugin = require('copy-webpack-plugin')
const WatchPlugin = require('./src/build-scripts/watch-plugin/index')

const stylintrc = JSON.parse(fs.readFileSync(path.resolve(__dirname, config.stylintrc)))
const outputPath = config.path.output

module.exports = function(env = {}) {
  const rawCdnPath = env.dev ? (config.path.cdn.dev || env.cdnPath) : config.path.cdn.prod
  const cdnPath = rawCdnPath.replace(/^\"|\"$/g, '')
  const inputPath = config.path.input

  const loaders = {
    css: [
      'raw-loader',
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: env.dev,
          plugins: [
            require('autoprefixer')({ browsers: 'last 2 versions', remove: false }),
            require('cssnano')(),
          ],
        },
      },
      'stylus-loader',
      {
        loader: './src/build-scripts/stylus-variables-loader',
        options: { variables: { '$cdn-path': cdnPath } }
      },
      {
        loader: 'stylint-loader',
        options: stylintrc
      },
    ],
  }

  const plugins = {
    uglify: new webpack.optimize.UglifyJsPlugin({ output: { comments: false } }),
    moduleConcatenation: new webpack.optimize.ModuleConcatenationPlugin(),
    extractEntryCSS: new ExtractTextPlugin('../css/[name].css'),
    provide: new webpack.ProvidePlugin({ _: 'lodash' }),
    copy: new CopyPlugin([
      {
        context: path.resolve(__dirname, inputPath, 'styleguide/fonts'),
        from: '**/*',
        to: path.resolve(__dirname, outputPath, './fonts'),
      },
      {
        context: path.resolve(__dirname, inputPath),
        from: '**/*.+(jpg|png)',
        to: path.resolve(__dirname, outputPath, './img/'),
      },
      {
        context: path.resolve(__dirname, inputPath),
        from: '**/*.svg',
        to: path.resolve(__dirname, outputPath, './svg/'),
      },
      {
        context: path.resolve(__dirname, inputPath),
        from: '**/*.html',
        to: path.resolve(__dirname, outputPath, './index.html'),
      },
    ]),
    watch : new WatchPlugin({
      context: path.resolve(__dirname, inputPath),
      files: ['**/*.jpg', '**/*.png', '**/*.svg'],
    }),
  }

  return {
    entry: {
      vendor: ['lodash'],
      setup: [
        './src/app/setup',
        './src/app/setup.styl'
      ],
    },

    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, outputPath, './js'),
    },

    resolve: {
      alias: {
        underscore: 'lodash/lodash',
      },
      extensions: ['.js', '.styl'],
      modules: ['node_modules'],
    },

    module: {
      rules: [
        {
          test: /\.styl$/,
          use: plugins.extractEntryCSS.extract({
            use: loaders.css,
          }),
        },
        {
          test: /(\.js)$/,
          exclude: /node_modules/,
          include: path.resolve(__dirname, inputPath),
          enforce: 'pre',
          loader: 'eslint-loader',
        },
        {
          test: /(\.js)$/,
          exclude: /node_modules/,
          include: path.resolve(__dirname, inputPath),
          use: [{
            loader: 'babel-loader',
            options: {
              presets: ['es2015'],
            },
          }],
        },
      ]
    },

    devtool: env.dev ? 'source-map' : '',

    plugins: env.dev ? [
      plugins.moduleConcatenation,
      plugins.extractEntryCSS,
      plugins.provide,
      plugins.copy,
      plugins.watch,
    ] : [
      plugins.uglify,
      plugins.moduleConcatenation,
      plugins.extractEntryCSS,
      plugins.provide,
      plugins.copy,
    ],
  }
}
