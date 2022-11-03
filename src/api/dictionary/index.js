import request from "@/utils/request";

const BASE_DICTIONARY_URL = '/back/song/dictionary'

export default {
  page(queryVo) {
    return request({
      url: BASE_DICTIONARY_URL + '/page',
      method: 'get',
      params: queryVo
    })
  },
  insert(dictionary) {
    return request({
      url: BASE_DICTIONARY_URL + '/insert',
      method: 'put',
      data: dictionary
    })
  },
  edit(dictionary) {
    return request({
      url: BASE_DICTIONARY_URL + '/edit',
      method: 'post',
      data: dictionary
    })
  },
  getById(id) {
    return request({
      url: BASE_DICTIONARY_URL + '/getById/' + id,
      method: 'get'
    })
  }
}
