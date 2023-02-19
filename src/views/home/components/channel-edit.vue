<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div class="title-text" slot="title">我的频道</div>
      <van-button
        class="edit-btn"
        type="danger"
        size="mini"
        plain
        round
        @click="isEdit = !isEdit"
      >{{ isEdit ? '完成': '编辑' }}</van-button>
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="index"
        @click="onMyChannelClick(channel, index)"
      >
        <van-icon
          v-show="isEdit && !fiexChannels.includes(channel.id)"
          name="clear"
          slot="icon" />
        <span
          slot="text"
          class="text"
          :class="{ active: index === activeIndex }"
        >{{ channel.name }}</span>
      </van-grid-item>
    </van-grid>
    <!-- /我的频道 -->

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div class="title-text" slot="title">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        icon="plus"
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        @click="onAddChannel(channel)"
      />
    </van-grid>
    <!-- /频道推荐 -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
import { getAllChannels } from "@/api/channel";
import { addUserChannel, deleteUserChannel } from '@/api/user'

export default {
  name: "ChannelEdit",
  props: {
    myChannels: {
      type: Array,
      required: true,
    },
    activeIndex: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 控制编辑状态的显示(关闭小图标)
      fiexChannels: [0] // 固定频道数组id，不允许删除
    };
  },
  computed: {
    ...mapState(['user']),

    // 简化版本
    recommendChannels() {
      // filter方法：遍历数组，把符合条件的元素存储到新数组
      return this.allChannels.filter((channel) => {
        // find方法：遍历数组，把符合条件的第一个元素返回
        return !this.myChannels.find((myChannel) => {
          return myChannel.id === channel.id
        })
      })
    },

    // // 基本思路
    // recommendChannels() {
    //   // 推荐频道 = 全部频道 - 我的频道
    //   const channels = [];

    //   // 依次遍历全部频道
    //   this.allChannels.forEach((channel) => {
    //     // 查找【我的频道】中是否包含【该频道】
    //     const ret = this.myChannels.find(
    //       (myChannel) => myChannel.id === channel.id
    //     );

    //     // 如果不包含，就添加到【推荐频道】中
    //     if (!ret) channels.push(channel);
    //   });

    //   return channels;
    // },
  },
  created() {
    this.loadAllChannels();
  },
  methods: {
    // 获取全部频道
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels();
        this.allChannels = data.data.channels;
      } catch (err) {
        this.$toast("数据获取失败");
      }
    },

    // 添加频道
    async onAddChannel(channel) {
      this.myChannels.push(channel)

      // 数据持久化处理
      if(this.user) {
        try {
          // 已登录，把数据请求接口放线上
          await addUserChannel({
            id: channel.id, // 频道id
            seq: this.myChannels.length // 序号
          })
        } catch (err) {
          this.$toast('保存失败，请稍后重试')
        }
      } else {
        // 未登录，存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },

    // 进入频道 or 删除频道
    onMyChannelClick(channel, index) {
      if(this.isEdit) {
        // 编辑状态，执行删除频道项
        // 1、判断是否为固定频道
        if(this.fiexChannels.includes(channel.id)) return;

        // 2、删除指定频道项
        this.myChannels.splice(index, 1)

        // 3、更新激活的频道项
        if(index <= this.activeIndex) {
          this.$emit('update-active', this.activeIndex - 1, true)
        }

        // 4、处理数据持久化
        this.deleteChannel(channel);
      } else {
        // 非编辑状态，执行切换频道
        // 自定义事件，子组件触发，传给父组件定义方法接收
        this.$emit('update-active', index, false)
      }
    },

    // 删除用户频道
    async deleteChannel(channel) {
      try {
        if(this.user) {
          // 已登录，数据更新到线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录，数据更新到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('操作失败，请稍后重试')
      }
    }
  },
};
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;

  .title-text {
    font-size: 32px;
    color: #333;
  }

  .edit-btn {
    font-size: 26px;
    width: 104px;
    height: 48px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        margin-top: 0;
        font-size: 28px;
        color: #222;
      }

      .active {
        color: #f85959;
      }

      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          margin-right: 6px;
          font-size: 28px;
        }
      }
    }
  }
}
</style>