<template>
  <div>
    <div ref="mapChart" style="margin-top: 20px;margin-left:60px;width:6rem;height:5rem"></div>
  </div>
</template>

<script>
import china from '../../../common/china'

export default {
  name: 'bottomRight',
  data() {
    return{
      wareData:[],
      lineData:[]
    }
  },
  mounted() {
    this.getEchartData2()
  },
  methods:{
    getEchartData2() {
      const el = this.$refs.mapChart;
      const echarts = require("echarts");
      const myChart2 = echarts.init(el);
      echarts.registerMap("china", china);
      const option = {
        title:{
          text: '仓库分布',
          textStyle: {
            color: 'white'
          },
        },
        geo: {
          show:true,
          map: 'china',
          aspectScale: 0.85,
          layoutCenter: ["50%", "50%"], //地图位置
          layoutSize: '100%',
          itemStyle: {
            normal: {
              shadowColor: '#276fce',
              shadowOffsetX: 0,
              shadowOffsetY: 15,
              opacity: 0.5,
            },
            emphasis: {
              areaColor: '#276fce',

            }
          },
          regions: [{
            name: '南海诸岛',
            itemStyle: {
              areaColor: 'rgba(0, 10, 52, 1)',

              borderColor: 'rgba(0, 10, 52, 1)',
              normal: {
                opacity: 0,
                label: {
                  show: false,
                  color: "#009cc9",
                }
              },
            },
            label: {
              show: false,
              color: '#FFFFFF',
              fontSize: 12,
            },


          }],
        },
        series: [
          // 常规地图
          {
            type: 'map',
            mapType: 'china',
            aspectScale: 0.85,
            layoutCenter: ["50%", "50%"], //地图位置
            layoutSize: '100%',
            zoom: 1, //当前视角的缩放比例
            // roam: true, //是否开启平游或缩放
            scaleLimit: { //滚轮缩放的极限控制
              min: 1,
              max: 2
            },
            itemStyle: {
              normal: {
                areaColor: '#0c274b',
                borderColor: '#1cccff',
                borderWidth: 1.5
              },
              emphasis: {
                areaColor: '#02102b',
                label: {
                  color: "#fff"
                }
              }
            },
          },
          // 区域散点图
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            symbolSize: 10,
            rippleEffect: { //坐标点动画
              period: 3,
              scale: 5,
              brushType: 'fill'
            },
            label: {
              normal: {
                show: true,
                position: 'right',
                formatter: '{b}',
                color: '#b3e2f2',
                fontSize: 8
              }
            },
            data: this.wareData,
            itemStyle: { //坐标点颜色
              normal: {
                show: true,
                color: 'green',
                shadowBlur: 5,
                shadowColor: '#fff'
              },
              emphasis: {
                areaColor: '#f00'
              }
            },

          },
          // 线 和 点
          {
            type: 'lines',
            zlevel: 1, //设置这个才会有轨迹线的小尾巴
            polyline:true,
            effect: {
              show: true,
              period: 10,
              trailLength: 0.7,
              color: '#fff', //流动点颜色
              symbol: 'arrow',
              symbolSize: 6
            },
            lineStyle: {
              normal: {
                color: '#fff', //线条颜色
                width: 0.5,
                curveness: 0.2,
                shadowColor: '#fff',
              }
            },
            data: this.lineData,
          },
        ]
      }
      myChart2.setOption(option)

    }
  },
  watch: {},
  created() {
    let list = [
      {
        name: "北京",
        value: [116.24, 39.55, 100]
      },
      {
        name: "深圳",
        value: [114.271522, 22.753644]
      },
      {
        name: "重庆",
        value: [106.54, 29.59]
      },
      {
        name: "浙江",
        value: [120.19, 30.26]
      },
    ]
    for (let i = 0;i < list.length;i++)
      this.wareData.push(list[i])
    let list1 = [
      {
        fromName: "深圳",
        toName: "北京",
        coords: [
          [114.271522, 22.753644],
          [116.24, 39.55],
          [114.271522, 22.753644],
        ]
      },
      {
        fromName: "深圳",
        toName: "浙江",
        coords: [
          [114.271522, 22.753644],
          [120.19, 30.26],
          [114.271522, 22.753644],
        ]
      },
      {
        fromName: "深圳",
        toName: "重庆",
        coords: [
          [114.271522, 22.753644],
          [106.54, 29.59],
          [114.271522, 22.753644],
        ]
      }
    ]
    for (let i = 0;i < list1.length;i++)
      this.lineData.push(list1[i])
  }
}
</script>

<style scoped>

</style>


