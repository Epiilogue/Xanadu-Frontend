<template>
  <div id="map-container" style="width:100%;height:100%;" />
</template>

<script>
import loadBMap from '@/utils/loadBMap.js'
export default {
  name: 'center',
  async mounted() {
    await loadBMap('zEHMzU0K51Kr5Q9vgPFvV1xHRwYjGlnM') // 加载引入BMap
    this.initMap()
  },
  data(){
    return{
      map: '', // 地图实例
      mk: '', // Marker实例
    }
  },
  methods:{
    // 初始化地图
    initMap() {
      var that = this
      // 1、挂载地图
      this.map = new BMap.Map('map-container', { enableMapClick: false })
      var point = new BMap.Point(108.55,34.32)
      this.map.centerAndZoom(point, 1)
      this.map.enableScrollWheelZoom(true);
    },

  },

}

</script>

<style scoped>

</style>
