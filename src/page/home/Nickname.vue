<template>
  <div class="nickname">
    <div class="nickname-wrapper">
      <span class="label">昵称</span>
      <i class="clear" @click="clear"></i>
      <input type="text" v-model.trim="nickname" ref="nickNameInp">
    </div>
    <div class="wrapper">
      <p class="warning">昵称长度6-20位之间，不能包含空格！</p>
      <button class="submit-btn" type="button" @click="submitForm">确 <span style="opacity: 0;">确定</span>定</button>
    </div>
  </div>
</template>

<script>
  import store from '@/vuex'
  import {mapState, mapActions} from 'vuex'
  import api from '@/config/api'
  import interact from '@/config/interact'

  export default{
    data () {
      return {
        nickname: ''
      }
    },
    mounted () {
      this._initNickname()
    },
    methods: {
      ...mapActions(['modifyUserInfoAction']),
      _initNickname () {
        this.$refs.nickNameInp.focus()
        if (this.userInfo.account) {
          this.nickname = this.userInfo.account
        }
      },
      clear () {
        this.nickname = ''
      },
      submitForm () {
        if (!this.nickname) {
          this.$message.error('昵称不能为空！')
          return false
        }
        if (!(/^\S{6,20}$/.test(this.nickname))) {
          this.$message.error('昵称长度6-20位之间，不能包含空格！')
          return false
        }
        let data = {
          account: this.nickname
        }
        interact.interact('POST', api['modifyUserInfo'], data, (res) => {
          this.$message.success('昵称修改成功!')
          this.modifyUserInfoAction({
            account: this.nickname
          })
//          this.$router.push('/personalInfo')
        })
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
    store
  }
</script>

<style lang='less'>
  @import "../../assets/less/base.less";

  .nickname {
    height: 100%;
    .nickname-wrapper {
      height: 4.8*@height;
      line-height: 4.8*@height;
      box-sizing: border-box;
      padding: 0 20px;
      background-color: @color-white;
      .label {
        font-size: @font-size16;
        color: @color-3D465B;
      }
      .clear {
        float: right;
        width: 14px;
        height: inherit;
        background: url("../../assets/images/clear.png") no-repeat center;
        background-size: 14px;
      }
      input {
        float: right;
        border: none;
        width: 70%;
        height: inherit;
        margin-right: 2.6*@margin;
        color: @color-7A869D;
        font-size: @font-size16;
        text-align: right;
        box-sizing: border-box;
      }
    }
    .wrapper {
      padding: 0 2*@padding;
      box-sizing: border-box;
      .warning {
        margin-top: 1.5*@padding;
        font-size: @font-size14;
        color: @color-A4ABB1;
      }
      .submit-btn {
        width: 100%;
        height: 4.2*@height;
        margin-top: 330px;
        color: @color-white;
        font-size: @font-size16;
        background-color: @color-4895FD;
        border: none;
        border-radius: 4px;
      }
    }
  }
</style>
