const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  // devServer: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://toutiao.itheima.net',
  //       pathRewrite: {
  //         '^/api': ''
  //       },
  //       ws: true,
  //       changeOrigin: true
  //     }
  //   }
  // }
})
