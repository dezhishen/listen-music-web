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
    },
    getSongUrl: function ({ source, id }) {
      return getUrl(source, id)
    },
    initAp: function () {
      if (this.ap) {
        return
      }
      this.ap = new APlayer({
        container: document.getElementById('audio'),
        lrcType: 1,
        audio: [],
        customAudioType: {
          custom: async (audioElement, audio, player) => {
            audioElement.pause()
            let res = await this.getSongUrl(audio)
            let url = res.data
            audioElement.src = url
            audioElement.play()
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
