<template>
  <div class="professor-column">
    <div class="professor-column-wrapper" ref="professorColumnWrapper">
      <div class="content">
        <div class="header clearfix">
          <div class="loading" v-if="!dataList.professorInfo">
            <img src="../../assets/images/loading.gif" alt="">加载中...
          </div>
          <img :src="dataList.professorInfo.head_img?dataList.professorInfo.head_img:require('./avater.png')" alt=""
               class="left">
          <div class="left">
            <p>
              <span class="author">{{dataList.professorInfo.username}}</span>
              <span class="artical">文章：{{dataList.professorInfo.article_count}}</span>
            </p>
            <p>
              <span class="presention">专家介绍:</span>
              <span class="presentionInfo">{{dataList.professorInfo.user_desc}}</span>
            </p>
          </div>
        </div>
        <div v-if="dataList.professorArticle.length>0">
          <ul>
            <li class="articelList clearfix" v-for="item in dataList.professorArticle"
                @click="toArticleDetail(item.id)">
              <div class="container left">
                <p class="title">{{item.title}}</p>
                <span class="viewCount">{{item.view_count}}阅读</span>
                <time>{{item.publish_time | dateFormat('yyyy-MM-dd')}}</time>
              </div>
              <img :src="item.pic_pc" alt="">
            </li>
          </ul>
          <div class="loadingMore" v-if="!noneData">
            <img src="../../assets/images/loading.gif" alt="">
          </div>
          <div class="noneData" v-if="noneData">我是有底线的~</div>
        </div>
        <div v-if="noneArticle" class="noneArticle">暂无文章，看看别的专家的吧~</div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  import touch from '@/assets/js/touch'
  import api from '@/config/api'
  import interact from '@/config/interact'

  export default {
    data () {
      return {
        professorName: null,
        curentPage: 1,
        perPage: 10,
        dataList: {
          professorInfo: {},
          professorArticle: []
        },
        noneData: false,
        scroll: '',
        options: {              // better-scroll的参数
          pullUpLoad: {
            threshold: -12      // 在上拉到超过底部 12px 时，触发 pullingUp 事件
          },
          click: true
        },
        noneArticle: false
      }
    },
    mounted () {
      this._initList()
      this._touchEvent()
    },
    methods: {
      _initList () {
        this.professorId = this.$route.params.professorId
        interact.interact('GET', api['professor.professorInfo'] + '?id=' + this.professorId, {}, (res) => {
          this.dataList.professorArticle = []
          this.curentPage = 1
          this.dataList.professorInfo = res
          this.professorName = res.username
          this._initArticleList()
        })
      },
      _touchEvent () {
        touch.touchX(this.$refs.professorColumnWrapper, () => {
          window.history.back(-1)
        })
      },
      _initArticleList () {
        interact.interact('GET', api['professor.professorAtricle'] + '?per_page=' + this.perPage + '&cur_page=' + this.curentPage + '&author=' + this.professorName, {}, (res) => {
          if (res.list.length > 0) {
            res.list.forEach((item) => {
              this.dataList.professorArticle.push(item)
            })
          }
          if (this.dataList.professorArticle.length === 0) {
            this.noneArticle = true
          }
          if (res.list.length < 10) {
            this.noneData = true
            this.options.pullUpLoad = false
          }
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.professorColumnWrapper, this.options)
            }
            this._initPullingUp()
            this.scroll.finishPullUp()
            this.scroll.refresh()
          })
        })
      },
      _initPullingUp () {
        this.scroll.on('pullingUp', () => {
          this.loadMore()
        })
      },
      loadMore () {
        this.curentPage++
        this._initArticleList()
      },
      toArticleDetail (id) {
        let professorId = this.$route.params.professorId
        sessionStorage.setItem('article', 'true')
        this.$router.push('/index/professorColumn/' + professorId + '/articleDetail/' + id)
      }
    },
    watch: {
      professorId () {
        this._initList()
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../assets/less/base";

  .professor-column {
    .professor-column-wrapper {
      position: fixed;
      top: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      left: 0;
      background-color: @color-f6;
      z-index: 100;
      overflow: hidden;
      transition: @transition-duration;
      .content {
        min-height: 100%;
        .header {
          padding: 15px 18px 15px;
          height: 90px;
          background-color: #fff;
          color: @color-3D465B;
          margin-bottom: 1px;
          p {
            width: 234px;
            margin-bottom: 10px;
          }
          img {
            width: 90px;
            height: 90px;
            margin-right: 15px;
          }
          .author {
            color: #000;
          }
          .author, .artical {
            font-size: @font-size14;
            line-height: 14px;
            font-weight: bold;
          }
          .artical {
            color: @color-4895FD;
            margin-left: 10px;
          }
          .presention {
            font-weight: bold;
          }
        }
        .articelList {
          padding: 10px;
          background-color: #fff;
          margin-bottom: 1px;
          .container {
            width: 185px;
            margin-right: 30px;
            .title {
              font-size: @font-size16;
              color: rgba(0, 0, 0, 1);
              line-height: 20px;
              margin-bottom: 22px;
            }
            span, time {
              font-size: 12px;
              color: @color-A4ABB1;
              line-height: 12px;
            }
            span {
              margin-right: 12px;
            }
          }
          img {
            width: 140px;
            height: 80px;
          }
        }
        .noneArticle {
          height: 80px;
          line-height: 80px;
          font-size: @font-size20;
          text-align: center;
          color: @color-A4ABB1;
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
          color: @color-7A869D;
        }
      }
    }
  }
</style>
