<template>
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
<audio src="..." ref="testAudio" controls></audio>
</div>
</template>
<script>
import {searchSong, getUrl} from '@/api/song'
import {listSource} from '@/api/source'
export default {
  name: 'search',
  data: function () {
    return {
      sources: [],
      querySong: {
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
      }
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
    handlePlaySong: function (source, id) {
      getUrl(source, id).then(res => {
      //  window.open(res.data, '_blank')
        this.$refs.testAudio.src = res.data
        this.$refs.testAudio.play()
      })
    }

  },
  mounted: function () {
    this.handleQuerySources()
  }
}
</script>
<style scoped>

</style>
