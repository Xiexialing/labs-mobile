<template>
  <div class="index" ref="indexPage">
    <Category :notIndex='notIndex' @emitArticleId="getArticleId"></Category>
  </div>
</template>

<script>
  import Category from '@/page/category/Category'

  export default{
    data () {
      return {
        articleId: null,
        notIndex: false
      }
    },
    components: {
      Category
    },
    methods: {
      getArticleId (articleId) {
        this.articleId = articleId
        this.$emit('emitArticleIdEvent', articleId)
      }
    }
  }
</script>

<style lang='less'>
  .index {
    .carousel-component-wrapper {
      margin-bottom: 10px;
      &.recommend {
        padding: 0;
        box-sizing: border-box;
      }
    }
  }
</style>
