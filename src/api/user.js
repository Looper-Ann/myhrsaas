import request from '@/utils/request'

export function login(data) {
  // 返回一个 promise 对象
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function getUserInfo(token) {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

export const logout = () => {
  request({
    url: ''
  })
}

export const getUserDetailById = id =>
  request({
    url: `/sys/user/${id}`
  })
