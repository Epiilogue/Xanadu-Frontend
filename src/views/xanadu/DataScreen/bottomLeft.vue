<template>
  <div >
    <div ref="chart1" style="margin-top: 20px;width:11rem;height:5rem"></div>
  </div>
</template>

<script>
import { MonthlyOrders } from '../../../api/dataScreen'
export default {
  name:'bottomLeft',
  data() {
    return{
      lineData:[],
      re:[],
      ex:[],
      ne:[]
    }
  },
  mounted() {

  },
  methods: {
    getEchartData1() {
      const chart1 = this.$refs.chart1
      if (chart1) {
        const myChart = this.$echarts.init(chart1)
        const option = {
          title: {
            text: '各种订单数量统计',
            textStyle: {
              color: 'white'
            },
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data:this.lineData.name,
            type: 'scroll',
            right:'10',
            textStyle: {
              color: '#'
            },
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月','八月','九月','十月','十一月','十二月']
          },
          yAxis: {
            type: 'value'
          },
          series:this.lineData

        }
        myChart.setOption(option)
      }

    },

  },
  created() {
    MonthlyOrders().then((res)=>{
      for (let i = 1;i < 13;i++){
        this.re.push(res.data.退货[i])
        this.ex.push(res.data.换货[i])
        this.ne.push(res.data.新订[i])
      }
      this.lineData = [
        {
          name:'退货',
          type:'line',
          stack:'Total',
          data:this.ex
        },
        {
          name:'换货',
          type:'line',
          stack:'Total',
          data:this.re
        },
        {
          name:'新订',
          type:'line',
          stack:'Total',
          data:this.ne
        },
      ]
      this.getEchartData1()
    })
  }
}
</script>

<style scoped>

</style>
