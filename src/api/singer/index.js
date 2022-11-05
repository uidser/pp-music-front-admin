import request from "@/utils/request";

const BASE_SINGER_URL = '/back/song/singer'

export default {
  query(queryText) {
    return request({
      url: BASE_SINGER_URL + '/query/' + queryText,
      method: 'get'
    })
  }
}
