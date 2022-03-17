class ExternalModuleFactoryPlugin {
  constructor (type, externals) {
    this.type = type // var
    this.externals = externals // {'DLL-REFERNCE _DLL_UTILS: '_DLL_UTILS''}
  }

  apply(normalModuleFactory) {
		const globalType = this.type;
		normalModuleFactory.hooks.factory.tap(
			"ExternalModuleFactoryPlugin",
      // 穿进去老的工厂函数，返回新的工厂函数
			factory => (data, callback) => {
				const context = data.context; // 根目录
				const dependency = data.dependencies[0]; // DelegatedSourceDependency

				const handleExternal = (value, type, callback) => {
					if (typeof type === "function") {
						callback = type;
						type = undefined;
					}
					if (value === false) return factory(data, callback);
					if (value === true) value = dependency.request;
					if (type === undefined && /^[a-z0-9]+ /.test(value)) {
						const idx = value.indexOf(" ");
						type = value.substr(0, idx);
						value = value.substr(idx + 1);
					}
					callback(
						null,
						new ExternalModule(value, type || globalType, dependency.request)
					);
					return true;
				};

				const handleExternals = (externals, callback) => {
					if (typeof externals === "string") {
						if (externals === dependency.request) {
							return handleExternal(dependency.request, callback);
						}
					} else if (Array.isArray(externals)) {
						let i = 0;
						const next = () => {
							let asyncFlag;
							const handleExternalsAndCallback = (err, module) => {
								if (err) return callback(err);
								if (!module) {
									if (asyncFlag) {
										asyncFlag = false;
										return;
									}
									return next();
								}
								callback(null, module);
							};

							do {
								asyncFlag = true;
								if (i >= externals.length) return callback();
								handleExternals(externals[i++], handleExternalsAndCallback);
							} while (!asyncFlag);
							asyncFlag = false;
						};

						next();
						return;
					} else if (externals instanceof RegExp) {
						if (externals.test(dependency.request)) {
							return handleExternal(dependency.request, callback);
						}
					} else if (typeof externals === "function") {
						externals.call(
							null,
							context,
							dependency.request,
							(err, value, type) => {
								if (err) return callback(err);
								if (value !== undefined) {
									handleExternal(value, type, callback);
								} else {
									callback();
								}
							}
						);
						return;
					} else if (
						typeof externals === "object" &&
						Object.prototype.hasOwnProperty.call(externals, dependency.request)
					) {
						return handleExternal(externals[dependency.request], callback);
					}
					callback();
				};

				handleExternals(this.externals, (err, module) => {
					if (err) return callback(err);
					if (!module) return handleExternal(false, callback);
					return callback(null, module);
				});
			}
		);
	}
}

module.exports = ExternalModuleFactoryPlugin