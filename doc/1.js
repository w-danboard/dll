/**
 * 整个webpack都是基于插件实现的
 * 核心 是一个库table 发布订阅 观察者模式
 */

let { SyncHook } = require('tapable')
let hook = new SyncHook(['name'])

// 注册钩子的回调函数
hook.tap('some name', name => {
  console.log(1, name)
})
hook.tap('some name', name => {
  console.log(2, name)
})

// 触发这个钩子执行
hook.call('wanglin')