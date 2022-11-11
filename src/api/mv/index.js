import request from "@/utils/request"

const BASE_MV_URL = '/back/song/mv'

export default {
  page(queryVo) {
    return request({
      url: BASE_MV_URL + '/page',
      method: 'get',
      params: queryVo
    })
  },
  getById(id) {
    return request({
      url: BASE_MV_URL + '/getById/' + id,
      method: 'get'
    })
  },
  insert(mvCommitVo) {
    return request({
      url: BASE_MV_URL + '/insert',
      method: 'put',
      data: mvCommitVo
    })
  },
  edit(mvCommitVo) {
    return request({
      url: BASE_MV_URL + '/edit',
      method: 'post',
      data: mvCommitVo
    })
  },
  changeShowStatus(event, id) {
    return request({
      url: BASE_MV_URL + '/changeShowStatus/' + id + '/' + event,
      method: 'post'
    })
  },
  batchDelete(ids) {
    return request({
      url: BASE_MV_URL + '/batchDelete',
      method: 'delete',
      data: ids
    })
  }
}
