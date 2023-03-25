import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: getToken(),
    userInfo: {}
  },
  // 更改 state
  mutations: {
    // 传入 token 和 state
    setToken(state, token) {
      // 先改变 state 中的 token
      state.token = token
      // 将 token 保存到 cookie
      setToken(token)
    },
    removeToken(state) {
      state.token = null
      removeToken()
    },
    setUserInfo(state, result) {
      state.userInfo = result
    },
    removeUserInfo(state) {
      state.userInfo = {}
    }
  },
  actions: {
    // 定义login action  也需要参数 调用action时 传递过来的参数
    async login(context, user) {
      // 经过响应拦截器的处理 此处的 data 就是 token
      const data = await login(user)
      context.commit('setToken', data)
      // 存取时间戳
      setTimeStamp()
    },
    // 获取用户个人信息的 Action
    async getUserInfo(context) {
      // 获取用户基本信息
      const result = await getUserInfo()
      // 获取用户详细信息
      const baseInfo = await getUserDetailById(result.userId)
      // 合并两个结果, 更改 state 状态
      context.commit('setUserInfo', { ...result, ...baseInfo })
      return result
    },
    // 登出操作
    logout(context) {
      // 删除 token
      context.commit('removeToken')
      // 删除用户信息
      context.commit('removeUserInfo')
    }
  }
}
