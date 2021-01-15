<template>
  <div>
    <el-button @click="startLogin" type="text">登录</el-button>
    <el-dialog width="300px" :visible.sync="visible" :before-close="handleClose" :title="isLogin?'登录':'注册'">
        <el-form inline>
          <el-row>
            <el-form-item label="账号">
              <el-input v-model="data.loginName"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item v-if="!isLogin" label="昵称">
              <el-input v-model="data.nickName"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item  label="密码">
              <el-input v-model="data.password"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item>
              <div v-show="isLogin">
                <el-button type="primary" @click="handleLogin">登录</el-button>
                <el-button type="text" @click="()=>isLogin=false">我要注册</el-button>
              </div>
              <div v-show="!isLogin">
                <el-button type="primary" @click="handleRegister">注册</el-button>
                <el-button type="text" @click="()=>isLogin=true">我要登录</el-button>
              </div>
            </el-form-item>
          </el-row>
        </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {setToken} from '@/utils/token'
import {login, register} from '@/api/account'
export default {
  data: function () {
    return {
      data: {},
      visible: false,
      isLogin: true
    }
  },
  methods: {
    handleLogin: function () {
      login(this.data).then(res => {
        setToken(res.data)
        this.$emit('success')
        this.visible = false
      })
    },
    handleRegister: function () {
      register(this.data).then(res => {
        this.isLogin = true
      })
    },
    startLogin: function () {
      if (!this.visible) {
        this.isLogin = true
        this.data = {}
        this.visible = true
      }
    },
    handleClose: function () {
      this.visible = false
      this.$emit('success')
    }
  },
  mounted: function () {
    const that = this
    window.addEventListener('token_error', function () {
      console.log('事件触发')
      that.startLogin()
    })
  }
}
</script>
