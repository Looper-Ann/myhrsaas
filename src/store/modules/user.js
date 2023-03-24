import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: getToken()
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
    }
  },
  actions: {
    // 定义login action  也需要参数 调用action时 传递过来的参数
    async login(context, user) {
      // 经过响应拦截器的处理 此处的 data 就是 token
      const data = await login(user)
      context.commit('setToken', data)
    }
  }
}
