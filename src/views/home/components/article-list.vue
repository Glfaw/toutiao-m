<template>
  <div class="article-list">
    <!-- 下拉刷新 -->
    <van-pull-refresh
      v-model="isReFreshLoading"
      :success-text="refreshSuccessText"
      :success-duration="1500"
      @refresh="onReFresh"
    >
      <!-- 数据列表 -->
      <van-list
        v-model="loading"
        :finished="finished"
        :error.sync="error"
        finished-text="没有更多了"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <!-- 封装文章组件 -->
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        />
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"/> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'

export default {
  name: "ArticleList",
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      error: false, // 控制列表加载失败的提示状态
      timestamp: null, // 用于请求获取下一页数据的时间戳
      isReFreshLoading: false, // 控制下拉刷新的 loading 状态
      refreshSuccessText: '刷新成功' // 下拉刷新成功提示文本
    };
  },
  methods: {
    // 初始化或滚动到底部会触发 onload 方法获取数据
    async onLoad() {
      try {
        // 1、请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id,
          // timestamp 简单理解就是请求数据的页码
          // 请求第1页数据：当前最新时间戳
          // 用于请求之后数据的时间戳会在当前请求结果中返回给你
          timestamp: this.timestamp || Date.now(),
          with_top: 1
        });

        // 模拟加载失败
        // if( Math.random() > .5 ) JSON.parse('abc')

        // 2、把请求结果数据放到 list 数组中
        const { results } = data.data;
        this.list.push(...results);

        // 3、本次数据加载结束后，要把加载状态设置为结束
        this.loading = false;

        // 4、判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp;
        } else {
          // 没有数据了
          this.finished = true;
        }
      } catch (err) {
        // 展示错误提示状态
        this.error = true;

        // 请求失败了， loading 也需要关闭
        this.loading = false;
      }
    },

    // 当下拉刷新的时候会触发该函数
    async onReFresh() {
      try {
        // 1、请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(), // 下拉刷新，每次请求获取最新数据，所以传递当前最新时间戳
          with_top: 1
        });

        // 模拟加载失败
        // if( Math.random() > .5 ) JSON.parse('abc')

        // 2、将数据追加到列表的顶部
        const { results } = data.data
        this.list.unshift(...results)

        // 3、关闭下拉刷新的 loading 状态
        this.isReFreshLoading = false

        // 4、更新下拉刷新成功提示的文本
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        this.refreshSuccessText = '刷新失败'
        this.isReFreshLoading = false
      }
    }
  },
};
</script>

<style lang="less" scoped>
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>