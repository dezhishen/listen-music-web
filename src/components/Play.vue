<template>
  <div>
    <el-dialog :visible.sync="showSearchMusic">
      <div>
        <el-form inline size="medium">
          <el-form-item label="关键字">
            <el-input v-model="querySong.q" clearable></el-input>
          </el-form-item>
          <el-form-item label="来源">
            <el-radio-group v-model="querySong.source">
              <el-radio-button :disabled="!source.enabled" v-for="source in sources" :key="source.id" :label="source.id">{{source.label?source.label:source.id}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleQuerySong">搜索</el-button>
          </el-form-item>
        </el-form>
        <el-table height="500px" v-loading="resultSong.loading" stripe :data="resultSong.list">
          <el-table-column
            prop="name"
            label="歌曲名">
          </el-table-column>
          <el-table-column label="歌手">
            <template slot-scope="scope">
              {{showArtistsName(scope.row.artists)}}
            </template>
          </el-table-column>
          <el-table-column label="是否免费">
            <template slot-scope="scope">
              {{scope.row.free?'Y':'N'}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="handlePlaySong(scope.row.source,scope.row.id)">播放</el-button>
                <el-button type="text" @click="handleAddSong2PlayList(scope.row.source,scope.row.id)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
        v-loading="resultSong.loading"
        background
        layout="prev, pager, next"
        @size-change="(size)=>{querySong.pageSize=size;handleQuerySong()}"
        @current-change="(num)=>{querySong.pageNum=num;handleQuerySong()}"
        :page-size="resultSong.pageSize"
        :current-page="resultSong.pageNum"
        :total="resultSong.total">
      </el-pagination>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showPlayList">
      <el-form inline>
        <el-form-item label="名称">
          <el-input v-model="editPlayList.name"></el-input>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" @click="handleSavePlayList">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-container>
      <el-container>
        <el-aside width="300px">
          <el-card style="margin: 5px;">
            <el-button type="text" @click="handleOpenEditPlayListDialog">新增歌单</el-button>
          </el-card>
          <el-card style="margin: 5px;" :key="o.id"  v-for="o in playList" class="box-card">
            <div slot="header" class="clearfix">
              <span>{{o.name}}</span>
            </div>
            <el-button type="text" @click="loadPlayListSong(o.id)">播放当前歌单</el-button>
            <el-button type="text" @click="handleOpenSearchDialog(o)">添加歌曲</el-button>
            <el-button type="text" style="color:#EF2E55" @click="handleDeletePlayList(o.id)">删除歌单</el-button>
          </el-card>
        </el-aside>
        <el-main>
          <el-table height="100%" :data=songs>
            <el-table-column
              prop="name"
              label="歌曲名">
            </el-table-column>
            <el-table-column label="歌手">
              <template slot-scope="scope">
                {{showArtistsName(scope.row.artists)}}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="handlePlaySong(scope.row.source,scope.row.id)">播放</el-button>
                <el-button type="text" style="color:#EF2E55" @click="handleDeleteSong(scope.row.source,scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
      <el-footer style="height:60;">
        播放器
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import {create, deletePlayList, list, listSong, addSong, deleteSong} from '@/api/playlist'
import {searchSong, getUrl} from '@/api/song'
import {listSource} from '@/api/source'
export default {
  name: 'play',
  data: function () {
    return {
      editPlayList: {},
      showPlayList: false,
      showSearchMusic: false,
      sources: [],
      currentPlayListId: null,
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
      songs: []
    }
  },
  methods: {
    handleOpenEditPlayListDialog: function () {
      this.editPlayList = {}
      this.showPlayList = true
    },
    handleSavePlayList: function () {
      create(this.editPlayList).then(res => {
        this.playList.push(res.data)
      })
    },
    handleOpenSearchDialog: function (o) {
      this.handleQuerySources()
      this.querySong.playListId = o.id
      this.showSearchMusic = true
    },
    handleQuerySong: function () {
      this.querySong.pageNum = 1
      console.log(this.querySong)
      this.doQuerySong()
    },
    doQuerySong: function () {
      this.resultSong.loading = true
      searchSong(this.querySong).then(res => {
        this.resultSong = res.data
      }).finally(() => {
        setTimeout(() => { this.resultSong.loading = false }, 500)
      })
    },
    handleDeleteSong: function (source, id) {
      deleteSong(this.currentPlayListId, source, id).then(resp => {
        this.loadPlayListSong(this.currentPlayListId)
      })
    },
    handleDeletePlayList: function (id) {
      deletePlayList(id).then(res => {
        let newList = this.playList.filter(e => e.id !== id)
        this.playList = newList
      })
    },
    handleAddSong2PlayList: function (source, id) {
      addSong(source, id, this.querySong.playListId).then(res => {
        if (this.querySong.playListId === this.currentPlayListId) { this.loadPlayListSong(this.currentPlayListId) }
      })
    },
    handleQuerySources: function () {
      listSource().then(res => {
        this.sources = res.data
      }).then(() => {
        this.sources.forEach(e => {
          if (!this.querySong.source && e.enabled) {
            this.querySong.source = e.id
          }
        })
      }
      )
    },
    showArtistsName: function (arr) {
      if (!arr) {
        return ''
      }
      let result = ''
      arr.forEach(element => {
        result += ('-' + element.name)
      })
      return result.substring(1)
    },
    loadPlayList: function () {
      list().then(res => {
        this.playList = res.data
      }).then(() => {
        if (this.playList && this.playList.length >= 1) {
          this.loadPlayListSong(this.playList[0].id)
        }
      })
    },
    loadPlayListSong: function (id) {
      this.currentPlayListId = id
      listSong(id).then(res => {
        this.songs = res.data
      })
    },
    handlePlaySong: function (source, id) {
      getUrl(source, id).then(res => {
        window.open(res.data, '_blank')
      })
    }
  },
  mounted () {
    this.loadPlayList()
  }
}
</script>
