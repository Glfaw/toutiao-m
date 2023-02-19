<template>
  <van-cell class="article-item">
    <div class="title van-multi-ellipsis--l2" slot="title">
      {{ article.title }}
    </div>
    <div slot="label">
      <!-- 三张图片 -->
      <div class="cover-wrap" v-if="article.cover.type === 3">
        <div
          class="cover-item"
          v-for="(img, index) in article.cover.images"
          :key="index"
        >
          <van-image class="cover-item-img" fit="cover" :src="img" />
        </div>
      </div>

      <!-- 文章信息 -->
      <div class="label-info-wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }} 评论</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
    </div>
    <!-- 右侧插槽，一张图片 -->
    <van-image
      class="right-cover"
      v-if="article.cover.type === 1"
      slot="default"
      fit="cover"
      :src="article.cover.images[0]"
    />
  </van-cell>
</template>

<script>
export default {
  name: "ArticleItem",
  components: {},
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>

<style lang="less" scoped>
.article-item {
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }

  .van-cell__value {
    padding-left: 25px;
    flex: unset;
    width: 232px;
    height: 146px;
  }

  .right-cover {
    width: 232px;
    height: 146px;
  }

  .label-info-wrap {
    span {
      margin-right: 25px;
      font-size: 22px;
      color: #b4b4b4;
    }
  }

  .cover-wrap {
    display: flex;
    padding: 30px 0;

    .cover-item {
      flex: 1;
      height: 146px;
      &:not(:last-child) {
        padding-right: 4px;
      }

      .cover-item-img {
        width: 100%;
        height: 146px;
      }
    }
  }
}
</style>