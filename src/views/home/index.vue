<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        icon="search"
        round
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 频道列表 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab
        v-for="channel in channels"
        :title="channel.name"
        :key="channel.id"
      >
        <!-- 文章列表 -->
        <article-list :channel="channel" />
      </van-tab>
      <!-- 占位 -->
      <div slot="nav-right" class="placeholder"></div>
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChannelEditShow = true"
      >
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- /频道列表 -->

    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100vh' }"
      closeable
    >
      <channel-edit
        :myChannels="channels"
        :active-index="active"
        @update-active="onUpdateActive" />
    </van-popup>
    <!-- /频道编辑弹出层 -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getItem } from "@/utils/storage"
import { getUserChannels } from "@/api/user";
import ArticleList from "./components/article-list";
import ChannelEdit from "./components/channel-edit";

export default {
  name: "HomeIndex",
  components: {
    ArticleList, ChannelEdit
  },
  props: {},
  data() {
    return {
      active: 0,
      channels: [], // 频道列表
      isChannelEditShow: false, // 控制编辑频道弹出层的显示状态
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  created() {
    this.loadChannels();
  },
  mounted() {},
  methods: {
    // 获取用户频道列表数据
    async loadChannels() {
      try {
        let channels = [];

        if (this.user) {
          // 已登录，请求获取用户频道列表
          const { data } = await getUserChannels();
          channels = data.data.channels;
        } else {
          // 未登录，判断是否有本地的频道列表数据
          this.$toast('当前未登录账号')

          // 获取本地频道列表数据
          const localChannels = getItem('TOUTIAO_CHANNELS')

          // 判断本地存储是否为空
          if(localChannels) {
            channels = localChannels
          } else {
            // 本地存储为空，获取默认频道列表
            const { data } = await getUserChannels();
            channels = data.data.channels;
          }
        }

        this.channels = channels;
      } catch (err) {
        this.$toast("获取频道数据失败");
      }
    },

    // 自定义事件
    onUpdateActive(index, isChannelEditShow = true) {
      // 更新频道面板（子组件）传过来的频道索引值
      this.active = index

      // 关闭频道面板
      this.isChannelEditShow = isChannelEditShow;
    }
  },
};
</script>

<style scoped lang="less">
.home-container {
  padding: 174px 0 100px;

  .van-nav-bar__title {
    max-width: unset;
  }

  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }

  /deep/ .channel-tabs {
    .van-tabs__content {
      // 响应式布局单位
      // vw: 1vw = 布局视口宽度的1%
      min-height: 79vh;
    }

    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      left: 0;
      right: 0;
      height: 82px;
      z-index: 1;
    }

    .van-tab {
      min-width: 200px;
      font-size: 30px;
      border-right: 1px solid #edeff3;
      color: #777777;
    }

    .van-tab--active {
      color: #333333;
    }

    .van-tabs__nav {
      padding-bottom: 0;
    }

    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }

    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }

    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.9;
      i.toutiao {
        font-size: 33px;
      }
      &::before {
        content: "";
        position: absolute;
        left: 0;
        width: 2px;
        height: 100%;
        background: url("~@/assets/gradient-gray-line.png");
        background-size: contain;
      }
    }
  }
}
</style>
