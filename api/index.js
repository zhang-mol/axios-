/**
  * api接口的统一出口
  * 可以把api接口根据功能划分为多个模块，利于多人协作开发，比如一个人只负责一个模块的开发等，还能方便每个模块中接口的命名。
  */
// 配件商城模块接口
import parts from 'libs/api/parts'
// 其他模块的接口……

// 导出接口
export default {
  parts
  // ……
}
