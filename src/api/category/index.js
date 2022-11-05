import request from "@/utils/request";

const BASE_CATEGORY_URL = '/back/song/category'

export default {
  getAll() {
    return request({
      url: BASE_CATEGORY_URL + '/getAll',
      method: 'get'
    })
  },
  getAttributeGroupAndAttributeByCategoryId(id) {
    return request({
      url: BASE_CATEGORY_URL + '/getAttributeGroupAndAttributeByCategoryId/' + id,
      method: 'get'
    })
  }
}
