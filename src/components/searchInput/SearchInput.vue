<template>
  <div class="search-input">
    <form class="outer-wrapper" @submit.prevent="searchSubmit" action="javascript:return true">
      <div class='clearfix'>
        <div class="inner-wrapper">
          <i class="search-icon" @click="searchSubmit"></i>
          <input type="search" ref="searchInp" class="search-inp" v-model.trim="searchInp" placeholder="请输入关键词"
                 @focus="showHistorySearch">
          <i class="clear" v-if="clear" @click="clearInp"></i>
          <i class="microphone" style="display: none;"></i>
        </div>
        <!--<div class="user-icon" v-if="JSON.stringify(userInfo) ==='{}'" @click="toLogin">-->
          <!--<img src="./user-icon.png">-->
        <!--</div>-->
        <!--<div v-if="JSON.stringify(userInfo) !=='{}'" class="user-icon" @click="toMyHome">-->
          <!--<img :src="userInfo.head_img?userInfo.head_img:require('../../assets/images/header.png')">-->
        <!--</div>-->
      </div>
      <div class="drop-down-wrapper" v-if="showHistory">
        <div class="title">历史记录<i @click="clearHistory"></i></div>
        <ul class="content" v-if="historySearch.length>0">
          <li v-for="item in historySearch" @click="searchSubmit(event,item)">{{item | wordsNumberFilter(8)}}</li>
          <li v-if="historySearch.length%2!==0"></li>
        </ul>
        <div v-else class="nodata">
          暂无搜索历史
        </div>
      </div>
    </form>
  </div>
</template>

<script>
  import store from '@/vuex'
  import {mapState} from 'vuex'

  export default{
    data () {
      return {
        searchInp: '',
        historySearch: [],
        showHistory: false
      }
    },
    mounted () {
      this.hideHistorySearch()
      this._initInpStatus()
    },
    methods: {
      _initInpStatus () {
        if (this.$route.path === '/searchInput') {
          this.$refs.searchInp.focus()
          this.showHistory = true
          this.showHistorySearch()
        }
        if (this.$route.query.keyWord) {
          this.searchInp = this.$route.query.keyWord
        }
      },
      showHistorySearch () {
        if (this.$route.path === '/index') {
          this.$router.push('/searchInput')
        }
        this._initHistorySearch()
      },
      hideHistorySearch () {
        if (this.$route.path === '/search') {
          this.showHistory = false
        }
      },
      clearInp () {
        this.searchInp = ''
      },
      searchSubmit (event, item) {
        if (item) {
          this.searchInp = item
        }
        if (this.searchInp.length > 200) {
          this.$message.error('输入的字符数不大于200！')
          return null
        }
        if (this.searchInp) {
          this.addHistorySearch()
          this.$router.push({
            path: '/search',
            query: {
              keyWord: this.searchInp
            }
          })
        }
        return false
      },
      _initHistorySearch () {
        if (window.localStorage.historySearch) {
          this.historySearch = JSON.parse(window.localStorage.historySearch)
        } else {
          this.historySearch = []
        }
      },
      addHistorySearch () {
        this._initHistorySearch()
        if (this.historySearch.indexOf(this.searchInp) === -1) {
          if (this.historySearch.length >= 12) {
            this.historySearch.pop()
          }
          this.historySearch.unshift(this.searchInp)
          window.localStorage.historySearch = JSON.stringify(this.historySearch)
        }
      },
      clearHistory () {
        window.localStorage.removeItem('historySearch')
        this.historySearch = []
      },
      toLogin () {
        this.$router.push('/login')
      },
      toMyHome () {
        this.$router.push('/home')
      }
    },
    store,
    computed: {
      ...mapState(['userInfo']),
      clear () {
        if (this.searchInp) {
          return this.searchInp.length > 0
        }
      }
    },
    watch: {
      $route () {
        this.searchInp = this.$route.query.keyWord
      }
    }
  }
</script>

<style lang='less'>
  @import "../../assets/less/base.less";

  .search-input {
    height: 4.8*@height;
    .outer-wrapper {
      position: fixed;
      width: 100%;
      left: 0;
      top: 0;
      z-index: 10;
      .clearfix {
        background-color: #38373D;
        overflow: hidden;
        .inner-wrapper {
          position: relative;
          float: left;
          margin-left: 1.5*@margin;
          height: 4.8*@height;
          input {
            display: inline-block;
            position: relative;
            z-index: 2;
            width: 34.5*@width;
            height: 3.2*@height;
            border-radius: 4px;
            background-color: #9B9B9E;
            border: none;
            padding-left: 44px;
            padding-right: 57px;
            margin-top: 8px;
            box-sizing: border-box;
            font-size: @font-size14;
            -webkit-appearance: none;
            &::-webkit-input-placeholder {
              color: #EBEBEB;
            }
            &.search-inp {
              color: @color-white;
            }
          }
          input[type=search]::-webkit-search-cancel-button {
            -webkit-appearance: none; // 此处只是去掉默认的小×
          }
          .search-icon {
            display: inline-block;
            width: 24px;
            height: 24px;
            position: absolute;
            z-index: 10;
            left: 10px;
            top: 13px;
            background: url("./search-icon.png") no-repeat center;
            background-size: 20px;
          }
          .clear {
            display: inline-block;
            width: 24px;
            height: 24px;
            position: absolute;
            z-index: 10;
            top: 12px;
            right: 4px;
            background: url("./clear.png") no-repeat center;
            background-size: 16px;
          }
          .microphone {
            display: inline-block;
            width: 24px;
            height: 24px;
            position: absolute;
            z-index: 10;
            top: 12px;
            right: 4px;
            background: url("./microphone.png") no-repeat center;
            background-size: 16px;
          }
        }
        .user-icon {
          float: left;
          img {
            display: inline-block;
            margin-top: 8px;
            width: 3.2*@width;
            height: 3.2*@height;
            margin-left: 12px;
            border-radius: 50%;
          }
        }
      }
      .drop-down-wrapper {
        background-color: @color-f6;
        .title {
          height: 40px;
          line-height: 40px;
          color: @color-A4ABB1;
          font-size: @font-size14;
          background-color: @color-white;
          box-sizing: border-box;
          padding: 0 20px;
        }
        i {
          float: right;
          width: 18px;
          height: 18px;
          background: url("./trash.png") no-repeat center;
          background-size: 14px;
          margin-top: 11px;
        }
        .content {
          overflow: hidden;
          background-color: @color-white;
          li {
            float: left;
            width: 50%;
            color: @color-3D465B;
            font-size: @font-size14;
            height: 40px;
            line-height: 40px;
            box-sizing: border-box;
            padding-right: 20px;
            padding-left: 20px;
            border-top: 1px solid #F6F6F6;
            &:nth-child(odd) {
              border-right: 1px solid #F6F6F6;
            }
          }
        }
        .nodata {
          background-color: @color-white;
          text-align: center;
          line-height: 40px;
          color: @color-3D465B;
          font-size: @font-size14;
        }
      }
    }
  }
</style>
