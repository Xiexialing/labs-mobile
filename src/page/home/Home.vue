<template>
  <div class="home">
    <div class="user-wrapper" v-if="JSON.stringify(userInfo)==='{}'" @click="toLogin">
      <div>
        <img class="user-image" :src="userInfo.head_img?userInfo.head_img:require('../../assets/images/header.png')">
      </div>
      <p class="login">
        <span @click="toLogin">登录</span>
        <span>/</span>
        <span @click.stop="toRegister">注册</span>
      </p>
    </div>
    <div class="user-wrapper" v-if="JSON.stringify(userInfo)!=='{}'" @click="toPersonalInfo">
      <div>
        <img class="user-image" :src="userInfo.head_img?userInfo.head_img:require('../../assets/images/header.png')">
      </div>
      <div class="user-info">
        <p class="username">{{userInfo.account}}</p>
        <p class="intro">{{userInfo.user_desc ? userInfo.user_desc : '用户太忙，暂无内容。'}}</p>
      </div>
    </div>
    <ul class="operate-list">
      <li @click="toAccountSecurity">账号安全<i></i></li>
      <li @click="toMyCollections">我的收藏<i></i></li>
      <li @click="toAdviceFeedback">意见反馈<i></i></li>
      <li @click="toAboutUs">关于移动Labs<i></i></li>
    </ul>
  </div>
</template>

<script>
  import store from '@/vuex'
  import {mapState, mapActions} from 'vuex'

  export default{
    data () {
      return {}
    },
    methods: {
      ...mapActions(['modifyUserInfoAction']),
      toAccountSecurity () {
        if (this.userInfo !== '{}') {
          this.$router.push('/accountSecurity')
        } else {
          this.$router.push('/login')
        }
      },
      toLogin () {
        if (JSON.stringify(this.userInfo) === '{}') {
          this.$router.push('/login')
          return false
        }
        return true
      },
      toRegister () {
        this.$router.push('/register')
      },
      toPersonalInfo () {
        this.$router.push('/personalInfo')
      },
      toAboutUs () {
        this.$router.push('/aboutUs')
      },
      toAdviceFeedback () {
        if (this.userInfo !== '{}') {
          this.$router.push('/adviceFeedback')
        } else {
          this.$router.push('/login')
        }
      },
      toMyCollections () {
        if (this.userInfo !== '{}') {
          this.$router.push('/myCollections')
        } else {
          this.$router.push('/login')
        }
      }
    },
    store,
    computed: {
      ...mapState(['userInfo'])
    }
  }
</script>

<style lang='less'>
  @import "../../assets/less/base.less";

  .home {
    .user-wrapper {
      text-align: center;
      background-color: @color-white;
      margin-bottom: @margin;
      font-size: 0;
      .user-image {
        width: 10*@width;
        height: 10*@height;
        border-radius: 50%;
        margin-top: 3.2*@margin;
      }
      .login {
        font-size: @font-size14;
        color: @color-7A869D;
        line-height: 1.4*@height;
        height: 1.4*@height;
        padding-top: 30px;
        padding-bottom: 44px;
      }
      .user-info {
        .username {
          font-size: @font-size16;
          color: @color-3D465B;
          margin: 2*@margin 0 @margin 0;
          font-weight: bold;
          height: 16px;
          line-height: 16px;
        }
        .intro {
          font-size: @font-size14;
          color: @color-7A869D;
          padding-bottom: 2.8*@margin;
          height: 14px;
          line-height: 14px;
        }
      }
    }
    .operate-list {
      li {
        background-color: @color-white;
        height: 4.8*@height;
        line-height: 4.8*@height;
        font-size: @font-size16;
        color: @color-3D465B;
        box-sizing: border-box;
        padding: 0 1.5*@padding 0 2*@padding;
        margin-bottom: 1px;
        &:last-child {
          margin-top: 9px;
        }
        > i {
          float: right;
          width: 2.4*@width;
          height: inherit;
          background: url("../../assets/images/right-arrow.png") no-repeat center;
        }
      }
    }
  }
</style>
