const path = require('path') // 引入path模块

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
  }
}