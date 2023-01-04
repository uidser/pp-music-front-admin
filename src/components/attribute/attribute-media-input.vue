<template>
  <el-select
    v-model="value"
    multiple
    filterable
    remote
    allow-create
    reserve-keyword
    placeholder="请输入媒体id或名称"
    :remote-method="remoteMethod"
    :loading="loading"
    style="width: 220px"
    @input="() => {this.$emit('update', this.value)}">
    <el-option
      v-for="item in mediaList"
      :key="item.id"
      :label="'媒体名称:' + item.name + '  媒体id:' + item.id"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import mediaAPi from '@/api/media'
export default {
  name: "attribute-media-input",
  props: {
    attributeId: {
      type: Number,
      default: 0
    },
    mediaList: {
      type: Array
    },
    value: {
      type: Array
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    querySingerByNameOrId(queryText) {
      mediaAPi.getMediaByPage({ queryText: queryText, current: 1, limit: 10 }).then(
        response => {
          if (response.code === 200) {
            this.mediaList = response.data.list
          }
        }
      )
    },
    remoteMethod(queryText) {
      if (queryText) {
        this.querySingerByNameOrId(queryText)
      }
    }
  }
}
</script>

<style scoped>

</style>
