<template>
  <div class="imgWrap" @click="closeImgModale">
    <img :src="picSrc">
  </div>
</template>
<script>
  export default{
    data () {
      return {
        picSrc: null
      }
    },
    mounted () {
      this._initPicSrc()
    },
    methods: {
      _initPicSrc () {
        this.picSrc = this.$route.query.imgSrc
      },
      closeImgModale () {
        window.history.back(-1)
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../assets/less/base";

  .imgWrap {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1002;
    background-color: black;
    img {
      width: 100%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
