<template>
  <div class="category">
    <div :class="{'carousel-component-wrapper':categName !== '推荐'}" v-if="carouselListLength">
      <Carousel :categName="categName" @emitCarouselListLength = 'getCarouselListLength'></Carousel>
    </div>
    <div class="article-wrapper" v-infinite-scroll="loadMore"
         infinite-scroll-disabled="busy"
         infinite-scroll-distance="12">
      <div class="article-list" v-for="article,index in articleList">
        <div class="article-cell"
             v-if="(index+1)%5 === 1 || (index+1)%5 === 2 || (index+1)%5 === 3 || (index+1)%5 === 4">
          <a @click.stop.prevent="toArticleDetail(article.id)">
            <div class="article-left">
              <h1 v-text="article.title"></h1>
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
      <div v-if="!isLoading" class="loading">
        我是有底线的~
      </div>
    </div>
  </div>
</template>

<script>
  import api from '@/config/api'
  import interact from '@/config/interact'
  import Carousel from '@/components/carousel/Carousel'

  export default{
    props: {
      categIndex: {
        type: Number,
        default: 0
      },
      categName: {
        type: String,
        default: '推荐'
      }
    },
    data () {
      return {
        articleList: [],    // 推荐文章列表
        currentPage: 1,     // 当前请求页
        pageSize: 10,        // 每页请求数
        busy: false,        // 下拉是否允许 false可以下拉  true禁止
        isLoading: true,
        carouselListLength: -1   // 轮播图的数组长度
      }
    },
    methods: {
      _initArticleList () {
        let url = ''
        if (this.categName === '推荐') {    // 推荐新闻列表
          url = api['index.recommend'] + '?per_page=' + this.pageSize + '&cur_page=' + this.currentPage
        } else {                           // 其他领域列表
          url = api['category.articles'] + '?category=' + this.categName + '&per_page=' + this.pageSize + '&cur_page=' + this.currentPage
        }
        interact.interact('GET', url, {}, (response) => {
          let list = response.list || response.competitive_article.list
          if (list) {
            list.forEach((v) => {
              this.articleList.push(v)
            })
            if (list.length >= 10) {
              this.busy = false
            } else {
              this.isLoading = false
            }
          }
        })
      },
      toArticleDetail (articleId) {
        this.$emit('emitArticleId', articleId)
      },
      loadMore () {
        this.busy = true
        this._initArticleList()
        this.currentPage++
      },
      getCarouselListLength (len) {
        this.carouselListLength = len
      }
    },
    components: {
      Carousel
    }
  }
</script>

<style lang='less'>
  @import "../../assets/less/base";

  .category {
    .carousel-component-wrapper {
      padding: @padding 2.667% 0;
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
