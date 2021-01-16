import axios from '@/utils/http.js'
export function create (params) {
  return axios({
    url: '/play-list/save',
    method: 'post',
    data: params
  })
}
export function deletePlayList (id) {
  return axios.delete(`/play-list/delete?id=${id}`)
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

export function addSong (source, id, playListId) {
  return axios({
    url: '/play-list/song/add',
    method: 'post',
    data: {source, id, playListId}
  })
}
export function deleteSong (playListId, source, songId) {
  return axios.delete('/play-list/song/remove', {params: {playListId, source, songId}})
}

export function importSongs ({playListId, source, sourcePlayListId}) {
  return axios.post(`/play-list/song/import?playListId=${playListId}&source=${source}&sourcePlayListId=${sourcePlayListId}`)
}
