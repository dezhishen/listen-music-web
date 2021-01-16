<template>
  <div id="audio"></div>
</template>
<script>
import 'APlayer/dist/APlayer.min.css'
import APlayer from 'APlayer'
import { getUrl } from '@/api/song'
export default {
  name: 'my-audio',
  data () {
    return {
      ap: null
    }
  },
  props: {},
  methods: {
    addSong: function (song) {
      this.ap.list.add(song)
    },
    setSong: function (song) {
      this.ap.list.clear()
      this.ap.list.add(song)
    },
    getUrlStorageKey: function ({source, id}) {

    },
    getSongUrl: function ({ source, id, url }) {
      let result = this.getUrlLocalStorage({ source, id })
      if (result) {
        return {data: result}
      }
      if (url) return {data: url}
      return getUrl(source, id)
    },
    setUrlLocalStorage: function ({source, id, url}) {
      let time = (new Date().getTime() / (30 * 60 * 60 * 1000)).toFixed(0)
      let key = localStorage.getItem(`_song_url_key_${source}_${id}`)
      let newKey = `_song_url_${time}_${source}_${id}`
      localStorage.setItem(newKey, url)
      if (key !== newKey) {
        localStorage.setItem(`_song_url_key_${source}_${id}`, newKey)
        localStorage.removeItem(key)
      }
    },
    getUrlLocalStorage: function ({source, id}) {
      let key = localStorage.getItem(`_song_url_key_${source}_${id}`)
      if (!key) { return }
      let time = (new Date().getTime() / (30 * 60 * 60 * 1000)).toFixed(0)
      let newKey = `_song_url_${time}_${source}_${id}`
      if (newKey === key) {
        return localStorage.getItem(newKey)
      }
      localStorage.removeItem(`_song_url_key_${source}_${id}`)
      localStorage.removeItem(key)
    },
    initAp: function () {
      if (this.ap) {
        return
      }
      const that = this
      this.ap = new APlayer({
        container: document.getElementById('audio'),
        lrcType: 1,
        preload: 'none',
        audio: [],
        customAudioType: {
          custom: async (audioElement, audio, player) => {
            if (!audioElement.paused) that.ap.pause()
            let res = await this.getSongUrl(audio)
            let url = res.data
            if (url) { that.setUrlLocalStorage({id: audio.id, source: audio.source, url}) }
            audioElement.src = url
            if (audioElement.paused) { that.ap.play() }
          }
        }
      })
    },
    initKey: function () {
      document.onkeydown = (e) => {
        let keyCode = e.keyCode
        if (keyCode === 0xB0) {
          // 下一首
          this.ap.skipForward()
          return
        }
        if (keyCode === 0xB1) {
          // 上一首
          this.ap.skipBack()
          return
        }
        if (keyCode === 0xB3) {
          // 播放/暂停
          this.ap.toggle()
        }
      }
    }
  },
  mounted: function () {
    this.initAp()
    this.initKey()
  }
}
</script>
