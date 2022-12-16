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
  }
}
