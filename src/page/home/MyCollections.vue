<template>
  <div class="my-collections">
    <div class="article-wrapper" v-infinite-scroll="loadMore"
         infinite-scroll-disabled="busy"
         infinite-scroll-distance="12" ref="articleWrapper">
      <div class="article-list" v-for="article,index in articleList">
        <div class="article-cell">
          <a @click.stop.prevent="toArticleDetail(article.id)">
            <div class="article-left">
              <h1 v-html="article.title"></h1>
              <div class="article-source" v-if="article.article_source === '专家原创'">
                <img class="avatar" :src="article.head_img?article.head_img:require('./avater.png')" alt="">
                <span v-text="article.author"></span>
                <span>{{article.publish_time | countMinutes}}</span>
              </div>
              <div class="article-source" v-else>
                <img class="avatar" src="./zhuan.png" alt="" width="20">
                <span>{{article.source_website | wordsNumberFilter(6)}}</span>
                <span>{{article.publish_time | countMinutes}}</span>
              </div>
            </div>
            <div class="article-right">
              <img v-lazy="article.pic_pc" alt="">
            </div>
          </a>
        </div>
        <p class="cancel-collection" @click="cancelCollection(article.id, index)">取消收藏</p>
      </div>
      <div v-if="isLoading" class="loading">
        <img src="../../assets/images/loading.gif" alt="">
        加载中...
      </div>
      <div v-if="noMoreInfo" class="loading">
        我是有底线的~
      </div>
    </div>
    <div class="no-result" v-if="noResult">
      <img src="../../assets/images/noCollection.png" alt="">
      <p>主人，你还没有收藏的内容</p>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import api from '@/config/api'
  import interact from '@/config/interact'
  import cancelCollection from '@/assets/js/cancelCollection'

  export default{
    data () {
      return {
        articleList: [],
        currentPage: 1,     // 当前请求页
        pageSize: 10,        // 每页请求数
        busy: false,        // 下拉是否允许 false可以下拉  true禁止
        isLoading: false,
        noMoreInfo: false,
        noResult: false    // 没有数据
      }
    },
    mounted () {
      this._initSwipe()
    },
    methods: {
      _initArticleList () {
        this.isLoading = true
        let url = ''
        url = api['getCollections'] + '?per_page=' + this.pageSize + '&cur_page=' + this.currentPage
        interact.interact('GET', url, {}, (response) => {
          let list = response.list
          if (list) {
            list.forEach((v) => {
              this.articleList.push(v)
            })
            if (this.articleList.length === 0) {
              this.isLoading = false
              this.noResult = true
              this.noMoreInfo = false
            } else if (list.length >= 10) {
              this.busy = false
              this.isLoading = false
            } else {
              this.isLoading = false
              this.noMoreInfo = true
            }
          }
        })
      },
      cancelCollection (articleId, index) {
        let data = {
          article_id: articleId
        }
        interact.interact('POST', api['cancelCollections'], data, (res) => {
          this.$message.success('取消成功！')
          let children = this.$refs.articleWrapper.getElementsByClassName('article-list')
          for (let i = 0; i < children.length; i++) {
            children[i].className = 'article-list'
          }
          if (index === 0) {
            this.articleList.shift()
          } else if (index === this.articleList.length - 1) {
            this.articleList.pop()
          } else {
            this.articleList = this.articleList.slice(0, index).concat(this.articleList.slice(index + 1))
          }
          if (this.articleList.length <= 6 && !this.busy) {
            this.loadMore()
          }
          if (this.articleList.length === 0) {
            this.isLoading = false
            this.noResult = true
            this.noMoreInfo = false
          }
        })
      },
      _initSwipe () {
        cancelCollection.swipe(this.$refs.articleWrapper)
      },
      toArticleDetail (articleId) {
        sessionStorage.setItem('article', 'true')
        this.$router.push('/myCollections/articleDetail/' + articleId)
      },
      loadMore () {
        this.busy = true
        this._initArticleList()
        this.currentPage++
      }
    }
  }
</script>

<style lang='less'>
  @import "../../assets/less/base";

  .my-collections {
    width: 100%;
    min-height: 100%;
    display: flex;
    .no-result {
      padding-top: 11.4*@margin;
      width: 100%;
      box-sizing: border-box;
      background-color: @color-white;
      text-align: center;
      img {
        width: 19*@width;
        height: 13.8*@height;
        margin-bottom: 2.3*@margin;
      }
      p {
        font-size: @font-size14;
        line-height: 18px;
        color: #31424F;
      }
    }
    .article-wrapper {
      overflow-x: hidden;
      .article-list {
        position: relative;
        transition: 0.5s;
        .article-cell {
          background-color: @color-white;
          padding: 10px 2.667%;
          box-sizing: border-box;
          margin-bottom: 1px;
          font-size: 0;
          a {
            display: block;
            .clearfix();
            .article-left {
              float: left;
              width: 18.5*@width;
              margin-right: 3*@margin;
              h1 {
                font-size: @font-size16;
                color: @color-000;
                line-height: 2*@height;
                font-weight: normal;
                word-break: break-all;
              }
              .article-source {
                font-size: 0;
                margin-top: 1.7*@margin;
                .avatar {
                  width: 2*@width;
                  height: 2*@height;
                  border-radius: 50%;
                  display: inline-block;
                  vertical-align: middle;
                  margin-right: 5px;
                }
                span {
                  display: inline-block;
                  font-size: @font-size12;
                  line-height: 1.2*@height;
                  color: @color-A4ABB1;
                  vertical-align: middle;
                  margin-right: @margin;
                }
              }
            }
            .article-right {
              display: inline-block;
              width: 14*@width;
              height: 8*@height;
              line-height: 8*@height;
              text-align: center;
              img {
                width: 32px;
                height: 32px;
              }
              img[lazy=loaded], img[lazy=error] {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
        .cancel-collection {
          position: absolute;
          left: 101%;
          top: 0;
          width: 150px;
          text-align: center;
          height: 100px;
          line-height: 100px;
          font-size: @font-size18;
          background-color: #FF5555;
          color: @color-white;
        }
      }
      .loading {
        min-width: 375px;
        height: 24px;
        line-height: 24px;
        background-color: #F6F6F6;
        text-align: center;
        font-size: @font-size14;
        > img {
          width: 2.4*@width;
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
  }
</style>
