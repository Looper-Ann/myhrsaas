import request from '@/utils/request'

// 获取权限点
export const getPermissionList = () =>
  request({
    url: '/sys/permission'
  })

// 根据id删除权限点
export const delPermissionById = id =>
  request({
    method: 'DELETE',
    url: `/sys/permission/${id}`
  })

// 添加权限点
export const addPermission = data =>
  request({
    method: 'POST',
    url: '/sys/permission',
    data
  })

// 根据ID获取权限点详情
export const getPermission = id =>
  request({
    url: `/sys/permission/${id}`
  })

// 根据ID更新权限点详情
export const updatePermission = data =>
  request({
    method: 'PUT',
    url: `/sys/permission/${data.id}`,
    data
  })
