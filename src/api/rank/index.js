import request from "@/utils/request"

const BASE_RANK_URL = '/back/rank'

export default {
  page(queryVo) {
    return request({
      url: BASE_RANK_URL + '/page',
      method: 'get',
      params: queryVo
    })
  },
  changeShowStatus(event, id) {
    return request({
      url: BASE_RANK_URL + '/changeShowStatus' + '/' + id + '/' + event,
      method: 'put'
    })
  },
  batchDelete(ids) {
    return request({
      url: BASE_RANK_URL + '/batchDelete',
      method: 'delete',
      data: ids
    })
  },
  getRankDetailMediaList(rankId, frequency) {
    return request({
      url: BASE_RANK_URL + '/getRankDetailMediaList' + '/' + rankId + '/' + frequency,
      method: 'get'
    })
  },
  insert(rank) {
    return request({
      url: BASE_RANK_URL + '/insert',
      method: 'post',
      data: rank
    })
  },
  get(rankId) {
    return request({
      url: BASE_RANK_URL + '/get' + '/' + rankId,
      method: 'get'
    })
  },
  edit(rank) {
    return request({
      url: BASE_RANK_URL + '/edit',
      method: 'put',
      data: rank
    })
  },
  getSingleMediaMap(mediaId, rankId) {
    return request({
      url: `/rank/mediaRankRelation/getSingleMediaMap/${mediaId}/${rankId}`,
      method: 'get'
    })
  }
}
