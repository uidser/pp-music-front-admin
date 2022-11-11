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
      v-for="item in albumList"
      :key="item.id"
      :label="'专辑名称:' + item.name + '  专辑id:' + item.id"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import albumApi from "@/api/album";

export default {
  name: "attribute-album-input",
  props: {
    attributeId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: false,
      albumList: [],
      value: 0
    }
  },
  methods: {
    querySingerByNameOrId(queryText) {
      albumApi.query({ queryText }).then(
        response => {
          if (response.code === 200) {
            this.albumList = response.data
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
