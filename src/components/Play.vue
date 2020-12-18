<template>
  <el-container>
    <el-container>
      <el-aside width="200px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>歌单列表</span>
          </div>
          <div v-for="o in playList" :key="o.id" class="text item">
            {{o.name}}
          </div>
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
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <el-footer style="height:60;">
      播放器
    </el-footer>
  </el-container>
</template>
<script>
import {list, listSong} from '@/api/playlist'
export default {
  name: 'play',
  data: function () {
    return {
      playList: [],
      songs: []
    }
  },
  methods: {
    showArtistsName: function (list) {
      if (!list) {
        return ''
      }
      let result = ''
      list.forEach(element => {
        result += ('-' + element.name)
      })
      return result.substring(1)
    },
    loadPlayList: function () {
      list().then(res => {
        this.playList = res.data
      })
    },
    loadPlayListSong: function (id) {
      listSong(id).then(res => {
        this.songs = res.data
      })
    }
  },
  mounted () {
    this.loadPlayList()
  }
}
</script>
