// 引入布局组件
import Layout from '@/layout'

// 导出员工路由规则
export default {
  // 路由规则
  path: '/social', // 路由地址
  name: 'social_securitys', // name属性 后再做权限时候用到
  component: Layout,
  children: [
    {
      // 二级路由的 path 什么都不写的时候，表示他的默认路由
      path: '',
      component: () => import('@/views/social'), // 引入组件
      // 路由元信息， 是一个保存数据的地方
      meta: {
        title: '社保', // 为什么要有 title  因为左侧导航读取了这里的 title 属性
        icon: 'table'
      }
    }
  ]
}
