import request from "@/utils/request"

const BASE_ALBUM_URL = '/back/album'

export default {
  query(queryVo) {
    return request({
      url: BASE_ALBUM_URL + '/query',
      method: 'get',
      params: queryVo
    })
  },
  page(queryVo) {
    return request({
      url: BASE_ALBUM_URL + '/page',
      method: 'get',
      params: queryVo
    })
  },
  changeShowStatus(event, id) {
    return request({
      url: BASE_ALBUM_URL + '/changeShowStatus/' + id + '/' + event,
      method: 'put'
    })
  },
  get(id) {
    return request({
      url: BASE_ALBUM_URL + '/get/' + id,
      method: 'get'
    })
  },
  edit(album) {
    return request({
      url: BASE_ALBUM_URL + '/edit',
      method: 'put',
      data: album
    })
  },
  insert(album) {
    return request({
      url: BASE_ALBUM_URL + '/insert',
      method: 'post',
      data: album
    })
  },
  getMediaByAlbumId(albumId) {
    return request({
      url: BASE_ALBUM_URL + '/getMediaByAlbumId/' + albumId,
      method: 'get'
    })
  },
  editRelation(albumMediaRelation) {
    return request({
      url: BASE_ALBUM_URL + '/editRelation',
      method: 'put',
      data: albumMediaRelation
    })
  }
}
