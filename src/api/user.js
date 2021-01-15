import axios from '@/utils/http.js'
export function current () {
  return axios({
    url: '/system/user/current',
    method: 'get'
  })
}
