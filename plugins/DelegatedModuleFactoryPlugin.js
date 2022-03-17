const DelegatedModule = require('./DelegatedModule')
/**
 * 影响的模块是isarray
 */
class DelegatedModuleFactoryPlugin {
  constructor (options) {
    this.options = options
    options.type = options.type || 'require'
  }
  apply (normalModuleFactory) {
    // 狸猫换太子，二次加工
    /**
     * 监听normalModuleFactory的module这个钩子
     * 当我们这个普通模块工厂，通过自己的create创建出来一个模块之后，会触发这个钩子，并且把这个模块传过来
     */
    normalModuleFactory.hooks.module.tap('DelegatedModuleFactoryPlugin', (module) => {
      // module NormalModule
      // libIdent是模块的一个属性，只有NormalModuleFactory才有，它是一个方法，可以得到模块ID，模块ID默认就是此模块的路径相对于项目根目录的相对路径
      if (module.libIdent) {
        // this.options.context 项目根目录 module resource
        const request = module.libIdent(this.options) // "./node_modules/.pnpm/is-promise@4.0.0/node_modules/is-promise/index.js"
        if (request && request in this.options.content) {
          const data = this.options.content[request] // { id: moduleId }
          return new DelegatedModule(
            this.options.source, // dll-reference _dll_utils
            data, // { id: moduleId }
            module // 原始的NormalModule
          )
        }
      }
      // 如果不是普通模块，走这个
      debugger
      return module
    })
  }
}

module.exports = DelegatedModuleFactoryPlugin