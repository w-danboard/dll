const { Tapable } = require('tapable')
const DllModule = require('./DllModule')

class DllModuleFactory extends Tapable {
  constructor () {
    super()
    this.hook = {}
  }
  // 每个工厂都会有一个方法叫create，接收一个data对象，(一般都是依赖对象)，创建一个模块，返给callback
  // data = {dependencies:[DllEntryDependency]}
  create (data, callback) {
    // 获取依赖数组中的第一个依赖
    const dependency = data.dependencies[0]
    callback(
      null,
      new DllModule(
        data.context, // 根目录
        dependency.dependencies, // 它的依赖
        dependency.name, // utils
        dependency.type  // 'dll entry'
      )
    )
  }
}

module.exports = DllModuleFactory