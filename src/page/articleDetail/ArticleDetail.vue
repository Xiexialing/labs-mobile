<template>
  <div class="article-detail">
    <div class="loading" v-if="!detailInfo">
      <img src="../../assets/images/loading.gif" alt="">加载中...
    </div>
    <div class="article-detail-wrapper" ref="articleDetailWrapper">
      <div class="articleMain" v-if="detailInfo">
        <div class="articleDetail">
          <header>{{detailInfo.title}}</header>
          <div class="articalInfo clearfix">
            <img v-if="detailInfo.article_source=== '专家原创'"
                 :src="detailInfo.author_detail.head_img?detailInfo.author_detail.head_img:require('./avater.png')"
                 class="left">
            <img v-if="detailInfo.article_source=== '转载'" src="../../assets/images/zhuan.png" alt="" class="left">
            <div class="info left" v-if="detailInfo.article_source=== '专家原创'">
              <p class="author">{{detailInfo.author_detail.username}}</p>
              <time>{{detailInfo.publish_time | dateFormat('yyyy-MM-dd hh:mm')}}</time>
              <span>浏览量：{{detailInfo.view_count}}</span>
            </div>
            <div class="info left" v-if="detailInfo.article_source=== '转载'">
              <p class="author">{{detailInfo.source_website}}</p>
              <time>{{detailInfo.publish_time | dateFormat('yyyy-MM-dd hh:mm')}}</time>
              <span>浏览量：{{detailInfo.view_count}}</span>
            </div>
          </div>
          <div class="mainArtical" v-html="detailInfo.content" @click.stop="enlargeImg"></div>
          <div class="tagContainer clearfix">
            <span v-for="tag in tags" @click="toArticleListByTag(tag)">{{tag}}</span>
          </div>
        </div>
        <div class="copyRight" v-if="detailInfo.article_source=== '专家原创'">
          <p>版权声明</p>
          <p>*专家文章为作者独立观点，不代表移动Labs立场. </p>
          <p>转载此文章须经作者同意，并请附上出处(移动Labs)及本页链接。</p>
        </div>
        <div class="copyRight" v-if="detailInfo.article_source === '转载'">
          <p v-if="true"></p>
          <p>内容和相关图片转载自网络。对于原创作品，转载请注明文章出处，原作谨代表作者观点。</p>
        </div>
      </div>
    </div>
    <div class="fixed-bottom">
      <!--<div>-->
        <!--<img src="../../assets/images/share.png" alt="">-->
        <!--<span>分享</span>-->
      <!--</div>-->
      <!--<div @click="collectFn">-->
        <!--<img-->
          <!--:src="!collection?require('../../assets/images/collection.png'):require('../../assets/images/active-collection.png')"-->
          <!--alt="">-->
        <!--<span v-if="!collection">收藏</span>-->
        <!--<span class="collected" v-if="collection">已收藏</span>-->
      <!--</div>-->
      <!--<div @click="dianzanFn">-->
        <!--<img-->
          <!--:src="!dianzan?require('../../assets/images/dianzan.png'):require('../../assets/images/active-dianzan.png')"-->
          <!--alt="">-->
        <!--<span class="dianzan" :class="{'active':dianzan}">赞</span>-->
        <!--<span :class="{'active':dianzan}">{{thumbUpCount}}</span>-->
      <!--</div>-->
    </div>
    <transition name="showImg">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
  import touch from '@/assets/js/touch'
  import api from '@/config/api'
  import interact from '@/config/interact'
  import BScroll from 'better-scroll'
  import store from '@/vuex'
  import {mapState} from 'vuex'

  export default {
    data () {
      return {
        detailInfo: null,
        picSrc: '',
        articleScroll: '',
        collection: false, // 收藏状态：false：未收藏，true：收藏
        dianzan: false,
        thumbUpCount: 10   // 点赞总数
      }
    },
    mounted () {
      this._initDetail()
      this._touchEvent()
    },
    methods: {
      _initDetail () {
        this.articleId = this.$route.params.articleId
        if (this.articleId) {
          interact.interact('GET', api['articalDetail'] + '?id=' + this.articleId, {}, (response) => {
            this.detailInfo = response
            this.collection = response.is_collect === 1
            this.dianzan = response.is_thumb_up === 1
            this.thumbUpCount = response.thumb_up_count
            this._initScroll()
          })
        }
      },
      _initScroll () {
        this.$nextTick(() => {
          this.articleScroll = new BScroll(this.$refs.articleDetailWrapper, {
            click: true
          })
          let that = this
          this.articleScroll.on('scrollEnd', function (pos) {
            if (that.articleScroll.maxScrollY === pos.y) {
              that.articleScroll.scrollTo(0, that.articleScroll.maxScrollY)
            }
          })
        })
      },
      _touchEvent () {
        touch.touchX(this.$refs.articleDetailWrapper, () => {
          let value = sessionStorage.getItem('article')
          if (value) {
            window.history.back(-1)
          } else {
            this.$router.push('/')
          }
        })
      },
      toArticleListByTag (tagName) {
        this.$router.push({
          path: '/articleListByTag',
          query: {
            tagName: tagName
          }
        })
      },
      collectFn () {
        if (JSON.stringify(this.userInfo) === '{}') {
          this.$message.warning('收藏前请先登录！')
          return
        }
        let data = {
          article_id: this.articleId
        }
        if (!this.collection) {    // 收藏文章
          interact.userInter('POST', api['collect'], data, (res) => {
            if (res.code === '000000') {
              this.$message.success('收藏成功！')
              this.collection = !this.collection
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          interact.userInter('POST', api['cancelCollect'], data, (res) => {
            if (res.code === '000000') {
              this.$message.warning('取消收藏成功！')
              this.collection = !this.collection
            } else {
              this.$message.error(res.message)
            }
          })
        }
      },
      dianzanFn () {
        if (JSON.stringify(this.userInfo) === '{}') {
          this.$message.warning('点赞前请先登录！')
          return
        }
        let data = {
          article_id: this.articleId
        }
        if (!this.dianzan) {    // 收藏文章
          this.thumbUpCount++
          interact.userInter('POST', api['thumbUp'], data, (res) => {
            if (res.code === '000000') {
              this.$message.success('点赞成功！')
              this.dianzan = !this.dianzan
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          this.thumbUpCount--
          interact.userInter('POST', api['cancelThumbUp'], data, (res) => {
            if (res.code === '000000') {
              this.$message.warning('取消点赞成功！')
              this.dianzan = !this.dianzan
            } else {
              this.$message.error(res.message)
            }
          })
        }
      },
      enlargeImg (e) {    // 点击放大图片
        if (e.target.tagName === 'IMG') {
          let path = this.$route.path
          this.picSrc = e.target.src
          this.$router.push({
            path: path + '/imgModal',
            query: {
              imgSrc: this.picSrc
            }
          })
        }
      }
    },
    computed: {
      ...mapState(['userInfo']),
      tags () {
        if (this.detailInfo.tag) {
          return this.detailInfo.tag.split(',')
        }
        return ''
      }
    },
    watch: {
      articleId () {
        this._initDetail()
      }
    },
    store
  }
</script>
<style lang="less">
  @import "../../assets/less/base";

  .article-detail {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    left: 0;
    background-color: #fff;
    z-index: 100;
    overflow: hidden;
    transition: @transition-duration;
    > .loading {
      text-align: center;
      font-size: @font-size14;
      img {
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
      }
    }
    .article-detail-wrapper {
      height: 100%;
      .articleDetail {
        width: 355px;
        padding-top: 10px;
        margin: 0 auto;
        color: @color-3D465B;
        header {
          display: block;
          line-height: 2.4*@height;
          margin-bottom: 21px;
          font-size: 18px;
          font-weight: bold;
          word-break: break-all;
        }
        .articalInfo {
          font-size: @font-size12;
          line-height: 12px;
          margin-bottom: 20px;
          img {
            width: 30px;
            height: 30px;
            margin-right: 10px;
            border-radius: 15px;
          }
          .info {
            width: 314px;
            p {
              font-weight: bold;
              margin-bottom: 6px;
            }
            time, span {
              margin-right: 10px;
              color: #A4ABB1;
            }
          }
        }
        .mainArtical {
          margin-bottom: 30px;
          p {
            margin-top: 10px;
            margin-bottom: 10px;
            line-height: 2em;
            word-break: break-all;
            span {
              font-size: @font-size14 !important;
              color: rgba(61, 70, 91, 1);
              word-break: break-all;
            }
          }
          img {
            max-width: 100% !important;
          }
        }
        .tagContainer {
          margin-bottom: 14px;
          span {
            float: left;
            padding: 2px 10px;
            color: @color-7A869D;
            font-size: @font-size12;
            line-height: 20px;
            background-color: rgba(246, 246, 246, 1);
            border-radius: @border-radius4;
            margin-right: 10px;
            margin-bottom: 10px;
          }
        }
      }
      .copyRight {
        padding: 10px 20px 60px;
        background: rgba(250, 250, 250, 1);
        p:first-child {
          font-size: @font-size14;
          line-height: 14px;
          font-weight: bold;
          margin-bottom: 10px;
          color: @color-3D465B;
        }
        p:nth-child(2) {
          color: @color-7A869D;
        }
        p:nth-child(3) {
          color: @color-7A869D;
        }
      }
      .showImg-enter-active, .showImg-leave-active {
        transition: opacity 1s;
      }
      .showImg-enter, .showImg-to {
        opacity: 0;
      }
    }
    .fixed-bottom {
      background-color: #FAFAFA;
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      display: flex;
      justify-content: space-around;
      > div {
        height: 48px;
        line-height: 48px;
        flex: 1;
        text-align: center;
        font-size: 0;
        img {
          width: 22px;
          height: 22px;
          display: inline-block;
          vertical-align: middle;
          margin-right: 5px;
        }
        span {
          display: inline-block;
          vertical-align: middle;
          font-size: @font-size16;
          color: @color-7A869D;
          &.dianzan {
            display: inline-block;
            margin-right: 5px;
          }
          &.collected {
            color: #F5A623;
          }
          &.active {
            color: #FF5555;
          }
        }
      }
    }
  }

</style>
