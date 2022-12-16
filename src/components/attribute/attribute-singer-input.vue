<template>
  <el-select
    v-model="value"
    multiple
    filterable
    remote
    allow-create
    reserve-keyword
    placeholder="请输入歌手id或名称"
    :remote-method="remoteMethod"
    :loading="loading"
    style="width: 220px"
    @input="() => {this.$emit('updateAttributeValue', this.attributeId, this.value)}">
    <el-option
      v-for="item in singerList"
      :key="item.id"
      :label="'歌手名称:' + item.name + '  歌手id:' + item.id"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import singerApi from '@/api/user/index'

export default {
  name: "attribute-singer-input",
  props: {
    attributeId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: false,
      singerList: [],
      value: 0
    }
  },
  methods: {
    querySingerByNameOrId(queryText) {
      singerApi.query(queryText).then(
        response => {
          if (response.code === 200) {
            this.singerList = response.data
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
