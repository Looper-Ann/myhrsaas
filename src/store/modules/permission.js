// 专门处理权限路由的模块
import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  // 一开始肯定拥有静态路由的权限
  routes: constantRoutes // 路由表， 表示当前用户所拥有的所有路由的数组
}
const mutations = {
  // 定义修改 routes 的 mutation
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  // 筛选权限路由
  filterRoutes(context, menus) {
    const routes = []
    menus.forEach(el => routes.push(...asyncRoutes.filter(item => item.name === el)))
    context.commit('setRoutes', routes)
    return routes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
