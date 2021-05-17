const path = require('path') // 引入path模块
const webpack = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin') //引入插件
const productionGzipExtensions = ['js', 'css'] //压缩js 和css文件

function resolve(dir) {
  return path.join(__dirname, dir) // path.join(__dirname)设置绝对路径
}



module.exports = {
  devServer: {
    port: 9090,
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('components', resolve('src/components'))
      .set('views', resolve('src/views'))
      .set('assets', resolve('src/assets'))
      .set('api', resolve('src/api'))
      .set('utils', resolve('src/utils'))
      .set('static', resolve('src/static'))
  },
  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      
      // 配置compression-webpack-plugin压缩
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 5, 
        minChunkSize: 100
      })
    ]
  },

}