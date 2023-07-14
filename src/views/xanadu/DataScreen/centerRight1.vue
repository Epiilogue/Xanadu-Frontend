<template>
  <div>
    <div>
      <div ref="chart3" style="width:5.3rem;height:4rem"></div>
    </div>
  </div>
</template>

<script>
import {SubSatisfaction} from '../../../api/dataScreen'
export default {
  name: 'centerRight1',
  data(){
    return {
      satisData:[],
      avg:'',
    }
  },
  methods:{
    getEchartData3() {
      const chart3 = this.$refs.chart3
      if (chart3){
        const myChart = this.$echarts.init(chart3)
        const option = {
          title: {
            text: '用户满意度统计   评价得分：'+this.avg,
            textStyle: {
              color: 'white'
            },
          },
          xAxis: {
            data: ['0','1', '2', '3', '4', '5','6','7','8','9','10']
          },
          yAxis: {},
          series: [
            {
              type: 'bar',
              data: this.satisData
            }
          ]
        }
        myChart.setOption(option)
      }
    }
  },
  mounted() {
    SubSatisfaction().then((res)=>{
      console.log(res.data)
      for (let i = 0;i < 10;i++){
        this.satisData.push(res.data.arr[i])
      }
      this.avg = res.data.avg
      this.getEchartData3()
    })
  }
}
</script>

<style scoped>

</style>
