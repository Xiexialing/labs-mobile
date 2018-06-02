<template>
  <div class="about-us">
    <img src="../../assets/images/aboutus.png" alt="">
    <p class="intro">移动Labs是中国移动面向外部行业及产业链合作伙伴的技术资讯汇聚平台。承载了中国移动与合作伙伴之间的信息互通，引导和推进通信技术创新，促进中国移动业务发展和实施。 </p>
    <div class="service-concept">
      <h1>服务理念</h1>
      <p>汇聚移动智慧</p>
      <p>分享行业观点</p>
      <p>介绍前沿技术</p>
      <p>展示移动形象</p>
    </div>
  </div>
</template>

<script>
  export default{
    data () {
      return {}
    }
  }
</script>

<style lang='less'>
  @import "../../assets/less/base";

  .about-us {
    height: 100%;
    background-color: @color-white;
    padding: 20px 20px 0;
    box-sizing: border-box;
    font-size: 0;
    img {
      width: 100%;
      margin-bottom: 20px;
    }
    .intro {
      font-size: @font-size14;
      color: @color-3D465B;
      line-height: 24px;
      text-align: center;
      margin-bottom: 20px;
    }
    .service-concept {
      h1{
        font-size: @font-size18;
        color: @color-3D465B;
        line-height: 24px;
        text-align: center;
        font-weight:600;
        margin-bottom:20px;
      }
      p{
        font-size: @font-size14;
        color: @color-3D465B;
        line-height: 24px;
        text-align: center;
      }
    }
  }
</style>
