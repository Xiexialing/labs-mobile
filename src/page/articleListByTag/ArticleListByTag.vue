<template>
  <div class="article-list-tag" ref="articleListWrapper">
    <h1 class="tag-name">{{tagName}}</h1>
    <div class="article-wrapper" v-infinite-scroll="loadMore"
         infinite-scroll-disabled="busy"
         infinite-scroll-distance="12">
      <div class="article-list" v-for="article,index in articleList">
        <div class="article-cell"
             v-if="(index+1)%5 === 1 || (index+1)%5 === 2 || (index+1)%5 === 3 || (index+1)%5 === 4">
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
        <div class="article-middle-cell" v-if="(index+1)%5 === 0">
          <a @click.stop.prevent="toArticleDetail(article.id)">
            <h1 v-text="article.title"></h1>
            <div class="article-pic">
              <img v-lazy="article.pic_pc" alt="">
            </div>
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
          </a>
        </div>
      </div>
      <div v-if="isLoading" class="loading">
        <img src="../../assets/images/loading.gif" alt="">加载中...
      </div>
      <div v-if="noMoreInfo" class="loading">
        我是有底线的~
      </div>
    </div>
    <div class="no-result" v-if="noResult">
      <img src="../../assets/images/noResult.png" alt="">
      <p>搜索不到相关结果</p>
    </div>
  </div>
</template>

<script>
  import api from '@/config/api'
  import interact from '@/config/interact'
  import touch from '@/assets/js/touch'

  export default{
    data () {
      return {
        articleList: [],
        currentPage: 1,     // 当前请求页
        pageSize: 10,        // 每页请求数
        tagName: '',
        busy: false,        // 下拉是否允许 false可以下拉  true禁止
        isLoading: true,
        noMoreInfo: false,
        noResult: false    // 没有数据
      }
    },
    mounted () {
      this._touchEvent()
    },
    methods: {
      _initArticleList () {
        let url = ''
        this.tagName = this.$route.query.tagName
        url = api['articleListByTag'] + '?tag_name=' + encodeURIComponent(this.tagName) + '&per_page=' + this.pageSize + '&cur_page=' + this.currentPage
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
            } else {
              this.isLoading = false
              this.noMoreInfo = true
            }
          }
        })
      },
      _touchEvent () {
        touch.touchX(this.$refs.articleListWrapper, () => {
          window.history.back(-1)
        })
      },
      toArticleDetail (articleId) {
        sessionStorage.setItem('article', 'true')
        this.$router.push('/index/articleDetail/' + articleId)
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
  @import "../../assets/less/base.less";

  .article-list-tag {
    min-height: 100%;
    .tag-name {
      color: #FF5555;
      font-size: @font-size16;
      height: 40px;
      line-height: 40px;
      box-sizing: border-box;
      padding-left: 20px;
      background-color: @color-white;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .no-result {
      padding-top: 12.6*@margin;
      text-align: center;
      img {
        width: 20*@width;
        margin-bottom: 3.4*@margin;
      }
      p {
        font-size: @font-size14;
        line-height: 18px;
        color: #31424F;
      }
    }
    .article-wrapper {
      .article-cell {
        background-color: @color-white;
        padding: 10px 2.667%;
        box-sizing: border-box;
        margin-bottom: 1px;
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
      .article-pic-wrapper {
        box-sizing: border-box;
        padding: @padding 2.667%;
        background-color: @color-white;
        height: 20*@width;
        line-height: 20*@height;
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
      .article-middle-cell {
        background-color: @color-white;
        padding: 15px 2.667% 10px;
        box-sizing: border-box;
        margin-bottom: 1px;
        a {
          display: block;
          h1 {
            font-size: @font-size16;
            color: @color-000;
            line-height: 2*@height;
            margin-bottom: @margin;
            font-weight: normal;
          }
          .article-pic {
            width: 100%;
            margin-bottom: @margin;
            height: 20*@height;
            line-height: 20*@height;
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
          .article-source {
            font-size: 0;
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
      }
      .loading {
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
