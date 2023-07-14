<template>
  <div>
    <div ref="mapChart" style="margin-top: 20px;margin-left:100px;width:6rem;height:5rem"></div>
  </div>
</template>

<script>
import china from '../../../common/china'
import { listAllStations } from '../../../api/dataScreen'
export default {
  name: 'bottomRight',
  data() {
    return{
      wareData:[],
      lineData:[],
      cen: {
        name:'',
        value:[]
      },
      subs :{
        name:'',
        value:[]
      },
      lines:{
        fromName: '',
        toName: '',
        coords: [
          [],
          [],
          [],
        ]
      },
    }
  },
  mounted() {
    listAllStations().then((res)=>{
      this.cen.name = res.center.name
      this.cen.value = [res.center.x,res.center.y]
      this.wareData.push(this.cen)
      var list = res.sub
      for (let i = 0;i < list.length;i++){
        //点
        this.subs={
          name:'',
          value:[]
        }
        this.subs.name = list[i].name;
        this.subs.value = [list[i].x,list[i].y]
        this.wareData.push(this.subs)
        //线
        this.lines= {
          fromName: '',
          toName: '',
          coords: [
            [],
            [],
            [],
          ]
        }
        this.lines.fromName = this.subs.name
        this.lines.toName = this.cen.name
        this.lines.coords = [
          this.subs.value,
          this.cen.value,
          this.subs.value
        ]
        this.lineData.push(this.lines)
      }
      this.getEchartData2()
    })
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
              period: 2,
              scale: 3,
              brushType: 'fill'
            },
            label: {
              normal: {
                show: true,
                position: 'right',
                formatter: '{b}',
                color: '#b3e2f2',
                fontSize: 10
              }
            },
            data: this.wareData,
            itemStyle: { //坐标点颜色
              normal: {
                show: true,
                color: 'green',
                shadowBlur: 4,
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
}
</script>

<style scoped>

</style>


