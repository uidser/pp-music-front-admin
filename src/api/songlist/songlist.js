import request from '@/utils/request'

const BASE_SONG_LIST_API = '/back/songList'

export default {
  page(queryVo) {
    return request({
      url: BASE_SONG_LIST_API + '/page',
      method: 'get',
      params: queryVo
    })
  },
  insert(songList) {
    return request({
      url: BASE_SONG_LIST_API + '/insert',
      method: 'post',
      data: songList
    })
  },
  edit(songList) {
    return request({
      url: BASE_SONG_LIST_API + '/edit',
      method: 'put',
      data: songList
    })
  },
  changeShowStatus(event, id) {
    return request({
      url: BASE_SONG_LIST_API + '/changeShowStatus/' + id + '/' + event,
      method: 'put'
    })
  },
  batchDelete(ids) {
    return request({
      url: BASE_SONG_LIST_API + '/batchDelete',
      method: 'delete',
      data: ids
    })
  },
  get(id) {
    return request({
      url: BASE_SONG_LIST_API  + '/get/' + id,
      method: 'get'
    })
  }
}
