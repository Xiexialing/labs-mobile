<template>
  <div class="personal-intro">
    <div class="personal-intro-wrapper">
      <p class="label">个人简介</p>
      <textarea rows="10" placeholder="用一句话介绍一下自己吧（15个字以内）" v-model.trim="userDesc" ref="userDesc"></textarea>
    </div>
    <div class="wrapper">
      <button class="submit-btn" type="button" @click="submitForm">确 <span style="opacity: 0;">确定</span>定</button>
    </div>
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
        userDesc: ''
      }
    },
    mounted () {
      this._initUserDesc()
    },
    methods: {
      ...mapActions(['modifyUserInfoAction']),
      _initUserDesc () {
        this.$refs.userDesc.focus()
        if (this.userInfo.user_desc) {
          this.userDesc = this.userInfo.user_desc
        }
      },
      submitForm () {
        if (!validate.lengthLimit(this.userDesc, 0, 15)) {
          this.$message.error('个人简介不超过15个字符！')
          return
        }
        let data = {
          user_desc: this.userDesc
        }
        interact.interact('POST', api['modifyUserInfo'], data, (res) => {
          this.$message.success('个人简介修改成功!')
          this.modifyUserInfoAction({
            user_desc: this.userDesc
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

  .personal-intro {
    height: inherit;
    .personal-intro-wrapper {
      padding: 0 2*@padding;
      box-sizing: border-box;
      background-color: @color-white;
      height: 266px;
      .label {
        font-size: @font-size16;
        color: @color-3D465B;
        margin: 2*@margin 0;
      }
      textarea {
        width: 100%;
        border: none;
        font-size: @font-size14;
        color: @color-A4ABB1;
        line-height: 16px;
        font-family:'PingFangSC';
      }
      textarea::-webkit-input-placeholder {
        color: #A4ABB1;
      }
    }
    .wrapper {
      padding: 0 2*@padding;
      box-sizing: border-box;
      .submit-btn {
        width: 100%;
        height: 4.2*@height;
        margin-top: 141px;
        color: @color-white;
        font-size: @font-size16;
        background-color: @color-4895FD;
        border: none;
        border-radius: 4px;
      }
    }
  }
</style>
