<template>
  <div>
    <div v-if="hasLogin">
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ user.name }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item><el-button type="text" size="mini" @click="handleLoginOut">登出</el-button></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div v-else>
      <el-button @click="startLogin" type="text">登录</el-button>
      <el-dialog
        width="400px"
        :visible.sync="visible"
        :before-close="handleClose"
        :title="isLogin ? '登录' : '注册'"
      >
        <el-form label-width="80px" inline>
          <el-row>
            <el-form-item v-if="!isLogin" label="昵称">
              <el-input v-model="data.nickName"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="账号">
              <el-input v-model="data.loginName"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="密码">
              <el-input type="password" v-model="data.password"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item v-if="!isLogin" label="确认密码">
              <el-input type="password" v-model="data.repassword"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item>
              <div v-show="isLogin">
                <el-button type="primary" @click="handleLogin">登录</el-button>
                <el-button type="text" @click="() => (isLogin = false)"
                  >我要注册</el-button
                >
              </div>
              <div v-show="!isLogin">
                <el-button type="primary" @click="handleRegister"
                  >注册</el-button
                >
                <el-button type="text" @click="() => (isLogin = true)"
                  >我要登录</el-button
                >
              </div>
            </el-form-item>
          </el-row>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { setToken, clearToken } from '@/utils/token'
import { login, register, logout } from '@/api/account'
import { current } from '@/api/user'
export default {
  data: function () {
    return {
      data: {},
      visible: false,
      isLogin: true,
      hasLogin: false,
      user: {
        name: null,
        id: null
      }
    }
  },
  methods: {
    handleLoginOut: function () {
      const that = this
      logout().then(res => {
        if (res.data) {
          clearToken()
          that.checkLogin()
        }
      })
    },
    handleLogin: function () {
      login(this.data).then((res) => {
        setToken(res.data)
        this.checkLogin()
        this.$emit('success')
        this.visible = false
      })
    },
    handleRegister: function () {
      if (this.data.password !== this.data.repassword) {
        this.$message.error('密码不一致')
        return
      }
      register(this.data).then((res) => {
        if (res.data) {
          this.isLogin = true
        }
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
    },
    checkLogin: function () {
      current().then((res) => {
        this.user = res.data
        this.hasLogin = true
      }).catch(e => {
        this.hasLogin = false
      })
    }
  },
  mounted: function () {
    const that = this
    window.addEventListener('token_error', function () {
      that.startLogin()
    })
    this.checkLogin()
  }
}
</script>
