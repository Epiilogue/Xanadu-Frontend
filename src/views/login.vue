<template>
  <div class="login">

    <el-tabs v-model="activeName" type="card" class="card">
      <el-tab-pane label="账户登录" name="first">

        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
          <h3 class="title">Xanadu物流运输管理系统</h3>
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              type="text"
              auto-complete="off"
              placeholder="账号"
            >
              <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              auto-complete="off"
              placeholder="密码"
              @keyup.enter.native="handleLogin"
            >
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
            </el-input>
          </el-form-item>

          <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
          <el-form-item style="width:100%;">
            <el-button
              :loading="loading"
              size="medium"
              type="primary"
              style="width:100%;"
              @click.native.prevent="handleLogin"
            >
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>


      <el-tab-pane label="邮箱登录" name="second">
        <h3 class="title">Xanadu物流运输管理系统</h3>
        <el-form ref="form" :model="emailForm" class="login-form">
          <el-form-item label="邮箱" class="em" prop="email">
            <el-input v-model="emailForm.email" style="margin-left: 15px;margin-right: 10px; width: 50%"></el-input>
            <el-button type="primary" :disabled="!canClick" @click="getEmailCode(emailForm.email)">{{
                content
              }}
            </el-button>
          </el-form-item>
          <el-form-item label="验证码">
            <el-input v-model="emailForm.code" style="width: 80%"></el-input>
          </el-form-item>
          <el-form-item>
            <el-form-item style="width:100%;">
              <el-button
                :loading="loading"
                size="medium"
                type="primary"
                style="width:100%;"
                @click.native.prevent="handleLoginByEmail(emailForm)"
              >
                <span v-if="!loading">登 录</span>
                <span v-else>登 录 中...</span>
              </el-button>
            </el-form-item>
          </el-form-item>
        </el-form>
      </el-tab-pane>

    </el-tabs>


    <!--  底部  -->
  </div>
</template>

<script>
import { getCode, getCodeImg } from '@/api/login'
import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: 'Login',
  data() {
    let checkEmail = (rule, value, callback) => {//验证邮箱
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (this.ruleForm.email != '' && !regEmail.test(this.ruleForm.email)) {
        callback(new Error('请输入有效的邮箱'))
      }
    }
    return {
      rules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }]
      },
      content: '获取验证码',
      totalTime: 60,
      activeName: 'first',
      codeUrl: '',
      loginForm: {
        username: 'admin',
        password: 'admin123',
        rememberMe: false,
        code: '',
        uuid: ''
      },
      emailForm: {
        uuid: '',
        email: '',
        code: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '请输入您的账号' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '请输入您的密码' }
        ],
        code: [{ required: true, trigger: 'change', message: '请输入验证码' }]
      },
      loading: false,
      canClick: true,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    //this.getCode();
    this.getCookie()
  },
  methods: {
    IsEmail(str) {
      var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      return reg.test(str)
    }
    ,
    getEmailCode(email) {
      let that = this
      if (this.IsEmail(email)) {
        if (!this.canClick) return   //改动的是这两行代码
        this.canClick = false
        getCode(email).then((res) => {
          console.log(res)
        })
        this.content = this.totalTime + 's后重新发送'
        let clock = window.setInterval(() => {
          this.totalTime--
          this.content = this.totalTime + 's后重新发送'
          if (this.totalTime < 0) {
            window.clearInterval(clock)
            this.content = '重新发送验证码'
            this.totalTime = 60
            this.canClick = true   //这里重新开启
          }
        }, 1000)
      } else {
        that.$message({
          message: '邮箱格式有误',
          type: 'warning'
        })
      }
    }
    ,
    handleLoginByEmail(data) {
      this.loading = true
      this.$store.dispatch('LoginByEmail', this.emailForm).then(() => {
        this.$router.push({ path: this.redirect || '/' }).catch(() => {
        })
      }).catch(() => {
        this.loading = false
        if (this.captchaEnabled) {
          this.getCode()
        }
      })
    }
    ,
    getCookie() {
      const username = Cookies.get('username')
      const password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      }
    }
    ,
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.loginForm.rememberMe) {
            Cookies.set('username', this.loginForm.username, { expires: 30 })
            Cookies.set('password', encrypt(this.loginForm.password), { expires: 30 })
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' }).catch(() => {
            })
          }).catch(() => {
            this.loading = false
            if (this.captchaEnabled) {
              this.getCode()
            }
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/img_1.png");
  background-size: cover;
}

.title {
  margin: 25px auto 30px auto;
  text-align: center;
  color: #707070;
}

.card {
  margin-left: 65%;
  margin-top: -5%;
  border-radius: 6px;
  background: #FFFFFF;
  width: 500px;
  padding: 25px 25px 15px 25px;

  .el-input {
    height: 45px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.login-form {
  //margin-left: 65%;
  //margin-top: -5%;
  //border-radius: 6px;
  //background: #FFFFFF;
  //width: 400px;
  //padding: 2px 25px 5px 25px;
  .el-input {
    height: 45px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 38px;
}
</style>
