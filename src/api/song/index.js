import request from "@/utils/request";
const BASE_SONG_URL = '/back/song'

export default {
  page(queryVo) {
    return request({
      url: BASE_SONG_URL + '/page',
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8'
      },
      method: 'get',
      params: queryVo
    })
  },
  changeShowStatus(songId, status) {
    return request({
      url: BASE_SONG_URL + '/changeShowStatus/' + songId + '/' + status,
      method: 'post'
    })
  },
  batchDelete(ids) {
    return request({
      url: BASE_SONG_URL + '/batchDelete',
      method: 'delete',
      data: ids
    })
  }
}
