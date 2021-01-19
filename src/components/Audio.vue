<template>
  <div id="audio"></div>
</template>
<script>
import 'APlayer/dist/APlayer.min.css'
import APlayer from 'APlayer'
import { getUrl } from '@/api/song'
import { deleteSong } from '@/api/playlist'
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
    handleRemoveSong: function ({playlistId, source, id}) {
      deleteSong(playlistId, source, id)
    },
    getUrlStorageKey: function ({ source, id }) {},
    getSongUrl: function ({ source, id, url }) {
      let result = this.getUrlLocalStorage({ source, id })
      if (result) {
        return { data: result }
      }
      if (url) return { data: url }
      return getUrl(source, id)
    },
    setUrlLocalStorage: function ({ source, id, url }) {
      let time = (new Date().getTime() / (30 * 60 * 1000)).toFixed(0)
      let key = localStorage.getItem(`_song_url_key_${source}_${id}`)
      let newKey = `_song_url_${time}_${source}_${id}`
      localStorage.setItem(newKey, url)
      if (key !== newKey) {
        localStorage.setItem(`_song_url_key_${source}_${id}`, newKey)
        localStorage.removeItem(key)
      }
    },
    getUrlLocalStorage: function ({ source, id }) {
      let key = localStorage.getItem(`_song_url_key_${source}_${id}`)
      if (!key) {
        return
      }
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
            if (url) {
              that.setUrlLocalStorage({
                id: audio.id,
                source: audio.source,
                url
              })
            }
            audioElement.src = url
            if (audioElement.paused) {
              that.ap.play()
            }
          }
        }
      })
      this.initButtons()
    },
    initButtons: function () {
      const that = this
      const targetNode = document.getElementById('audio')
      if (!targetNode) {
        return
      }
      let controlles = targetNode.getElementsByClassName('aplayer-time')
      if (!controlles) {
        return
      }
      let addBtn = document.createElement('button')
      addBtn.setAttribute('class', 'aplayer-icon aplayer-icon-loop')
      addBtn.setAttribute('type', 'button')
      let addIcon = document.createElement('i')
      addIcon.setAttribute('class', 'el-icon-zoom-in')
      addBtn.appendChild(addIcon)
      addBtn.onclick = function () {
        that.$emit('addSong')
      }
      controlles[0].appendChild(addBtn)
      let importButton = document.createElement('button')
      importButton.setAttribute('class', 'aplayer-icon aplayer-icon-loop')
      importButton.setAttribute('type', 'button')
      let importIcon = document.createElement('i')
      importIcon.setAttribute('class', 'el-icon-upload')
      importButton.appendChild(importIcon)
      importButton.onclick = function () {
        that.$emit('importSong')
      }
      controlles[0].appendChild(importButton)
    },
    removeSong: function (e) {
      let index = e.parentNode.parentNode.childNodes[3].innerHTML
      let audio = this.ap.list.audios[index - 1]
      this.ap.list.remove(index - 1)
      this.handleRemoveSong(audio)
    },
    initKey: function () {
      const that = this
      document.onkeydown = (e) => {
        let keyCode = e.keyCode
        if (e.ctrlKey && e.altKey) {
          if (keyCode === 0x27) {
            that.ap.skipForward()
            return
          }
          if (keyCode === 0x25) {
            that.ap.skipBack()
            return
          }
          if (keyCode === 0x74) {
            that.ap.toggle()
            return
          }
          if (keyCode === 0x26) {
            that.ap.volume(that.ap.audio.volume + 0.1)
            return
          }
          if (keyCode === 0x28) {
            that.ap.volume(that.ap.audio.volume - 0.1)
          }
        } else {
          if (keyCode === 0xb0) {
            // 下一首
            that.ap.skipForward()
            return
          }
          if (keyCode === 0xb1) {
            // 上一首
            that.ap.skipBack()
            return
          }
          if (keyCode === 0xb3) {
            // 播放/暂停
            that.ap.toggle()
          }
        }
      }
    },
    initEvent: function () {
      // 选择需要观察变动的节点
      const targetNode = document.getElementById('audio')
      if (!targetNode) {
        return
      }
      const aplayerList = targetNode.getElementsByClassName('aplayer-list')
      if (!aplayerList) {
        return
      }
      const ols = aplayerList[0].getElementsByTagName('ol')
      if (!ols) {
        return
      }
      const that = this
      let callback = function (mutationsList, instance) {
        mutationsList.forEach(function (item, index) {
          if (item.type === 'childList') {
            const childrenNodes = item.addedNodes
            console.log(childrenNodes)
            childrenNodes.forEach((e) => {
              if (e.tagName === 'LI') {
                let btns = e.getElementsByClassName('el-button el-button--text is-circle')
                if (btns && btns.length > 0) {
                  return
                }
                let span = document.createElement('span')
                let btn = document.createElement('button')
                btn.setAttribute('class', 'el-button el-button--text is-circle')
                btn.setAttribute('style', 'float:right;z-index:-1;color:rgb(239, 46, 85);')
                let icon = document.createElement('i')
                icon.setAttribute('class', 'el-icon-delete')
                btn.appendChild(icon)
                btn.onclick = function () {
                  that.removeSong(span)
                }
                span.appendChild(btn)
                e.childNodes[7].appendChild(span)
              }
            })
          }
        })
      }
      // 观察器的配置（需要观察什么变动）
      const config = { attributes: false, childList: true, subtree: false }
      // 当观察到变动时执行的回调函数
      let observer = new MutationObserver(callback)
      observer.observe(ols[0], config)
    }
  },
  mounted: function () {
    this.initAp()
    this.initKey()
    this.initEvent()
  }
}
</script>
<style>
.aplayer .aplayer-list ol li .aplayer-list-index {
    cursor: pointer;
    float: left;
}
.aplayer .aplayer-list ol li .aplayer-list-title {
    cursor: pointer;
    margin-left: 10px;
    float: left;
}
</style>
