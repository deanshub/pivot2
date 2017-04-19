let webpackConfig = require('./webpack.config')
let path = require('path')
webpackConfig.entry={
  pivot2: './containers/Pivot/index.js',
}

webpackConfig.output.path = path.join(__dirname, './dist')
webpackConfig.output.filename = 'index.js'

// webpackConfig.externals = {
//   react: 'var React',
//   'react/addons': 'var React',
// }

module.exports = webpackConfig
