<template>
  <div class="account-security">
    <div class="group" @click="toPhoneLink">
      <span class="label">手机绑定</span>
      <i class="right"></i>
      <span class="right">{{userInfo.phone ? userInfo.phone : '未绑定'}}</span>
    </div>
    <!--<div class="group" @click="toEmailLink">-->
      <!--<span class="label">邮箱绑定</span>-->
      <!--<i class="right"></i>-->
      <!--<span class="right">{{userInfo.email ? userInfo.email : '未绑定'}}</span>-->
    <!--</div>-->
    <div class="group" @click="toPasswordModify">
      <span class="label">修改登录密码</span>
      <i class="right"></i>
    </div>
    <div class="group">
      <button class="confirm-btn" @click="logout">退出登录</button>
    </div>
  </div>
</template>

<script>
  import store from '@/vuex'
  import {mapState, mapMutations} from 'vuex'
  import api from '@/config/api'
  import interact from '@/config/interact'

  export default{
    data () {
      return {}
    },
    methods: {
      ...mapMutations(['modifyUserInfo']),
      toPasswordModify () {
        this.$router.push('/passwordModify')
      },
      toPhoneLink () {
        this.$router.push('/phoneLink')
      },
      toEmailLink () {
        this.$router.push('/emailLink')
      },
      logout () {
        interact.interact('GET', api['logout'], {}, (res) => {
          this.$message.success('退出登录成功！')
          this.modifyUserInfo({})
          if (localStorage.getItem('id')) {
            localStorage.removeItem('id')
          }
          if (localStorage.getItem('user')) {
            localStorage.removeItem('user')
          }
          if (sessionStorage.getItem('id')) {
            sessionStorage.removeItem('id')
          }
          document.cookie = 'id=null;expire=-1'
          this.$router.push('/home')
        })
      }
    },
    store,
    computed: {
      ...mapState(['userInfo'])
    }
  }
</script>

<style lang='less'>
  @import "../../assets/less/base";

  .account-security {
    height: 100%;
    background-color: #F6F6F6;
    .group {
      height: 48px;
      line-height: 48px;
      padding: 0 15px 0 20px;
      background-color: @color-white;
      margin-bottom: 1px;
      font-size: @font-size16;
      color: #7A869D;
      .label {
        color: #3D465B;
      }
      i {
        width: 24px;
        height: inherit;
        background: url("../../assets/images/right-arrow.png") no-repeat center;
        margin-left: 21px;
      }
      &:last-child {
        padding: 0 20px;
        background: @color-f6;
        font-size: 0;
        margin-top: 268px;
        .confirm-btn {
          width: 100%;
          height: 40px;
          border-radius: 4px;
          font-size: @font-size16;
          box-sizing: border-box;
          background-color: @color-4895FD;
          color: @color-white;
          border: 1px solid @color-4895FD;
        }
      }
    }
  }
</style>
