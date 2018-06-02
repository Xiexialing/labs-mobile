<template>
  <div class="carousel">
    <swiper :options="swiperOption">
      <swiper-slide v-for="carousel in carouselList">
        <a :href="carousel.mobile_link">
          <img v-lazy="carousel.mobile_picture" :alt="carousel.carousel_name" :title="carousel.carousel_name">
          <p class="name">{{carousel.carousel_name}}</p>
          <p class="shade"></p>
        </a>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
  import Vue from 'vue'
  import api from '@/config/api'
  import interact from '@/config/interact'

  export default{
    props: {
      categName: {
        type: String,
        default: null
      }
    },
    data () {
      return {
        swiperOption: {       // 滑动的参数同Swiper的参数
          autoplay: {
            delay: 2500,
            stopOnLastSlide: false,
            disableOnInteraction: false
          }
        },
        carouselList: []      // 轮播的内容
      }
    },
    mounted () {
      if (this.categName === '推荐') {
        this._initIndexCarouselList()
      } else {
        this._initCategoryCarouselList()
      }
    },
    methods: {
      _initIndexCarouselList () {
        interact.interact('GET', api['carouselById'] + '?carousel_group_id=1', {}, (response) => {
          if (response.length > 0) {
            response.forEach((v, i) => {
              Vue.set(this.carouselList, i, v)
            })
          }
        })
      },
      _initCategoryCarouselList () {
        interact.interact('GET', api['carouselByName'] + '?group_name=' + this.categName, {}, (response) => {
          if (response.length > 0) {
            response.forEach((v, i) => {
              Vue.set(this.carouselList, i, v)
            })
          }
          this.$emit('emitCarouselListLength', this.carouselList.length)
        })
      }
    }
  }
</script>

<style lang='less'>
  @import "../../assets/less/base";

  .carousel {
    margin-bottom: 10px;
    .swiper-container {
      .swiper-wrapper {
        .swiper-slide {
          width: 100%;
          a {
            display: block;
            position: relative;
            font-size: 0;
            height: 21.1*@height;
            line-height: 21.1*@height;
            text-align: center;
            img {
              width: 32px;
              height: 32px;
            }
            img[lazy=loaded], img[lazy=error] {
              width: 100%;
              height: inherit;
            }
            .name {
              width: 100%;
              position: absolute;
              height: 4*@height;
              line-height: 4*@height;
              left: 0;
              bottom: 0;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              color: @color-white;
              font-size: @font-size14;
              box-sizing: border-box;
              padding:0 2*@padding;
              text-align: center;
              z-index: 10;
            }
            .shade {
              width: 100%;
              position: absolute;
              height: 4*@height;
              left: 0;
              bottom: 0;
              box-sizing: border-box;
              padding:0 2*@padding;
              background-color: @color-000;
              opacity: 0.5;
            }
          }
        }
      }
    }
  }
</style>
