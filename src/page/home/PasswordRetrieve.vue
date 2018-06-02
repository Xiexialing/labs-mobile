<template>
  <div class="password-retrieve">
    <form>
      <p class="warning"><!--<span>6-20位字符，至少包含英文字母、数字、</span>--></p>
      <div class="form-group">
        <!--placeholder="请输入手机或邮箱"-->
        <input type="text" :class="{error: errorNo===1}" @blur="accountCheck" placeholder="请输入手机号"
               class="user-account" v-model.trim="account" ref="account">
        <input type="button" value="获取验证码" @click="getAuthCode" :disabled="isSend">
      </div>
      <div class="form-group">
        <input type="text" :class="{error: errorNo===2}" @blur="codeCheck" placeholder="请输入验证码"
               v-model.trim="authCode">
      </div>
      <div class="form-group">
        <input type="password" :class="{error: errorNo===3}" @blur="passwordCheck" placeholder="新密码：6～20位英文字母、数字或符号组成"
               v-model.trim="newPassword">
      </div>
      <div class="form-group">
        <input type="password" :class="{error: errorNo===4}" @blur="confirmPasswordCheck" placeholder="确认密码"
               v-model.trim="confirmPassword">
      </div>
      <p class="remind"><span v-if="isSend">验证码已发送，<span>{{time}}</span>秒后重新获取</span></p>
      <div class="form-group">
        <button class="confirm-btn" type="button" @click="submitForm">密 码 找 回</button>
      </div>
      <p class="tip" @click="toLogin">已有账号，直接登录</p>
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
        newPassword: '',
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
//          this.$message.error('手机号或者邮箱格式有误！')
          this.$message.error('手机号格式有误！')
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
        if (!this.newPassword) {
          this.$message.error('新密码不能为空！')
          this.errorNo = 3
          return false
        }
        if (!validate.password(this.newPassword)) {
          this.$message.error('新密码由6-20位字符，至少包含英文字母、数字、特殊字符中的2种！')
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
          this.$message.error('确认密码由6-20位字符，至少包含英文字母、数字、特殊字符中的2种！')
          this.errorNo = 4
          return false
        }
        if (this.confirmPassword !== this.newPassword) {
          this.$message.error('两次密码不一致！')
          this.errorNo = 4
          return false
        }
        this.errorNo = null
        return true
      },
      checkForm () {
        if (this.accountCheck() && this.codeCheck() && this.passwordCheck() && this.confirmPasswordCheck()) {
          return true
        }
        return false
      },
      getAuthCode () {
        if (!this.accountCheck()) {
          return false
        }
        let data = {}
        let param = ''
        if (/^1[34578]\d{9}$/.test(this.account)) {
          data.phone = this.account
          param = 'resetPasswd.getAuthCodeByPhone'
        } else {
          data.email = this.account
          param = 'resetPasswd.getAuthCodeByEmail'
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
      submitForm () {
        if (!this.checkForm()) {
          return false
        }
        let data = {
          passwd: this.newPassword,
          again_passwd: this.confirmPassword,
          identifying_code: this.authCode
        }
        if (/^1[34578]\d{9}$/.test(this.account)) {
          data.phone = this.account
        } else {
          data.email = this.account
        }
        interact.userInter('POST', api['resetPasswd'], data, (res) => {
          if (res.code === '000000') {
            this.$message.success('找回成功！')
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

  .password-retrieve {
    height: 100%;
    background-color: @color-white;
    padding: 0 20px;
    box-sizing: border-box;
    form {
      .warning {
        height: 12px;
        line-height: 12px;
        color: #FF5555;
        padding: 20px 0 24px 0;
        text-align: center;
      }
      .form-group {
        font-size: 0;
        input {
          border-radius: 4px;
          height: 40px;
          font-size: @font-size16;
          box-sizing: border-box;
          &[type=text], &[type=password] {
            width: 100%;
            padding: 0 10px;
            margin-bottom: 10px;
            color: #A4ABB1;
          }
          &[type=button] {
            background-color: @color-4895FD;
            color: @color-white;
            border: 1px solid @color-4895FD;
            width: 120px;
          }
          &.user-account {
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
          margin-bottom: 20px;
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
      .tip {
        color: #A4ABB1;
        font-size: @font-size14;
        height: 14px;
        line-height: 14px;
        text-align: center;
      }
    }
  }
</style>
