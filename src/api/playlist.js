import axios from '@/utils/http.js'
export function create (params) {
  return axios({
    url: '/play-list/save',
    method: 'post',
    data: params
  })
}
export function list () {
  return axios.get(`/play-list/list`)
}

export function get (id) {
  return axios.get(`/play-list/get/{id}`)
}

export function listSong (playListId) {
  return axios.get(`/play-list/song/listAll`, {params: {playListId}})
}
