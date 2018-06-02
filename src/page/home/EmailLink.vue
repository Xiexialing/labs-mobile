<template>
  <div class="email-link">
    <p class="warning" v-if="!isEmail">未绑定邮箱，绑定后，可作为账号登录</p>
    <div v-else>
      <p class="current-email">
        <span class="label">当前绑定邮箱：</span>
        <span class="email">{{userInfo.email}}</span>
      </p>
      <p class="tip">提示：绑定后，邮箱可作为账号登录</p>
    </div>
    <form>
      <div class="form-group">
        <input type="text" :class="{error: errorNo===1}" @blur="emailCheck" placeholder="请输入邮箱" v-model="email"
               ref="email">
      </div>
      <div class="form-group">
        <input type="password" :class="{error: errorNo===2}" @blur="passwordCheck" placeholder="登录密码" v-model="password">
      </div>
      <div class="form-group" v-if="notLoginByAccount">
        <input type="password" :class="{error: errorNo===3}" @blur="confirmPasswordCheck" placeholder="确认密码" v-model="confirmPassword">
      </div>
      <div class="form-group">
        <input type="text" :class="{error: errorNo===4}" @blur="codeCheck" placeholder="输入验证码" class="auth-code" v-model="authCode">
        <input type="button" value="获取验证码" @click="getAuthCode" :disabled="isSend">
      </div>
      <p class="remind"><span v-if="isSend">验证码已发送，{{time}}秒后重新获取</span></p>
      <div class="form-group">
        <input type="button" value="确认绑定" class="confirm-btn" @click="submitForm">
      </div>
    </form>
  </div>
</template>

<script>
  import store from '@/vuex'
  import {mapState, mapActions} from 'vuex'
  import validate from '@/assets/js/validate'
  import api from '@/config/api'
  import interact from '@/config/interact'

  export default{
    data () {
      return {
        password: '',
        confirmPassword: '',
        email: '',
        authCode: '',
        isSend: false,
        time: 120,
        errorNo: null
      }
    },
    mounted () {
      this._initForm()
    },
    methods: {
      ...mapActions(['modifyUserInfoAction']),
      _initForm () {
        this.$refs.email.focus()
      },
      emailCheck () {
        if (!this.email) {
          this.$message.error('邮箱不能为空！')
          this.errorNo = 1
          return false
        }
        if (!(/^[A-Za-z\d]+([-_][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(this.email))) {
          this.$message.error('邮箱格式有误！')
          this.errorNo = 1
          return false
        }
        this.errorNo = null
        return true
      },
      passwordCheck () {
        if (!this.password) {
          this.$message.error('密码不能为空！')
          this.errorNo = 2
          return false
        }
        if (!validate.password(this.password)) {
          this.$message.error('密码由6-20位字符，至少包含英文字母、数字、特殊字符中的2种！')
          this.errorNo = 2
          return false
        }
        this.errorNo = null
        return true
      },
      confirmPasswordCheck () {
        if (this.notLoginByAccount) {
          if (!this.confirmPassword) {
            this.$message.error('确认密码不能为空！')
            this.errorNo = 3
            return false
          }
          if (!validate.password(this.confirmPassword)) {
            this.$message.error('确认密码由6-20位字符，至少包含英文字母、数字、特殊字符中的2种！')
            this.errorNo = 3
            return false
          }
          if (this.confirmPassword !== this.password) {
            this.$message.error('两次密码不一致！')
            this.errorNo = 3
            return false
          }
          this.errorNo = null
          return true
        } else {
          return true
        }
      },
      codeCheck () {
        if (!this.authCode) {
          this.$message.error('验证码不能为空！')
          this.errorNo = 4
          return false
        }
        if (!validate.authCode(this.authCode)) {
          this.$message.error('验证码格式有误！')
          this.errorNo = 4
          return false
        }
        this.errorNo = null
        return true
      },
      checkForm () {
        if (this.emailCheck() && this.passwordCheck() && this.confirmPasswordCheck() && this.codeCheck()) {
          return true
        }
        return false
      },
      getAuthCode () {
        if (!this.emailCheck()) {
          return false
        }
        let data = {
          email: this.email
        }
        interact.userInter('POST', api['modifyUserInfo.getAuthCodeByEmail'], data, (res) => {
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
      submitForm () {
        if (!this.checkForm()) {
          return false
        }
        let data = {
          email: this.email,
          passwd: this.password,
          identifying_code: this.authCode
        }
        interact.userInter('POST', api['modifyUserInfo.email'], data, (res) => {
          if (res.code === '000000') {
            this.$message.success('绑定成功！')
            this.modifyUserInfoAction({
              email: this.email
            })
//            this.$router.push('/accountSecurity')
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },
    computed: {
      ...mapState(['userInfo']),
      isEmail () {
        return /^[A-Za-z\d]+([-_][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(this.userInfo.email)
      },
      notLoginByAccount () {
        return JSON.stringify(this.userInfo) === '{}'
      }
    },
    store
  }
</script>

<style lang='less'>
  @import "../../assets/less/base.less";

  .email-link {
    height: 100%;
    background-color: @color-white;
    padding: 0 19px;
    .warning {
      box-sizing: border-box;
      padding: 64px 0 62px;
      font-size: @font-size16;
      color: @color-3D465B;
      height: 16px;
      line-height: 16px;
      text-align: center;
    }
    .current-email {
      text-align: center;
      padding: 80px 0 30px;
      .label {
        font-size: @font-size16;
        color: @color-3D465B;
      }
      .email {
        font-size: @font-size18;
        color: @color-4895FD;
      }
    }
    .tip {
      text-align: center;
      font-size: @font-size12;
      color: #FF5555;
      font-family: 'MicrosoftYaHei';
      padding-bottom: 84px;
      height: 12px;
      line-height: 12px;
    }
    form {
      .form-group {
        font-size: 0;
        input {
          height: 40px;
          border-radius: 4px;
          font-size: @font-size16;
          box-sizing: border-box;
          &[type=text], &[type=password] {
            width: 100%;
            padding: 0 10px;
            color: @color-A4ABB1;
            margin-bottom: 8px;
          }
          &.auth-code {
            width: 203px;
            margin-right: 10px;
          }
          &[type=button] {
            background-color: @color-4895FD;
            color: @color-white;
            border: 1px solid @color-4895FD;
            width: 123px;
          }
          &.confirm-btn {
            width: 100%;
          }
        }
        input::-webkit-input-placeholder {
          color: #A4ABB1;
        }
      }
      .remind {
        text-align: center;
        font-size: @font-size12;
        color: @color-4895FD;
        height: 12px;
        line-height: 12px;
        margin-top: 16px;
        margin-bottom: 52px;
      }
    }
  }
</style>
