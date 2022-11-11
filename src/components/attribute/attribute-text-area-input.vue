<template>
  <el-input
    type="textarea"
    :rows="2"
    placeholder="请输入内容"
    v-model="value"
    @input="() => {this.$emit('updateAttributeValue', this.attributeId, this.value)}">
  </el-input>
</template>

<script>
export default {
  name: "attribute-text-area-input",
  props: {
    attributeId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      value: ''
    }
  }
}
</script>

<style scoped>

</style>
