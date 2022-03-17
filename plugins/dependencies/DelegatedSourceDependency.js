const ModuleDependency = require('webpack/lib/dependencies/ModuleDependency')

class DelegatedSourceDependency extends ModuleDependency {
  constructor (request) {
    super(request)
  }

  get type () {
    return 'delegated source'
  }
}

module.exports = DelegatedSourceDependency