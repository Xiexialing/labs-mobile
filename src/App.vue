<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import store from '@/vuex'
  import {mapState, mapActions} from 'vuex'
  import api from '@/config/api'
  import interact from '@/config/interact'

  export default {
    name: 'app',
    mounted () {
      this._initId()
    },
    methods: {
      ...mapActions(['modifyUserInfoAction']),
      _initId () {
        let id = localStorage.getItem('id') || sessionStorage.getItem('id')
        if (id) {
          sessionStorage.setItem('id', id)
          document.cookie = 'id=' + id
          let user = JSON.parse(sessionStorage.getItem('user'))
          let data = {
            passwd: user.password
          }
          if (/^1[34578]\d{9}$/.test(user.account)) {
            data.phone = user.account
          } else {
            data.email = user.account
          }
          this.login(data)
        }
      },
      getUserDetailInfo () {
        interact.userInter('GET', api['getUserDetailInfo'], {}, (res) => {
          this.modifyUserInfoAction(res.result)
        })
      },
      login (data) {
        interact.userInter('POST', api['login'], data, (res) => {
          if (res.code === '000000') {
            this.getUserDetailInfo()
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
    store
  }
</script>

<style lang="less">
  @import "assets/less/base.less";

  #app {
    height: 100%;
    width: 100%;
    font-family: 'PingFangSC';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #F6F6F6;
  }
</style>
