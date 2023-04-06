// 权限拦截在路由跳转、导航守卫
import router from '@/router'
import store from '@/store'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

const whiteList = ['/login', '/404']
// 前置守卫
// 参数是一个回调函数
// next 是前置守卫必须执行的钩子
// next() 放过
// next(false) 跳转终止
// next(路径) 跳转到某个地址
router.beforeEach(async (to, from, next) => {
  // 如果有 token
  nProgress.start() // 开启进度条
  if (store.getters.token) {
    // 如果有 token 且访问的是 登录页
    if (to.path === '/login') {
      // 重定向到主页
      next('/')
    } else {
      // 如果没有用户ID
      if (!store.getters.userId) {
        // 使用 store dispatch 获取用户信息 使用 await 顺序执行后续逻辑，避免出错
        const { roles } = await store.dispatch('user/getUserInfo')
        // 筛选用户的可用路由
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        // routes 就是筛选得到的动态路由
        // 动态路由添加到路由表中
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 添加动态路由到路由表
        // 添加完动态路由之后
        next(to.path) // 相当于跳到对应地址 相当于多做一次跳转
      } else {
        // 如果不是登录页，继续放行
        next()
      }
    }
    // 没有 token
  } else {
    // 如果目标地址在白名单
    if (whiteList.indexOf(to.path) !== -1) {
      next()
      // 如果目标地址不在白名单
    } else {
      next('/login')
    }
  }
  nProgress.done() // 强制关闭进度条
})

// 后置守卫
router.afterEach(() => {
  nProgress.done() // 关闭进度条
})
