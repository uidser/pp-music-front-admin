import request from "@/utils/request";

const BASE_SINGER_URL = '/back/song/user'

export default {
  query(queryText) {
    return request({
      url: BASE_SINGER_URL + '/query/' + queryText,
      method: 'get'
    })
  }
}
