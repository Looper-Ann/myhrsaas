import Cookies from 'js-cookie'

const TokenKey = 'myhrsaas_token'
const loginTimeStamp = 'login_timestamp_key'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(loginTimeStamp)
}

// 存储时间戳
export function setTimeStamp() {
  Cookies.set(loginTimeStamp, Date.now())
}
