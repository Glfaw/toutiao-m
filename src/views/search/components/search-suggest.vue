<template>
  <div class="search-suggest">
    <van-cell
      icon="search"
      v-for="(text, index) in suggestions"
      :key="index"
      @click="$emit('search', text)"
    >
      <div slot="title" v-html="highLight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { getSerachSuggestions } from '@/api/search'

export default {
  name: 'SearchSuggest',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      suggestions: [] // 联想建议数据列表
    }
  },
  watch: {
    searchText: {
      // 当 searchText 发生改变的时候就会调用 handler 函数
      // handler(value) {
      //   this.loadSearchSuggestions(value)
      // },

      // 利用lodash的debounce防抖函数
      handler: debounce(function (value) {
        this.loadSearchSuggestions(value)
      }, 200),
      // immediate加载自动触发
      immediate: true
    }
  },
  methods: {
    async loadSearchSuggestions(q) {
      try {
        const { data } = await getSerachSuggestions(q)
        const result = data.data.options
        if(result.includes(null)) return

        this.suggestions = result
      } catch (err) {
        this.$toast('数据获取失败，请稍后重试')
      }
    },

    highLight(text) {
      const highLightStr = `<span class="active">${this.searchText}</span>`

      // 如果需要根据数据变量动态的创建正则表达式，则手动 new RegExp
      // RegExp 正则表达式构造函数
      //    参数1：匹配模式字符串，它会根据这个字符串创建正则对象
      //    参数2：匹配模式，要写到字符串中，g代表全局，i代表大小写
      const reg = new RegExp(this.searchText, 'gi')

      return text.replace(reg, highLightStr)
    }
  }
}
</script>

<style lang="less" scoped>
.search-suggest {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>