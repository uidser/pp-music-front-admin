import request from "@/utils/request";

const BASE_ATTRIBUTEGROUP_URL = '/back/song/attributeGroup'

export default {
  page(queryVo) {
    return request({
      url: BASE_ATTRIBUTEGROUP_URL + '/page',
      method: 'get',
      params: queryVo
    })
  },
  getAttributeByAttributeGroupId(id) {
    return request({
      url: BASE_ATTRIBUTEGROUP_URL + '/getAttributeByAttributeGroupId/' + id,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: BASE_ATTRIBUTEGROUP_URL + '/getById/' + id,
      method: 'get'
    })
  },
  insert(attributeGroup) {
    return request({
      url: BASE_ATTRIBUTEGROUP_URL + '/insert',
      method: 'put',
      data: attributeGroup
    })
  }
}
