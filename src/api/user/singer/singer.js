import request from "@/utils/request"

const BASE_SINGER_URL = '/back/singer'

export default {
  page(queryVo) {
    return request({
      url: BASE_SINGER_URL + '/page',
      method: 'get',
      params: queryVo
    })
  },
  insert(singer) {
    return request({
      url: BASE_SINGER_URL + '/insert',
      method: 'post',
      data: singer
    })
  },
  get(id) {
    return request({
      url: BASE_SINGER_URL + '/get' + '/' + id,
      method: 'get'
    })
  },
  edit(singer) {
    return request({
      url: BASE_SINGER_URL + '/edit',
      method: 'put',
      data: singer
    })
  },
  changeShowStatus(showStatus, singerId) {
    return request({
      url: BASE_SINGER_URL + '/changeShowStatus' + '/' + singerId + '/' + showStatus,
      method: 'post'
    })
  },
  batchDelete(ids) {
    return request({
      url: BASE_SINGER_URL + '/batchDelete',
      method: 'delete',
      data: ids
    })
  }
}
