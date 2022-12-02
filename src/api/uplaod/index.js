import request from "@/utils/request"

const BASE_UPLOAD_API = '/oss'

export default {
  getUploadToken() {
    return request({
      url: BASE_UPLOAD_API + '/getUploadToken',
      method: 'get'
    })
  }
}
