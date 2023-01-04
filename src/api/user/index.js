import request from "@/utils/request";

const BASE_USER_API = '/security/back/user'

export default {
  page(queryVo) {
    return request({
      url: BASE_USER_API + '/page',
      method: 'get',
      params: queryVo
    })
  },
  changeEnableStatus(status, userId) {
    return request({
      url: BASE_USER_API + '/changeEnableStatus' + '/' + userId + '/' + status,
      method: 'put'
    })
  },
  get(id) {
    return request({
      url: BASE_USER_API + '/get' + '/' + id,
      method: 'get'
    })
  },
  edit(user) {
    return request({
      url: BASE_USER_API + '/edit',
      method: 'put',
      data: user
    })
  },
  query(queryText) {
    return request({
      url: '/back/singer' + '/query' + '/' + queryText,
      method: 'get'
    })
  }
}
