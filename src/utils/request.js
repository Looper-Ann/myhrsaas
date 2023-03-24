// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import { Message } from 'element-ui'
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API
}) // 创建一个axios的实例
request.interceptors.request.use() // 请求拦截器

// 配置响应拦截器
request.interceptors.response.use(
  // 成功的回调函数
  (result) => {
    // axios 将响应体封装进 data 需要将用到的数据解构出来
    const { data, message, success } = result.data
    // 如果 success 为 true 表明请求成功
    if (success) {
      // 返回 data
      return data
    } else {
      // 否则就提示错误
      Message.error(message)
      // 返回执行错误 让当前的执行链跳出成功
      return Promise.reject(new Error(message))
    }
  },
  // 失败的回调函数
  (error) => {
    // 使用 element-ui 向外抛出错误信息
    Message.error(error.message)
    // 返回执行错误，让当前的执行链跳出成功， 直接进入 catch
    return Promise.reject(error)
  }
) // 响应拦截器
export default request // 导出axios实例
