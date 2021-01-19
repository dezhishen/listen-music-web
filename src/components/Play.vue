<template>
  <div>
    <el-dialog @opened="()=>{$refs.searchSongInput.focus()}" style="padding:10px;max-width: 500px; overflow:hidden" width="100%" :visible.sync="showSearchMusic">
      <div>
        <el-form inline size="mini">
          <el-form-item label="关键字">
            <el-input ref="searchSongInput" v-model="querySong.q" @keyup.enter.native="handleQuerySong" clearable></el-input>
          </el-form-item>
          <el-form-item label="来源">
            <el-radio-group v-model="querySong.source">
              <el-radio-button
                :disabled="!source.enabled"
                v-for="source in sources"
                :key="source.id"
                :label="source.id"
                >{{ source.label ? source.label : source.id }}</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleQuerySong" type="primary">搜索</el-button>
          </el-form-item>
        </el-form>
        <ul class="infinite-list" v-infinite-scroll="handleQuerySongScroll" style="overflow:auto">
          <li :key="index" v-for="(item,index) in resultSong.list" class="infinite-list-item">
            <el-row style="padding:5px;width: 100%;">
              <el-col :span='22'>
                <el-row>
                  <span style="font-weight: bold;float: left;font-size: 14px">{{item.name}}</span>
                </el-row>
                <el-row>
                  <span style="float: left;font-size: 8px">{{ getArtistsName(item.artists) }}</span>
                </el-row>
              </el-col>
              <el-col :span='2'>
                <el-button
                  circle
                  type="text"
                  icon="el-icon-plus"
                  style="float:right"
                  @click="handleAddSong2PlayList(item.source, item.id)">
                </el-button>
              </el-col>
            </el-row>
          </li>
        </ul>
      </div>
    </el-dialog>
    <el-dialog title="新增歌单" :visible.sync="showPlayList">
      <el-form size="mini">
        <el-form-item label="名称">
          <el-input @keyup.enter.native="handleSavePlayList" v-model="editPlayList.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSavePlayList">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="导入歌曲" @opened="()=>{$refs.importSourcePlaylistIdInput.focus()}" :visible.sync="importSongVisible">
      <el-form inline size="mini">
        <el-form-item label="来源">
          <el-radio-group v-model="importSong.source">
            <el-radio-button
              :disabled="!source.enabled"
              v-for="source in sources"
              :key="source.id"
              :label="source.id"
              >{{ source.label ? source.label : source.id }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="来源歌单ID">
          <el-input ref="importSourcePlaylistIdInput" @keyup.enter.native="handleImportSong"  v-model="importSong.sourcePlayListId"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleImportSong" v-loading="importSongLoading" type="primary">导入</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-row>
      <span style="float:left;padding-left: 10px;">欢迎使用</span><login style="float:right;padding-right: 10px;" @success="loginSuccess"></login>
    </el-row>
    <my-audio @importSong="handleOpenImportSongs(playList[0])" @addSong="handleOpenSearchDialog(playList[0])" ref="myAduio"></my-audio>
  </div>
</template>
<script>
import {
  create,
  deletePlayList,
  list,
  listSong,
  importSongs,
  addSong,
  deleteSong
} from '@/api/playlist'
import { searchSong, getSongBySourceAndId, getUrl } from '@/api/song'
import { listSource } from '@/api/source'
import MyAudio from '@/components/Audio'
import Login from '@/components/Login'
export default {
  name: 'play',
  components: { MyAudio, Login },
  data: function () {
    return {
      preload: 'none',
      editPlayList: {},
      showPlayList: false,
      showSearchMusic: false,
      sources: [],
      currentPlayListId: null,
      music: {
        title: null,
        pic: null,
        lrc: null,
        source: null,
        id: null,
        src: null
      },
      querySong: {
        playListId: null,
        q: null,
        source: null,
        pageNum: 1,
        pageSize: 5
      },
      resultSong: {
        loading: false,
        list: [],
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      playList: [],
      importSong: {
        playListId: null,
        source: null,
        sourcePlayListId: null
      },
      importSongVisible: false,
      importSongLoading: false
    }
  },
  watch: {
  },
  methods: {
    handleImportSong: function () {
      this.importSongLoading = true
      importSongs(this.importSong).then(res => {
        if (res.code === 200) {
          if (res.data) {
            res.data.forEach(e => {
              let song = this.song2aplayMusic(e)
              this.$refs.myAduio.addSong(song)
              this.$notify({
                title: '添加成功',
                message: song.artist + '-' + song.name
              })
            })
          }
        } else {
          this.$message.error(res.message)
        }
      }).finally(() => {
        this.importSongLoading = false
      })
    },
    handleOpenImportSongs: function (o) {
      this.handleQuerySources().then(() => {
        this.sources.forEach((e) => {
          if (!this.importSong.source && e.enabled) {
            this.importSong.source = e.id
          }
        })
      })
      this.importSong.playListId = o.id
      this.importSongVisible = true
    },
    loginSuccess: function () {
      this.loadPlayList()
    },
    handleOpenEditPlayListDialog: function () {
      this.editPlayList = {}
      this.showPlayList = true
    },
    handleSavePlayList: function () {
      create(this.editPlayList).then((res) => {
        this.playList.push(res.data)
        this.showPlayList = false
      })
    },
    handleOpenSearchDialog: function (o) {
      this.handleQuerySources().then(() => {
        this.sources.forEach((e) => {
          if (!this.querySong.source && e.enabled) {
            this.querySong.source = e.id
          }
        })
      })
      this.querySong.playListId = o.id
      this.showSearchMusic = true
    },
    handleQuerySong: function () {
      this.querySong.pageNum = 1
      this.doQuerySong()
    },
    handleQuerySongScroll: function () {
      this.querySong.pageNum++
      this.doQuerySongScroll()
    },
    doQuerySongScroll: function () {
      if (!this.querySong.q) { return }
      this.resultSong.loading = true
      searchSong(this.querySong)
        .then((res) => {
          if (res.data) { this.resultSong.list.push(...res.data.list) }
        })
        .finally(() => {
          this.resultSong.loading = false
        })
    },
    doQuerySong: function () {
      if (!this.querySong.q) { return }
      this.resultSong.loading = true
      searchSong(this.querySong)
        .then((res) => {
          this.resultSong = res.data
        })
        .finally(() => {
          this.resultSong.loading = false
        })
    },
    handleDeleteSong: function (source, id) {
      deleteSong(this.currentPlayListId, source, id).then((resp) => {
        this.loadPlayListSong(this.currentPlayListId)
      })
    },
    handleDeletePlayList: function (id) {
      deletePlayList(id).then((res) => {
        let newList = this.playList.filter((e) => e.id !== id)
        this.playList = newList
      })
    },
    handleAddSong2PlayList: function (source, id) {
      addSong(source, id, this.querySong.playListId).then(res => {
        if (this.querySong.playListId === this.currentPlayListId) {
          let song = this.song2aplayMusic(res.data)
          this.$refs.myAduio.addSong(song)
          this.$notify({
            title: '添加成功',
            message: song.artist + '-' + song.name
          })
        }
      })
    },
    handleQuerySources: function () {
      return listSource()
        .then((res) => {
          this.sources = res.data
        })
    },

    loadPlayList: function () {
      list()
        .then((res) => {
          this.playList = res.data
        })
        .then(() => {
          if (this.playList && this.playList.length >= 1) {
            this.loadPlayListSong(this.playList[0].id)
          }
        })
    },
    loadPlayListSong: function (id) {
      this.currentPlayListId = id
      listSong(id).then((res) => {
        if (res.data && res.data.length > 0) {
          let songs = []
          res.data.forEach((e) => {
            songs.push(this.song2aplayMusic(e))
          })
          getUrl(songs[0].source, songs[0].id).then(urlRes => {
            songs[0].url = urlRes.data
            this.$refs.myAduio.setSong(songs)
          })
        }
      })
    },
    handlePlaySong: function (source, id) {
      getSongBySourceAndId(source, id).then((res) => {
        this.music = this.song2aplayMusic(res.data)
      })
    },
    getArtistsName: function (arr) {
      if (!arr) {
        return ''
      }
      let result = ''
      arr.forEach((element) => {
        result += '-' + element.name
      })
      return result.substring(1)
    },
    song2aplayMusic: function (e) {
      return {
        name: e.name,
        title: e.name,
        cover: e.cover,
        lrc: e.lyric,
        source: e.source,
        id: e.id,
        url: e.url,
        src: e.url,
        artist: e.artistsName || this.getArtistsName(e.artists),
        type: 'custom',
        playlistId: this.currentPlayListId
      }
    }
  },
  mounted () {
    this.loadPlayList()
  }
}
</script>
<style scoped>
.infinite-list .infinite-list-item {
  padding: 2px;
  margin-top: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}
.infinite-list {
  height: 400px;
  padding: 5px;
  list-style: none;
}
</style>
