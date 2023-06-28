
<template>
  <div >
    <div ref="chart1" style="margin-top: 20px;width:10rem;height:4rem"></div>
  </div>

</template>

<script>

export default {
  name:'bottomLeft',
  data() {
    return{}
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
            text: '各商品出货量'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['阿伟罗软蛋', '矿泉水', '阿伟李硬蛋', '草莓', '风扇']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月','八月','九月','十月','十一月','十二月']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '阿伟罗软蛋',
              type: 'line',
              stack: 'Total',
              data: [120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230]
            },
            {
              name: '矿泉水',
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
              name: '草莓',
              type: 'line',
              stack: 'Total',
              data: [320, 332, 301, 334, 390, 330, 320,320, 332, 301, 334, 390, 330]
            },
            {
              name: '风扇',
              type: 'line',
              stack: 'Total',
              data: [820, 932, 901, 934, 1290, 1330, 1320,820, 932, 901, 934, 1290, 1330]
            }
          ]

        }
        myChart.setOption(option)
        window.addEventListener("resize", function() {
          myChart.resize()
        })
      }
      this.$on('hook:destroyed',()=>{
        window.removeEventListener("resize", function() {
          myChart.resize();
        });
      })
    },

  },
  watch: {},
  created() {
  }
}
</script>
