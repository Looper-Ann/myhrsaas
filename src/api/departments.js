import request from '@/utils/request'

// 获取 组织架构列表
export const getDepartmentsList = () =>
  request({
    url: '/company/department'
  })

// 删除部门
export const removeDepartments = id =>
  request({
    method: 'DELETE',
    url: `/company/department/${id}`
  })

// 新增部门
export const addDepartments = data =>
  request({
    method: 'POST',
    url: '/company/department',
    data
  })

// 获取部门信息
export const getDepartmentDetailById = id =>
  request({
    url: `/company/department/${id}`
  })

// 修改部门信息
export const updateDepartmentDetailById = data =>
  request({
    method: 'PUT',
    url: `/company/department/${data.id}`,
    data
  })
