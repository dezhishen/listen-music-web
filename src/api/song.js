import axios from '@/utils/http.js'
export function searchSong (params) {
  return axios.get('/song/search', {params})
}

export function getUrl (source, id) {
  return axios.get('/song/getBySourceAndId', {params: {source, id}})
}
