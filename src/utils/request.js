// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from './auth'
import router from '@/router'

const timeOut = 3600
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API
}) // 创建一个axios的实例
// 请求拦截器
request.interceptors.request.use(
  // 成功的回调函数
  config => {
    // 如果存在 token
    if (store.getters.token) {
      // 有 token 的情况下 才有必要检查时间戳是否超时
      // 为真就表明超时了
      if (checkTimeOut()) {
        // 登出逻辑
        store.dispatch('user/logout')
        router.push('/login')
        return Promise.reject(new Error('登录已过期,请重新登录!'))
      }
      // 设置请求头 请求头中 加入 Authorization = Breaer TOKEN
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    // 返回请求对象
    return config
  },
  // 失败的回调函数
  error => {
    // 返回错误对象，并使当前执行链跳出成功
    return Promise.reject(error)
  }
) // 请求拦截器

// 配置响应拦截器
request.interceptors.response.use(
  // 成功的回调函数
  result => {
    // axios 将响应体封装进 data 需要将用到的数据解构出来
    // console.log(result)
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
  error => {
    // error 信息里面 response 对象
    if (error.response && error.response.data && error.response.data.code === 10002) {
      store.dispatch('user/logout')
      router.push('/login')
    } else {
      // 使用 element-ui 向外抛出错误信息
      Message.error(error.message)
      // 返回执行错误，让当前的执行链跳出成功， 直接进入 catch
    }
    return Promise.reject(error)
  }
) // 响应拦截器
function checkTimeOut() {
  return (Date.now() - getTimeStamp()) / 1000 > timeOut
}
export default request // 导出axios实例
