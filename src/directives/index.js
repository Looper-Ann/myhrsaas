// 指令对象 会在当前的 DOM 元素 插入到节点之后执行
export const imageerror = {
  inserted(dom, options) {
    // options 是 指令中的变量的解释，其中有一个属性叫做 value
    // dom 表示当前指令作用的 dom 对象
    // dom 认为此时就是图片
    // 当图片有地址时， 但是地址没有成功加载的时候 就会报错 会触发图片的一个事件 onerror
    dom.onerror = function () {
      // 当图片出现异常的时候，会将指令的默认图片设置为该图片的内容
      // dom 可以注册 error 事件
      dom.src = options.value
    }
  }
}
