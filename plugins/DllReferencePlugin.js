const DelegatedSourceDependency = require('./dependencies/DelegatedSourceDependency')
const ExternalModuleFactoryPlugin = require('webpack/lib/ExternalModuleFactoryPlugin')
const DelegatedModuleFactoryPlugin = require('./DelegatedModuleFactoryPlugin')

class DllReferencePlugin {
  constructor (options) {
    this.options = options
  }
  apply (compiler) {
    // 当webpack开启一次新的编译之后
    compiler.hooks.compilation.tap('DllReferencePlugin', (compilation, { normalModuleFactory }) => {
      // 注册依赖工厂，什么样的依赖对应什么样的模块工厂
      // DelegatedSourceDependency 依赖会靠normalModuleFactory生成模块
      compilation.dependencyFactories.set(DelegatedSourceDependency, normalModuleFactory)
    })
    // 当开始依次新的编译的时候，就会触发这个钩子执行
    /**
     * 1.把那些在manifest里面的模块变成外部模块(特殊处理)，把它变成代理模块，也就是不再打包了，让别人来代理
     * 2.配置external 
     */
    compiler.hooks.compile.tap('DllReferencePlugin', ({ normalModuleFactory }) => {
      let manifest = this.options.manifest
      // 1.注册外部模块 'dll-reference _dll_utils' 变成 window._dll_utils
      // external: {
      //   'dll-reference _dll_utils': '_dll_utils'
      // },
      let name = manifest.name
      let content = manifest.content
      let source = `dll-reference ${name}` // 代理的来源模块ID dll-reference _dl_utils
      const externals = {
        [source]: name
      }
      // 创建一个外部模块工厂插件
      // require('dll-reference _dll_utils');  module.export = '_dll_utils'
      new ExternalModuleFactoryPlugin('var', externals).apply(normalModuleFactory)

      // 2.创建代理模块
      new DelegatedModuleFactoryPlugin({
        source, // 'dll-reference _dll_utils'
        context: compiler.options.context, // 根目录
        content // { moduleId: { id: moduleId } }
      }).apply(normalModuleFactory)
    })
  }
}

module.exports = DllReferencePlugin