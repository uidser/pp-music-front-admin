<template>
  <el-input v-model="value" @input="() => {this.$emit('updateAttributeValue', this.attributeId, this.value)}"></el-input>
</template>

<script>
export default {
  name: "attribute-input",
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
