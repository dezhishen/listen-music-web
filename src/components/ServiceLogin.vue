<template>
  <el-dialog :visible.sync="show">
    <el-form inline
      ><el-row>
        <el-form-item label="来源">
          <el-radio-group v-model="login.source">
            <el-radio-button
              :disabled="!source.enabled"
              v-for="source in sources"
              :key="source.id"
              :label="source.id"
              >{{ source.label ? source.label : source.id }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item> </el-row
      ><el-row>
        <el-form-item label="手机号">
          <el-input v-model="login.phone"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="密码">
          <el-input v-model="login.password" type="password"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" @click="loginServiceByPhone"
            >登录</el-button
          >
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script>
import { listSource } from "@/api/source";
import { loginByPhone } from "@/api/service-login";
export default {
  name: "service-login-dialog",
  data: function () {
    return {
      show: false,
      sources: [],
      login: {
        source: null,
        phone: null,
        password: null,
      },
    };
  },
  methods: {
    showDialog: function () {
      if (this.sources.length === 0) {
        this.handleQuerySources();
      }
      this.show = true;
    },
    loginServiceByPhone: function () {
      loginByPhone(
        this.login.source,
        this.login.phone,
        this.login.password
      ).then((res) => {
        this.show = false;
        this.$message("登录成功");
      });
    },
    handleQuerySources: function () {
      listSource()
        .then((res) => {
          this.sources = res.data;
        })
        .then(() => {
          this.sources.forEach((e) => {
            if (!this.querySong.source && e.enabled) {
              this.querySong.source = e.id;
            }
          });
        });
    },
  },
};
</script>