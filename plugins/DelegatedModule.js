const Module = require('webpack/lib/Module')
const DelegatedSourceDependency = require('./dependencies/DelegatedSourceDependency')

class DelegatedModule extends Module {
  // sourceRequest => dll-reference _dll_utils
  // data => { id: moduleId }
  // originalModule => 原始模块 NormalModule
  constructor (sourceRequest, data, originalModule) {
    super(`javascript/dynamic`)
    this.sourceRequest = sourceRequest
    this.request = data.id
    this.originalModule = originalModule
  }
  libIdent (options) { // 获取此模块ID的
    return this.originalModule.libIdent(options)
  }
  identifier () {
    // delegated "./node_modules/.pnpm/is-promise@4.0.0/node_modules/is-promise/index.js" from 'dll-reference _dll_utils'
    return `delegated ${this.request} from ${this.sourceRequest}`
  }
  readableIdentifier () {
    return `delegated ${this.request} from ${this.sourceRequest}`
  }
  size () {
    return 42
  }
  // 当你先创建出一个模块，然后回给这个模块进行编译
  build (options, compilation, resolver, fs, callback) {
    this.built = true
    this.buildMeta = {}
    this.buildInfo = {}
    // 不走真正的读文件，转语法树，直接添加依赖
    this.delegatedSourceDependency = new DelegatedSourceDependency(this.sourceRequest)
    // 把这个依赖添加当前模块的依赖数组中
    this.addDependency(this.delegatedSourceDependency)
    callback()
  }
}

module.exports = DelegatedModule