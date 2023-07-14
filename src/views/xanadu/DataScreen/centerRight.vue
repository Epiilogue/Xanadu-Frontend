<template>
  <div>
    <div>
      <div ref="chart" style="width:4.5rem;height:3rem"></div>
    </div>
  </div>
</template>

<script>
import { PickOutList } from '../../../api/dataScreen'
export default {
  name: 'centerRight',
  data() {
    return{
      pieData:[],
      pie:{
        name:'',
        value:''
      }
    }
  },
  methods: {
    getEchartData(){
      const chart = this.$refs.chart
      if (chart) {
        const myChart = this.$echarts.init(chart)
        const option = {
          title:{
            text:'各分库领货出库量',
            textStyle: {
              color: 'white'
            },
          },
          legend: {
            textStyle: {
              color: '#'
            },
            orient: 'vertical',
            type: 'scroll',
            left: '5',
            bottom:'0',
            data: this.pieData.name
          },
          series: [
            {
              type: 'pie',
              data: this.pieData,
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              labelLine: {
                show: false
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '20',
                  fontWeight: 'bold'
                }
              },
            }
          ]
        }
        myChart.setOption(option)
      }
    }
  },
  created() {
    PickOutList().then((res)=>{
      let map = res.data
      for (let name in map){
        this.pie = {
          name:'',
            value:''
        }
        this.pie.name = name
        this.pie.value = map[name]
        this.pieData.push(this.pie)
      }
      this.getEchartData()
    })
  },
}
</script>

<style scoped>

</style>
