<template>
  <div>
    <div>
      <div ref="chart" style="width:7rem;height:3rem;"></div>
    </div>
  </div>
</template>

<script>
import { PickOutList } from '../../../api/dataScreen'
export default {
  name: 'centerRight',
  data() {
    return{
      pieData:[]
    }
  },
  mounted() {
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
            left: '10',
            bottom:'5',
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
      for (let i = 0;i < res.data.length;i++){
        this.pieData.push(
          {
            name:'仓库id:'+res.data[i].subwareId+' 商品id:'+res.data[i].productId,
            value:res.data[i].actualNum
          }
        )
      }
      this.getEchartData()
    })

  },
}
</script>

<style scoped>

</style>
