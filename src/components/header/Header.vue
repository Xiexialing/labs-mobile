<template>
  <div class="header">
    <div class="category-wrapper" ref="categoryWrapper">
      <ul class="slider-group" ref="sliderGroup">
        <li v-for="category,index in categoryList">
          <a :class="{'active': index === currentIndex}" @click="gotoCategory(index)">{{category.name}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import BScroll from 'better-scroll'
  import api from '@/config/api'
  import interact from '@/config/interact'

  export default{
    props: {
      activeIndex: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        categoryList: [],    // 领域列表,
        currentIndex: 0,     // 被选中的领域
        navScroll: ''        // 导航容器
      }
    },
    mounted () {
      this._initCategoryList()
    },
    methods: {
      _initCategoryList () {     // 初始化领域列表
        interact.interact('GET', api['index.category'] + '?per_page=20&cur_page=1', {}, (response) => {
          if (response.list.length > 0) {
            Vue.set(this.categoryList, 0, {
              name: '推荐'
            })
            Vue.set(this.categoryList, 1, {
              name: '专家专栏'
            })
            response.list.forEach((v, i) => {
              Vue.set(this.categoryList, i + 2, v)
            })
            this.$emit('emitCategoryList', this.categoryList)
            // dom结构加载结束
            this.$nextTick(() => {
              this._setSliderWidth()
              this._initScroll()
              this._initCategoryName()
            })
          }
        })
      },
      _initCategoryName () {    // 初始化进入的领域类型
        let categoryName = this.$route.query.name
        let index = sessionStorage.getItem('currentIndex')
        if (categoryName) {
          this.categoryList.forEach((v, i) => {
            if (v.name === categoryName) {
              this.gotoCategory(i)
            }
          })
        } else if (index || index === 0) {
          this.gotoCategory(index)
        } else {
          this.gotoCategory(0)
        }
      },
      _setSliderWidth () {     // 设置横向滑动的sliderGroup的宽度
        this.children = this.$refs.sliderGroup.children
        let width = 0
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          width += child.offsetWidth
        }
        width += 2
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initScroll () {        // 初始化滑动
        this.navScroll = new BScroll(this.$refs.categoryWrapper, {
          scrollX: true,
          click: true
        })
      },
      gotoCategory (index) {     // 跳转到其他的领域
        if (index === this.currentIndex) {
          return ''
        } else {
          this.currentIndex = index
          this.$emit('emitCategoryIndex', index)
          this.calcDistance(index)
        }
      },
      calcDistance (index) {     // 计算元素移动的距离
        if (index === 0 || index === 1) {
          this.navScroll.scrollTo(0, 0, 300)
        }
        if (index >= 2) {
          this.navScroll.scrollToElement(this.$refs.sliderGroup.children[index - 2], 300)
        }
      }
    },
    watch: {
      activeIndex (value) {
        this.currentIndex = value
        this.calcDistance(value)
      }
    }
  }
</script>

<style lang='less' scoped>
  @import "../../assets/less/base";

  .header {
    background-color: @color-white;
    margin-bottom: 1px;
    height: 40px;
    .category-wrapper {
      background-color: @color-white;
      position: fixed;
      top: 48px;
      z-index: 20;
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      .slider-group {
        padding: 0 8%;
        .clearfix();
        > li {
          float: left;
          > a {
            display: block;
            height: 40px;
            line-height: 40px;
            color: @color-3D465B;
            font-size: @font-size16;
            margin-right: 20px;
            font-weight: bold;
            &.active {
              color: @color-4895FD
            }
          }
        }
      }
    }
  }
</style>
