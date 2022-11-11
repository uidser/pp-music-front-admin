import request from "@/utils/request"

const BASE_ALBUM_URL = '/back/song/album'

export default {
  query(queryVo) {
    return request({
      url: BASE_ALBUM_URL + '/query',
      method: 'get',
      params: queryVo
    })
  }
}
