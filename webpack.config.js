let rucksack = require('rucksack-css')
let webpack = require('webpack')
let path = require('path')

let NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'development')

let plugins = [
  new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
  new webpack.DefinePlugin({
    'process.env': { NODE_ENV },
  }),
  new webpack.NoErrorsPlugin(),
]

if (NODE_ENV!=='"development"'){
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false,
    },
  }))
}

module.exports = {
  context: path.join(__dirname, './client'),
  entry: {
    bundle: './index.js',
    html: './index.html',
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'react-router-redux',
      'redux',
    ],
    // pivot2: './containers/Pivot/index.js',
  },
  output: {
    path: path.join(__dirname, './server/static'),
    filename: '[name].js',
    jsonpFunction: 'sisenseWebpackJsonp',
    libraryTarget: 'umd',
    library: 'Pivot2',
  },
  // externals: {
  //   react: 'var React',
  //   'react/addons': 'var React',
  // },
  module: {
    loaders: [
      {
        test: /\.webworker\.js$/,
        loader: 'worker-loader',
        include: /client/,
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]',
        include: /client/,
      },
      {
        test: /\.css$/,
        include: /client/,
        loaders: [
          'style-loader',
          'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[local]___[hash:base64:5]',
          'postcss-loader',
        ],
      },
      {
        test: /\.css$/,
        exclude: /client/,
        loader: 'style!css',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        // loader:'babel-loader',
        loaders: [
          'react-hot',
          'babel-loader',
        ],
      },
      {
        test: /\.svg(\?.*)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml',
        include: path.join(__dirname, 'client', 'assets'),
      }, {
        test: /\.png$/,
        loader: 'url?limit=8192&mimetype=image/png',
        include: path.join(__dirname, 'client', 'assets'),
      }, {
        test: /\.gif$/,
        loader: 'url?limit=8192&mimetype=image/gif',
        include: path.join(__dirname, 'client', 'assets'),
      }, {
        test: /\.jpg$/,
        loader: 'url?limit=8192&mimetype=image/jpg',
        include: path.join(__dirname, 'client', 'assets'),
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx', 'es6'],
  },
  postcss: [
    rucksack({
      autoprefixer: true,
    }),
  ],
  plugins,
  devServer: {
    contentBase: './client',
    hot: true,
  },
}
