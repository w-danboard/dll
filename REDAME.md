### 什么是DLL

- DllPlugin和DllReferencePlugin提供了拆分包的方法，可以极大地提高构建时的性能。术语DLL代表动态链接库，它最初是由Microsoft引入的。
- .dll为后缀的文件称为动态链接库，在一个动态链接库中可以包含给其他模块调用的函数和数据
- 把基础模块独立出来打包到单独的动态链接库里
- 当需要导入的模块在动态链接库里的时候，模块不能再次被打包，而是去动态链接库里获取

### 定义DLL

- dll-plugin
- DllPlugin插件：用于打包出一个个动态链接库
- DllReferencePlugin：在配置文件中引入DllPlugin插件打包好的动态链接库