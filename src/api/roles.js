import request from '@/utils/request'

// 获取角色
export const getRoleList = params =>
  request({
    url: '/sys/role',
    params
  })

// 根据ID删除角色
export const delRoleById = id =>
  request({
    method: 'DELETE',
    url: `/sys/role/${id}`
  })

// 根据ID获取角色
export const getRoleById = id =>
  request({
    url: `/sys/role/${id}`
  })

// 更新角色
export const updateRole = data =>
  request({
    method: 'PUT',
    url: `/sys/role/${data.id}`,
    data
  })

// 添加角色
export const createRole = data =>
  request({
    method: 'POST',
    url: `/sys/role`,
    data
  })
