const Module = require('webpack/lib/Module')
const { RawSource } = require('webpack-sources')

class DllModule extends Module {
  constructor (context, dependencies, name, type) {
    super('javascript/dynamic', context)
    this.dependencies = dependencies
    this.name = name
    this.type = type
  }
  identifier () {
    return `dll ${this.name}` // dll utils
  }
  readableIdentifier () {
    return `dll ${this.name}` // dll utils
  }
  size () {
    return 12
  }
  source () {
    return new RawSource(`module.exports = __webpack_require__`)
  }
  /**
   * 实现模块的编译
   * @param {*} options 选项
   * @param {*} compilation 编译
   * @param {*} resolver 解析路径的工作
   * @param {*} fs 
   * @param {*} callback 
   */
  build (options, compilation, resolver, fs, callback) {
    this.built = true
    this.buildMeta = {}
    this.buildInfo = {} // 描述编译信息的
    return callback()
  }
}

module.exports = DllModule