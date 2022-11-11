import request from "@/utils/request"

const BASE_COMPONENT_INPUT_URL = '/back/song/componentInput'

export default {
  getAll() {
    return request({
      url: BASE_COMPONENT_INPUT_URL + '/getAll',
      method: 'get'
    })
  }
}
