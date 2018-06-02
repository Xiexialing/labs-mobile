<template>
  <div class="login">
    <div class="logo-wrapper"><img src="../../assets/images/logo.png" alt=""></div>
    <form>
      <div class="form-group">
        <!--placeholder="请输入手机号或邮箱"-->
        <input type="text" :class="{error: errorNo===0}" @blur="accountCheck" placeholder="请输入手机号"  v-model="account"
               ref="account">
      </div>
      <div class="form-group">
        <input type="password" @blur="passwordCheck" :class="{error: errorNo===1}" placeholder="请输入密码"
               v-model="password">
      </div>
      <div class="form-group">
        <button type="button" @click="submitForm" class="confirm-btn">登<span style="opacity:0">登录</span>录</button>
      </div>
      <div class="other-operate">
        <div class="left remember">
          <i class="shape" :class="{'active': remember}"></i>
          <input type='radio' id="remember" v-model="remember" @click="rememberOrNot"/>
          <label for="remember" class="label" :class="{'active': remember}">记住密码</label>
        </div>
        <a class="right" @click="toRegister">立即注册</a>
        <a class="right forget-password" @click="toPasswordRetrieve">忘记密码？</a>
      </div>
    </form>
    <div class="wechat-wrapper" style="display: none;">
      <img src="../../assets/images/weixin.png" alt="">
      <p>微信登录</p>
    </div>
  </div>
</template>

<script>
  import store from '@/vuex'
  import {mapActions} from 'vuex'
  import validate from '../../assets/js/validate'
  import api from '@/config/api'
  import interact from '@/config/interact'

  export default{
    data () {
      return {
        account: '',
        password: '',
        remember: false,
        errorNo: null
      }
    },
    mounted () {
      this._initForm()
    },
    methods: {
      ...mapActions(['modifyUserInfoAction']),
      _initForm () {
        this.$refs.account.focus()
      },
      rememberOrNot () {
        this.remember = !this.remember
      },
      accountCheck () {
        if (!this.account) {
//          this.$message.error('手机号或者邮箱不能为空！')
          this.$message.error('手机号不能为空！')
          this.errorNo = 0
          return false
        }
        if (!validate.isAccount(this.account)) {
//          this.$message.error('手机号或者邮箱格式有误，不能包含空格！')
          this.$message.error('手机号格式有误，不能包含空格！')
          this.errorNo = 0
          return false
        }
        this.errorNo = null
        return true
      },
      passwordCheck () {
        if (!this.password) {
          this.$message.error('密码不能为空！')
          this.errorNo = 1
          return false
        }
        if (!validate.password(this.password)) {
          this.$message.error('密码由6-20位字符，至少包含英文字母、数字、特殊字符中的2种，且不能包含空格！')
          this.errorNo = 1
          return false
        }
        this.errorNo = null
        return true
      },
      checkForm () {
        if (this.accountCheck() && this.passwordCheck()) {
          return true
        }
        return false
      },
      submitForm () {
        if (!this.checkForm()) {
          return false
        }
        let data = {
          passwd: this.password
        }
        if (/^1[34578]\d{9}$/.test(this.account)) {
          data.phone = this.account
        } else {
          data.email = this.account
        }
        interact.userInter('POST', api['login'], data, (res) => {
          if (res.code === '000000') {
            if (this.remember) {
              localStorage.setItem('id', res.result.userInfo.uId)
              localStorage.setItem('user', JSON.stringify({
                account: this.account,
                password: this.password
              }))
            }
            document.cookie = 'id=' + res.result.userInfo.uId
            sessionStorage.setItem('id', res.result.userInfo.uId)
            this.getUserDetailInfo()
            this.$router.push('/')
          } else {
            this.$message.error(res.message)
          }
        })
      },
      getUserDetailInfo () {
        interact.userInter('GET', api['getUserDetailInfo'], {}, (res) => {
          this.modifyUserInfoAction(res.result)
        })
      },
      toRegister () {
        this.$router.push('/register')
      },
      toPasswordRetrieve () {
        this.$router.push('/passwordRetrieve')
      }
    },
    store
  }
</script>

<style lang='less'>
  @import "../../assets/less/base";

  .login {
    height: 100%;
    background-color: @color-white;
    padding: 0 20px;
    box-sizing: border-box;
    .logo-wrapper {
      padding: 63px 0 84px 0;
      text-align: center;
      img {
        width: 250px;
        height: 43px;
      }
    }
    form {
      .form-group {
        input {
          width: 100%;
          border-radius: 4px;
          height: 40px;
          font-size: @font-size16;
          box-sizing: border-box;
          &[type=text], &[type=password] {
            padding: 0 10px;
            margin-bottom: 10px;
            color: #A4ABB1;
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
          margin-top: 34px;
          margin-bottom: 15px;
        }
        input::-webkit-input-placeholder {
          color: #A4ABB1;
        }
      }
      .other-operate {
        .clearfix();
        margin-bottom: 78px;
        a {
          display: inline-block;
          height: 16px;
          line-height: 16px;
          font-size: @font-size14;
          color: #4895FD;
          &.forget-password {
            margin-right: 21px;
          }
        }
        .remember {
          position: relative;
          font-size: 0;
          .shape {
            position: absolute;
            left: 0;
            top: -2px;
            width: 16px;
            height: 16px;
            background: url("./circle.png") no-repeat;
            background-size: 16px;
            &.active {
              background: url("./active-circle.png") no-repeat;
              background-size: 16px;
            }
          }
          input[type=radio] {
            position: absolute;
            left: 0;
            top: -2px;
            width: 16px;
            height: 16px;
            margin: 0;
            z-index: 10;
            opacity: 0;
          }
          .label {
            display: inline-block;
            height: 16px;
            line-height: 16px;
            font-size: @font-size14;
            padding-left: 28px;
            color: #A4ABB1;
            &.active {
              color: #4895FD;
            }
          }
        }
      }
    }
    .wechat-wrapper {
      text-align: center;
      font-size: 0;
      img {
        width: 40px;
        margin-bottom: 20px;
      }
      p {
        font-size: @font-size14;
        color: #7A869D;
        height: 14px;
        line-height: 14px;
      }
    }
  }
</style>
