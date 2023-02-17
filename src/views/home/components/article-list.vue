<template>
  <div class="article-list">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getArticles } from "@/api/article";

export default {
  name: "ArticleList",
  props: {
    channel: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 用于请求获取下一页数据的时间戳
    };
  },
  methods: {
    async onLoad() {
      try {
        // 1、请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id,
          // timestamp 简单理解就是请求数据的页码
          // 请求第1页数据：当前最新时间戳
          // 用于请求之后数据的时间戳会在当前请求结果中返回给你
          timestamp: this.timestamp || Date.now(),
        });

        // 2、把请求结果数据放到 list 数组中
        const { results } = data.data;
        this.list.push(...results);

        // 3、本次数据加载结束后，要把加载状态设置为结束
        this.loading = false

        // 4、判断数据是否全部加载完成
        if( results.length ) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了
          this.finished = true
        }
      } catch (err) {
        console.log("请求失败", err);
      }
    },
  },
};
</script>

<style>
</style>