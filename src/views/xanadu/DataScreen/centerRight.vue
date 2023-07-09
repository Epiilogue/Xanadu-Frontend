<template>
  <div>
    <div>
      <div ref="chart" style="width:7rem;height:3rem;"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'centerRight',
  data() {
    return{
      pieData:[]
    }
  },
  mounted() {
    this.getEchartData()
  },
  methods: {
    getEchartData(){
      const chart = this.$refs.chart
      if (chart) {
        const myChart = this.$echarts.init(chart)
        const option = {
          title:{
            text:'各分库出库量',
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
              data: this.pieData
            }
          ]
        }
        myChart.setOption(option)
      }
    }
  },
  created() {
    let list = [
        {
          value: 335,
          name: '阿伟罗软蛋'
        },
        {
          value: 234,
          name: '阿伟李硬蛋'
        },
        {
          value: 1548,
          name: '阿伟徐傻蛋'
        },
        {
          value: 1139,
          name: '李志鹏滚蛋'
        }
      ]
    for (let i = 0;i < list.length;i++)
      this.pieData.push(list[i])
  },
}
</script>

<style scoped>

</style>
