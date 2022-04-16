import {merge} from 'webpack-merge'
import * as path from 'path'
import * as fs from 'fs'
import * as common from './webpack.common'

// App directory
const appDirectory = fs.realpathSync(process.cwd())

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: path.resolve(appDirectory, "public"),
    compress: true,
    hot: true,
    // publicPath: '/',
    open: true,
    // host: '0.0.0.0', // enable to access from other devices on the network
    // https: true // enable when HTTPS is needed (like in WebXR)
  },
})
