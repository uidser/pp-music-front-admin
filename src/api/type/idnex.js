import request from "@/utils/request";

const BASE_TYPE_URL = '/back/song/type'

export default {
  getAll() {
    return request({
      url: BASE_TYPE_URL + '/getAll',
      method: 'get'
    })
  }
}
