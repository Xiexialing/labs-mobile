<template>
  <div class="password-modify">
    <form>
      <div class="form-group">
        <p class="label">原密码</p>
        <input type="password" placeholder="当前登录密码" v-model.trim="currentPassword" ref="password">
      </div>
      <div class="form-group">
        <p class="label">新密码</p>
        <input type="password" placeholder="6～20位英文字母、数字或符号组成" v-model.trim="newPassword">
      </div>
      <div class="form-group">
        <p class="label">确认密码</p>
        <input type="password" placeholder="重新输入密码" v-model.trim="confirmPassword">
      </div>
      <p class="tip">
        <!--<span>6-20位字符，至少包含英文字母、数字、特殊字符中的2种</span>-->
      </p>
      <div class="form-group">
        <input type="button" value="确认修改" class="confirm-btn" @click="submitForm">
      </div>
    </form>
  </div>
</template>

<script>
  import validate from '../../assets/js/validate'
  import {mapActions} from 'vuex'
  import api from '@/config/api'
  import interact from '@/config/interact'

  export default{
    data () {
      return {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    },
    mounted () {
      this._initForm()
    },
    methods: {
      ...mapActions(['modifyUserInfoAction']),
      _initForm () {
        this.$refs.password.focus()
      },
      submitForm () {
        if (!this.currentPassword) {
          this.$message.error('密码不能为空！')
          return
        }
        if (!validate.password(this.currentPassword)) {
          this.$message.error('密码由6-20位字符，至少包含英文字母、数字、特殊字符中的2种！')
          return
        }
        if (!this.newPassword) {
          this.$message.error('新密码不能为空！')
          return
        }
        if (!validate.password(this.newPassword)) {
          this.$message.error('新密码由6-20位字符，至少包含英文字母、数字、特殊字符中的2种！')
          return
        }
        if (this.newPassword === this.currentPassword) {
          this.$message.error('新旧密码不能相同！')
          return
        }
        if (!this.confirmPassword) {
          this.$message.error('确认密码不能为空！')
          return
        }
        if (!validate.password(this.confirmPassword)) {
          this.$message.error('确认密码由6-20位字符，至少包含英文字母、数字、特殊字符中的2种！')
          return
        }
        if (this.confirmPassword !== this.newPassword) {
          this.$message.error('两次密码不一致！')
          return
        }
        let data = {
          old_passwd: this.currentPassword,
          passwd: this.newPassword,
          again_passwd: this.confirmPassword
        }
        interact.userInter('POST', api['modifyPasswd'], data, (res) => {
          if (res.code === '000000') {
            this.$message.success('密码修改成功，请重新登录！')
            this.modifyUserInfoAction({})
            if (localStorage.getItem('id')) {
              localStorage.removeItem('id')
            }
            if (localStorage.getItem('user')) {
              localStorage.removeItem('user')
            }
            if (sessionStorage.getItem('id')) {
              sessionStorage.removeItem('id')
            }
            document.cookie = 'id=null'
            this.$router.push('/login')
          } else {
            this.$message.error(res.message)
          }
        })
      }
    }
  }
</script>

<style lang='less'>
  @import "../../assets/less/base.less";

  .password-modify {
    height: 100%;
    background-color: #F6F6F6;
    form {
      .form-group {
        position: relative;
        .label {
          position: absolute;
          left: 20px;
          top: 0;
          color: #3D465B;
          font-size: @font-size16;
          height: 48px;
          line-height: 48px;
        }
        input {
          height: 40px;
          border-radius: 4px;
          font-size: @font-size16;
          box-sizing: border-box;
          color: #A4ABB1;
          &[type=password] {
            height: 48px;
            width: 100%;
            text-align: right;
            padding: 0 20px 0 92px;
            border: none;
            margin-bottom: 1px;
          }
          &[type=button] {
            background-color: @color-4895FD;
            color: @color-white;
            border: 1px solid @color-4895FD;
          }
        }
        &:last-child {
          padding: 0 20px;
          .confirm-btn {
            width: 100%;
          }
        }
        input::-webkit-input-placeholder {
          color: #A4ABB1;
        }
      }
      .tip {
        text-align: center;
        font-size: @font-size12;
        color: #FF5555;
        font-family: 'MicrosoftYaHei';
        margin-top: 19px;
        margin-bottom: 237px;
        height: 12px;
        line-height: 12px;
      }
    }
  }
</style>
