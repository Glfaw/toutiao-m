<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="item in list"
        :key="item"
        :title="item"
      />
    </van-list>
  </div>
</template>

<script>
export default {
  name: 'SearchResult',
  data() {
    return {
      list: [1,2,3],
      loading: false,
      finished: false
    }
  },
  methods: {
    onLoad() {

    }
  }
}
</script>

<style lang="less" scoped>
// .search-result {
  
// }
</style>