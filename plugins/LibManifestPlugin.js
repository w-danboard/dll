const path = require('path')
const async = require('neo-async')

class LibManifestPlugin {
  constructor (options) {
    this.options = options
  }
  apply (compiler) {
    // 作用是在编译之后生成一个文件 utils.manifest.json
    // emit是将要把产出的资源写入到硬盘上的之前的最后一个钩子
    compiler.hooks.emit.tapAsync('LibManifestPlugin', (compilation, callback) => {
      // 让所有的chunks执行任务函数，当所有的任务都完成了，就会调用callback
      async.forEach(compilation.chunks, (chunk, done) => {
        const targetPath = this.options.path // .json
        const name = this.options.name // _dll_utils
        let content = {}
        for (let module of chunk.modulesIterable) {
          // libIdent是module一个属性，它是一个函数，用来返回模块ID的
          // NormalModule是有这个属性的，DllModule就没这个属性
          if (module.libIdent) {
            // ident ./node_modules....
            const ident = module.libIdent({ context: compiler.options.context })
            content[ident] = { id: module.id }
          }
        }
        const manifest = { name, content }
        compiler.outputFileSystem.mkdirp(path.dirname(targetPath), err => {
          compiler.outputFileSystem.writeFile(
            targetPath,
            JSON.stringify(manifest),
            done
          )
        })
      }, callback)
    })
  }
}

module.exports = LibManifestPlugin