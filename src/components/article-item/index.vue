<template>
  <div class="article-item"></div>
</template>

<script>
export default {
  name: 'ArticleItem',
  components: {},
  props: {
    article: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      
    }
  },
  computed: {},
  methods: {}
}
</script>

<style lang="less" scoped>
.article-item {
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }

  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
  }

  .right-cover {
    width: 232px;
    height: 146px;
  }
}
</style>