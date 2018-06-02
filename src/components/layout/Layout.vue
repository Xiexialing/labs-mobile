<template>
  <div class="layout">
    <div>
      <SearchInput></SearchInput>
      <Header :activeIndex="currentIndex" @emitCategoryIndex="getCategoryIndex"
              @emitCategoryList="getCategoryList" ref="header"></Header>
    </div>
    <swiper :options="swiperOption" ref="mySwiper">
      <swiper-slide ref="slide0"
                    style="height: inherit;overflow-y: scroll;-webkit-overflow-scrolling: touch;overflow-x: hidden;">
        <Index @emitArticleIdEvent="getArticleId"></Index>
      </swiper-slide>
      <swiper-slide ref="slide1"
                    style="height: inherit;overflow-y: scroll;-webkit-overflow-scrolling: touch;overflow-x: hidden;">
        <ProfessorList @emitProfessorId="getProfessorDetail"></ProfessorList>
      </swiper-slide>
      <swiper-slide :ref="'slide'+ (index+2)" v-for="category,index in this.categoryList"
                    style="height: inherit;overflow-y: scroll;-webkit-overflow-scrolling: touch;overflow-x: hidden;">
        <Category :categName="category.name" :categIndex="index+1" @emitArticleId="getArticleId"></Category>
      </swiper-slide>
    </swiper>
    <router-view></router-view>
    <a id="goTop" @click="goTop" v-if="isShowTop">
      <img src="./top.png" alt="">
    </a>
  </div>
</template>
<script>
  import Header from '@/components/header/Header'
  import Index from '@/page/index/Index'
  import ProfessorList from '@/page/professorList/ProfessorList'
  import Category from '@/page/category/Category'
  import SearchInput from '@/components/searchInput/SearchInput'

  export default{
    data () {
      return {
        categoryList: [],        // 领域列表
        categoryIndex: null,     // 领域名称
        currentIndex: 0,         // 当前滑动的索引值
        swiperOption: {       // 滑动的参数同Swiper的参数
          autoplay: false,
          notNextTick: true
        },
        articleId: null,     // 文章的id
        professorId: null    // 专家的id
      }
    },
    mounted () {
      this.slideChangeTransitionEnd()   // 滑动轮播图时触发的事件
    },
    methods: {
      _initSlideHeight () {
        let clientHeight = document.body.clientHeight - 41 + 'px'
        this.$refs.mySwiper.$el.style.height = clientHeight
      },
      slideChangeTransitionEnd () {    // 滑动页面
        let that = this
        this.swiper.on('slideChangeTransitionEnd', function () {
          that.currentIndex = this.activeIndex
          sessionStorage.setItem('currentIndex', this.activeIndex)
        })
      },
      getCategoryList (list) {     // 获取轮播的领域列表
        list.forEach((v, i) => {
          if (i !== 0) {
            this.categoryList[i] = v
          }
        })
        this.categoryList.shift()
        this.categoryList.shift()
        this.$nextTick(() => {
          this._initSlideHeight()          // 初始化swiper的slide高度
        })
      },
      getCategoryIndex (index) {    // 获取领域名称
        this.categoryIndex = index
      },
      getArticleId (articleId) {
        this.articleId = articleId
        sessionStorage.setItem('article', 'true')
        this.$router.push('/index/articleDetail/' + articleId)
      },
      getProfessorDetail (id) {
        this.professorId = id
        this.$router.push('/index/professorColumn/' + id)
      },
      goTop () {
        let arr = []
        for (let key in this.$refs) {
          if (key.indexOf('slide') !== -1) {
            arr.push(key)
          }
        }
        for (let i = 0; i < arr.length; i++) {
          if (i < 2) {
            this.$refs[arr[i]].$el.scrollTop = 0
          } else {
            this.$refs[arr[i]][0].$el.scrollTop = 0
          }
        }
      }
    },
    computed: {
      swiper () {                       // 获取当前的swiper对象，同时notNextTick必须为true
        return this.$refs.mySwiper.swiper
      },
      isShowTop () {
        if (this.$route.path === '/index') {
          return true
        }
        return false
      }
    },
    watch: {
      categoryIndex (index) {
        this.swiper.slideTo(index, 500)
      }
    },
    components: {
      Header,
      Index,
      Category,
      ProfessorList,
      SearchInput
    }
  }
</script>
<style lang="less">
  .layout {
    .swiper-container {
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      overflow-x: hidden;
    }
    #goTop {
      position: fixed;
      right: 6%;
      bottom: 6%;
      z-index: 1002;
      img {
        width: 48px;
        height: 48px;
      }
    }
  }
</style>



