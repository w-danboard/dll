const path = require('path')
// const DllReferencePlugin = require('webpack/lib/DllReferencePlugin')
const DllReferencePlugin = require('./plugins/DllReferencePlugin')

module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    filename: 'bundle.js'                  // 打包后的文件名
  },
  // external: {
  //   'dll-reference _dll_utils': '_dll_utils'
  // },
  plugins: [
    new DllReferencePlugin({
      manifest: require('./dist/utils.manifest.json')
    })
  ]
}