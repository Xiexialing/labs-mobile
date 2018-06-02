<template>
  <div class="register">
    <div class="logo-wrapper"><img src="../../assets/images/logo.png" alt=""></div>
    <form>
      <div class="form-group">
       <!-- placeholder="请输入手机号或邮箱"-->
        <input type="text" :class="{error: errorNo===1}" @blur="accountCheck"  class="user" placeholder="请输入手机号"
               v-model="account"
               ref="account">
        <input type="button" value="获取验证码" @click="getAuthCode" :disabled="isSend">
      </div>
      <div class="form-group">
        <input type="text" :class="{error: errorNo===2}" @blur="codeCheck" placeholder="请输入验证码" v-model.trim="authCode">
      </div>
      <div class="form-group">
        <input type="password" :class="{error: errorNo===3}" @blur="passwordCheck" placeholder="6～20位英文字母、数字或符号组成" v-model="password">
      </div>
      <div class="form-group">
        <input type="password" :class="{error: errorNo===4}" @blur="confirmPasswordCheck" placeholder="确认密码" v-model="confirmPassword">
      </div>
      <p class="remind"><span v-if="isSend">验证码已发送，<span>{{time}}</span>秒后重新获取</span></p>
      <div class="form-group">
        <button type="button" class="confirm-btn" @click="submitForm">注<span style="opacity:0">注册</span>册</button>
      </div>
      <p class="remind" @click="toLogin">已有账号，直接登录</p>
    </form>
  </div>
</template>

<script>
  import validate from '../../assets/js/validate'
  import api from '@/config/api'
  import interact from '@/config/interact'

  export default{
    data () {
      return {
        account: '',
        authCode: '',
        password: '',
        confirmPassword: '',
        isSend: false,
        time: 120,
        errorNo: null
      }
    },
    mounted () {
      this._initForm()
    },
    methods: {
      _initForm () {
        this.$refs.account.focus()
      },
      accountCheck () {
        if (!this.account) {
//          this.$message.error('手机号或者邮箱不能为空！')
          this.$message.error('手机号不能为空！')
          this.errorNo = 1
          return false
        }
        if (!validate.isAccount(this.account)) {
//          this.$message.error('手机号或者邮箱格式有误，不能包含空格！')
          this.$message.error('手机号格式有误，不能包含空格！')
          this.errorNo = 1
          return false
        }
        this.errorNo = null
        return true
      },
      codeCheck () {
        if (!this.authCode) {
          this.$message.error('验证码不能为空！')
          this.errorNo = 2
          return false
        }
        if (!validate.authCode(this.authCode)) {
          this.$message.error('验证码格式有误！')
          this.errorNo = 2
          return false
        }
        this.errorNo = null
        return true
      },
      passwordCheck () {
        if (!this.password) {
          this.$message.error('密码不能为空！')
          this.errorNo = 3
          return false
        }
        if (!validate.password(this.password)) {
          this.$message.error('密码由6-20位字符，至少包含英文字母、数字、特殊字符中的2种，且不能包含空格！')
          this.errorNo = 3
          return false
        }
        this.errorNo = null
        return true
      },
      confirmPasswordCheck () {
        if (!this.confirmPassword) {
          this.$message.error('确认密码不能为空！')
          this.errorNo = 4
          return false
        }
        if (!validate.password(this.confirmPassword)) {
          this.$message.error('确认密码由6-20位字符，至少包含英文字母、数字、特殊字符中的2种，且不能包含空格！')
          this.errorNo = 4
          return false
        }
        if (this.confirmPassword !== this.password) {
          this.$message.error('两次密码不一致！')
          this.errorNo = 4
          return false
        }
        this.errorNo = null
        return true
      },
      getAuthCode () {
        if (!this.accountCheck()) {
          return false
        }
        let data = {}
        let param = ''
        if (/^1[34578]\d{9}$/.test(this.account)) {
          data.phone = this.account
          param = 'register.getAuthCodeByPhone'
        } else {
          data.email = this.account
          param = 'register.getAuthCodeByEmail'
        }
        interact.userInter('POST', api[param], data, (res) => {
          if (res.code === '000000') {
            this.$message.success('发送成功！')
            this.isSend = true
            let timer = setInterval(() => {
              this.time--
              if (this.time === 0) {
                window.clearInterval(timer)
                this.time = 120
                this.isSend = false
              }
            }, 1000)
          } else {
            this.$message.error(res.message)
          }
        })
      },
      checkForm () {
        if (this.accountCheck() && this.codeCheck() && this.passwordCheck() && this.confirmPasswordCheck()) {
          return true
        }
        return false
      },
      submitForm () {
        if (!this.checkForm()) {
          return false
        }
        let data = {
          passwd: this.password,
          again_passwd: this.confirmPassword,
          identifying_code: this.authCode
        }
        if (/^1[34578]\d{9}$/.test(this.account)) {
          data.phone = this.account
        } else {
          data.email = this.account
        }
        interact.userInter('POST', api['register'], data, (res) => {
          if (res.code === '000000') {
            this.$message.success('注册成功！')
            this.$router.push('/login')
          } else {
            this.$message.error(res.message)
          }
        })
      },
      toLogin () {
        this.$router.push('/login')
      }
    }
  }
</script>

<style lang='less'>
  @import "../../assets/less/base";

  .register {
    height: 100%;
    background-color: @color-white;
    padding: 0 20px;
    box-sizing: border-box;
    .logo-wrapper {
      padding: 64px 0 84px 0;
      text-align: center;
      img {
        width: 250px;
        height: 43px;
      }
    }
    form {
      .form-group {
        font-size: 0;
        input {
          height: 40px;
          border-radius: 4px;
          font-size: @font-size16;
          box-sizing: border-box;
          color: #A4ABB1;
          &[type=text], &[type=password] {
            padding: 0 10px;
            margin-bottom: 10px;
            width: 100%;
          }
          &[type=button] {
            background-color: @color-4895FD;
            color: @color-white;
            border: 1px solid @color-4895FD;
            width: 120px;
          }
          &.user {
            width: 203px;
            margin-right: 10px;
          }
        }
        .confirm-btn {
          height: 40px;
          border-radius: 4px;
          font-size: @font-size16;
          box-sizing: border-box;
          background-color: @color-4895FD;
          color: @color-white;
          border: 1px solid @color-4895FD;
          width: 100%;
          margin-top: 24px;
          margin-bottom: 30px;
        }
        input::-webkit-input-placeholder {
          color: #A4ABB1;
        }
      }
      .remind {
        font-size: @font-size14;
        color: #0085FF;
        height: 14px;
        line-height: 14px;
        text-align: center;
      }
    }
  }
</style>
