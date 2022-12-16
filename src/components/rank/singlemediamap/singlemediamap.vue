<template>
  <div style="height: 800px" id="map"></div>
</template>

<script>
import rankApi from "@/api/rank"
export default {
  name: "singlemediamap",
  data() {
    return {
      mapData: {}
    }
  },
  mounted() {
    this.initData(this.$route.params.mediaId, this.$route.params.rankId)
  },
  methods: {
    async initData(mediaId, rankId) {
      await rankApi.getSingleMediaMap(mediaId, rankId).then(
        response => {
          this.mapData.dateList = response.data.rankDateList
          this.mapData.listenQuantityList = response.data.listenQuantityList
          this.mapData.title = response.data.mediaName
        }
      )
      console.log(this.mapData.listenQuantityList)
      let myChart = this.$echarts.init(document.getElementById('map'))
      let option = {
        xAxis: {
          type: 'category',
          data: this.mapData.dateList
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.mapData.listenQuantityList,
            type: 'line',
            smooth: true
          }
        ]
      }
      myChart.setOption(option)
    }
  }
}
</script>

<style scoped>

</style>
