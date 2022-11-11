<template>
  <el-date-picker
    v-model="value"
    type="date"
    placeholder="选择日期"
    @input="() => {this.$emit('updateAttributeValue', this.attributeId, this.value)}"
    value-format="yyyy-MM-dd">
  </el-date-picker>
</template>

<script>
export default {
  name: "attribute-date-input",
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
