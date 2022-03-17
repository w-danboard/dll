const DllEntryPlugin = require('./DllEntryPlugin')
const LibManifestPlugin = require('./LibManifestPlugin')

class DllPlugin {
  constructor (options) {
    this.options = options
  }
  // 注册插件
  apply (compiler) {
    // 配置入口的
    // context 项目的根目录，entry 入口文件
    compiler.hooks.entryOption.tap('DllPlugin', (context, entry) => {
      Object.keys(entry).forEach(name => {
        // context根目录, ['isarray', 'is-promise'], utils
        new DllEntryPlugin(context, entry[name], name).apply(compiler)
      })
      // 此处一定要返回true，因为entryOption是一个SyncBailHook
      return true
    })
    new LibManifestPlugin(this.options).apply(compiler)
  }
}

module.exports = DllPlugin