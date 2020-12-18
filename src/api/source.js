import axios from '@/utils/http.js'
export function listSource () {
  return axios.get('/music-source/list')
}
