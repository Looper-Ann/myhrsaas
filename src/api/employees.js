import request from '@/utils/request'

// 获取员工简单列表
export const getEmployeesSimple = () =>
  request({
    url: '/sys/user/simple'
  })

// 获取员工列表
export const getEmployeesList = params =>
  request({
    url: '/sys/user',
    params
  })

// 删除员工
export const delEmployee = id =>
  request({
    url: `/sys/user/${id}`,
    method: 'DELETE'
  })

// 新增员工
export const addEmployee = data =>
  request({
    url: `/sys/user`,
    method: 'POST',
    data
  })

// 批量导入员工
export const importEmployees = data =>
  request({
    url: `/sys/user/batch`,
    method: 'POST',
    data
  })

// 保存用户信息
export const saveUserDetailById = data =>
  request({
    url: `/sys/user/${data.id}`,
    method: 'Put',
    data
  })

/** *
 *  读取用户详情的基础信息
 * **/
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息
 * ****/
export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}
