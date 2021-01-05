import axios from '@/utils/http.js'
export function searchSong (params) {
  return axios.get('/song/search', {params})
}

export function getUrl (source, id) {
  return axios.get('/song/getUrlBySourceAndId', {params: {source, id}})
}
export function getSongBySourceAndId (source, id) {
  return axios.get(`/song/getBySourceAndId?source=${source}&id=${id}`)
}
