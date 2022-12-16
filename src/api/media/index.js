import request from "@/utils/request"

const BASE_MEDIA_API = '/back/media'

export default {
  insert(media) {
    return request({
      url: BASE_MEDIA_API + '/insert',
      method: 'post',
      data: media
    })
  },
  getMediaByPage(queryVo) {
    return request({
      url: BASE_MEDIA_API + '/getMediaByPage',
      method: 'get',
      params: queryVo
    })
  },
  changeShowStatus(showStatus, mediaId) {
    return request({
      url: BASE_MEDIA_API + '/changeShowStatus/' + mediaId + '/' + showStatus,
      method: 'put'
    })
  },
  batchDelete(ids) {
    return request({
      url: BASE_MEDIA_API + '/batchDelete',
      method: 'delete',
      data: ids
    })
  },
  getRankMediaList(ids, queryVo) {
    return request({
      url: BASE_MEDIA_API + '/getRankMediaList',
      method: 'post',
      data: ids,
      params: queryVo
    })
  }
}
