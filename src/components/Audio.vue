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
      ap: null,
      list: [
        {
          name: '人生浪费指南',
          url: 'tesst',
          source: 'NeteaseCloud',
          id: '497572729'
        }
      ],
      playing: {}
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
      console.log(song)
    },
    getUrlStorageKey: function ({source, id}) {
      return `_song_url_${source}_${id}`
    },
    getSongUrl: function ({ source, id, url }) {
      let result = localStorage.getItem(this.getUrlStorageKey({source, id}))
      if (result) {
        return {data: result}
      }
      if (url) return {data: url}
      return getUrl(source, id)
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
            if (!audioElement.paused) audioElement.pause()
            let res = await this.getSongUrl(audio)
            let url = res.data
            if (url) { localStorage.setItem(that.getUrlStorageKey(audio), url) }
            audioElement.src = url
            if (audioElement.paused) { audioElement.play() }
          }
        }
      })
    }
  },
  mounted: function () {
    this.initAp()
  }
}
</script>
