let webpackConfig = require('./webpack.config')
webpackConfig.entry={
  pivot2: './containers/Pivot/index.js',
}

// webpackConfig.externals = {
//   react: 'var React',
//   'react/addons': 'var React',
// }

module.exports = webpackConfig
