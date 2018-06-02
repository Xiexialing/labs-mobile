<template>
  <div class="professorList" v-infinite-scroll="loadMore"
       infinite-scroll-disabled="goLoading"
       infinite-scroll-distance="12">
    <div class="item clearfix" v-for="item in dataList" @click="toProfessorDetail(item.id)">
      <img :src="item.head_img?item.head_img:require('./avater.png')" alt="" class="left">
      <div class="infoWrap left">
        <p>
          <span class="author">{{item.username}}</span>
          <span class="artical">文章</span>
          <span class="articalNum">{{item.article_count}}</span>
        </p>
        <p class="presantion">{{item.user_desc}}</p>
      </div>
    </div>
    <div class="loadingMore" v-if="showImg">
      <img src="../../assets/images/loading.gif" alt="">
    </div>
    <div class="noneData" v-if="!showImg">没有更多数据啦~</div>
  </div>
</template>
<script>
  import api from '@/config/api'
  import interact from '@/config/interact'

  export default {
    data () {
      return {
        curPage: 1,    // 初始化请求页
        perPage: 10,
        dataList: [],
        goLoading: false,   // false 为可以无限加载  ，true禁止加载,
        showImg: true
      }
    },
    methods: {
      _initList () {
        interact.interact('GET', api['professor.professorList'] + '?cur_page=' + this.curPage + '&per_page=' + this.perPage, {}, (res) => {
          if (res.list) {
            res.list.forEach((item) => {
              this.dataList.push(item)
            })
            if (res.list.length >= 10) {
              this.goLoading = false
            } else {
              this.showImg = false
            }
          }
        })
      },
      loadMore () {
        this.goLoading = true
        this._initList()
        this.curPage++
      },
      toProfessorDetail (id) {
        this.$emit('emitProfessorId', id)
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../assets/less/base";

  .professorList {
    .item {
      background-color: #fff;
      height: 73px;
      padding: 15px 10px 0;
      margin-bottom: 1px;
      img {
        width: 50px;
        height: 50px;
        border-radius: 25px;
        margin: 4px 15px 0 0;
      }
      .infoWrap {
        width: 290px;
        .author {
          display: inline-block;
          width: 65px;
          font-size: @font-size16;
          line-height: 14px;
          font-weight: bold;
          color: @color-3D465B;
        }
        .artical {
          font-size: @font-size14;
          line-height: 18px;
          color: @color-7A869D;
        }
        .articalNum {
          font-size: @font-size18;
          line-height: 14px;
          color: @color-4895FD;
          font-weight: bold;
        }
        p:first-child {
          margin-bottom: 10px;
        }
        p:nth-child(2) {
          width: 290px;
          font-size: @font-size14;
          line-height: 16px;
          color: @color-7A869D;
        }
      }
    }
    .loadingMore {
      background-color: #fff;
      text-align: center;
      img {
        height: 20px;
      }
    }
    .noneData {
      background-color: #fff;
      text-align: center;
      color: @color-7A869D
    }
  }
</style>
