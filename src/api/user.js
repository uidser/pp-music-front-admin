import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/security/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/security/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/security/logout',
    method: 'post'
  })
}
