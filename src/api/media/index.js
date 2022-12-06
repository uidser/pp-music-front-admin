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
  }
}
