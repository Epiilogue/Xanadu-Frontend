<template>
  <div id="centerRight2">
    <div class="bg-color-black">
      <div class="d-flex pt-2 pl-2">
        <span style="color:#5cd9e8">
        </span>
        <span class="fs-xl text mx-2">订单种类统计分析</span>
      </div>
      <div class="d-flex jc-center body-box" style=" margin-top: 10px;margin-left: 10px">
        <el-container>
          <dv-active-ring-chart :config="config" style="width:3rem;height:3rem" />
        </el-container>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'centerRight2',
  data(){
    return{
      config:{
        radius: '60%',
        activeRadius: '65%',
        data:[
          {
            name: '完成订单',
            value: 155
          },
          {
            name: '退货订单',
            value: 120
          },
          {
            name: '未完成订单',
            value: 78
          },
          {
            name: '提交订单',
            value: 210
          }
        ],
        digitalFlopStyle: {
          fontSize: 20
        },
        lineWidth:30
      },
      numberData: [
        {
          number: {
            number: [115],
            toFixed: 1,
            content: "{nt}"
          },
          text: "完成订单"
        },
        {
          number: {
            number: [11],
            toFixed: 1,
            content: "{nt}"
          },
          text: "退货单"
        },
        {
          number: {
            number: [361],
            toFixed: 1,
            content: "{nt}"
          },
          text: "正在进行订单"
        },
        {
          number: {
            number: [157],
            toFixed: 1,
            content: "{nt}"
          },
          text: "已提交订单"
        }
      ]
    }
  }
}
</script>

<style lang="scss">
#centerRight2 {
  padding: 0.0625rem;
  height: 3.5rem;
  min-width: 3.75rem;
  border-radius: 0.0625rem;
  .bg-color-black {
    padding: 0.0625rem;
    height: 5.0625rem;
    border-radius: 0.125rem;
  }
  .text {
    color: #c3cbde;
  }
  .body-box {
    border-radius: 0.125rem;
    overflow: hidden;
  }
}
</style>
