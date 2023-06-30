<template>
  <div >
    <div ref="chart1" style="margin-top: 20px;width:11rem;height:5rem"></div>
  </div>
</template>

<script>

export default {
  name:'bottomLeft',
  data() {
    return{
      lineData:[],
    }
  },
  mounted() {
    this.getEchartData1()
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
    let list =  [
       {
         name: '阿伟罗软蛋',
         type: 'line',
         stack: 'Total',
         data: [120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230]
       },
       {
         name: '阿伟徐傻蛋',
         type: 'line',
         stack: 'Total',
         data: [220, 182, 191, 234, 290, 330, 310,220, 182, 191, 234, 290, 330]
       },
       {
         name: '阿伟李硬蛋',
         type: 'line',
         stack: 'Total',
         data: [150, 232, 201, 154, 190, 330, 410,150, 232, 201, 154, 190, 330]
       },
       {
         name: '李志鹏滚蛋',
         type: 'line',
         stack: 'Total',
         data: [320, 332, 301, 334, 390, 330, 320,320, 332, 301, 334, 390, 330]
       }
     ]
    for (let i = 0;i < list.length;i++)
      this.lineData.push(list[i])
  }
}
</script>

<style scoped>

</style>
