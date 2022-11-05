import request from "@/utils/request";

const BASE_ATTRIBUTE_URL = '/back/song/attribute'

export default {
  insert(attributeCommitVo) {
    return request({
      url: BASE_ATTRIBUTE_URL + '/insert',
      method: 'put',
      data: attributeCommitVo
    })
  },
  getAttributeByCategoryId(id) {
    return request({
      url: BASE_ATTRIBUTE_URL + '/getAttributeByCategoryId/' + id,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: BASE_ATTRIBUTE_URL + '/getById/' + id,
      method: 'get'
    })
  },
  edit(attribute) {
    return request({
      url: BASE_ATTRIBUTE_URL + '/edit',
      method: 'post',
      data: attribute
    })
  },
  delete(id) {
    return request({
      url: BASE_ATTRIBUTE_URL + '/delete/' + id,
      method: 'delete'
    })
  }

}
