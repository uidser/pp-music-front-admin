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
  },
  page(queryVo) {
    return request({
      url: BASE_CATEGORY_URL + '/page',
      method: 'get',
      params: queryVo
    })
  },
  changeShowStatus(event, id) {
    return request({
      url: BASE_CATEGORY_URL + '/changeShowStatus/' + id + '/' + event,
      method: 'post'
    })
  },
  batchDelete(ids) {
    return request({
      url: BASE_CATEGORY_URL + '/batchDelete',
      method: 'delete',
      data: ids
    })
  },
  insert(category) {
    return request({
      url: BASE_CATEGORY_URL + '/insert',
      method: 'put',
      data: category
    })
  },
  edit(category) {
    return request({
      url: BASE_CATEGORY_URL + '/edit',
      method: 'post',
      data: category
    })
  },
  getMoreLevelCategory() {
    return request({
      url: BASE_CATEGORY_URL + '/getMoreLevelCategory',
      method: 'get'
    })
  }
}
