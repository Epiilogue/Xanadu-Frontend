<template>
  <div id="center">
    <div class="cc">
      <div class="d-flex pt-2 pl-2">
        <span style="color:#5cd9e8">
        </span>
        <span class="fs-xl text mx-2" style="font-weight: bolder;font-size: x-large">分站配送信息</span>
      </div>
      <div class="d-flex jc-center body-box" style=" margin-top: 10px;margin-left: 29px">
        <dv-scroll-board ref="scrollBoard" :config="config" style="width: 7.2rem;height:3rem" />
      </div>
    </div>
  </div>
</template>

<script>
import { SubDeliveryInfo } from '../../../api/dataScreen'
export default {
  name: 'center',
  data(){
    return{
      line:[],
      list:[],
      config:{
        header: ['分库ID', 'delivered', 'deliveryAmount', 'paymentDelivered', 'totalOrders',''],
        data: [],
        index: true,
        columnWidth:[50],
        align: ['center']
      }
    }
  },
  created() {
    SubDeliveryInfo().then((res)=>{
      for (let i = 0;i < res.data.length;i++){
        this.line = []
        this.line.push(res.data[i].subId)
        this.line.push(res.data[i].delivered)
        this.line.push(res.data[i].deliveryAmount)
        this.line.push(res.data[i].paymentDelivered)
        this.line.push(res.data[i].totalOrders)
        this.config.data.push(this.line)
      }
      this.$refs['scrollBoard'].updateRows(this.config.data)
    })
  }
}

</script>

<style scoped>
.cc{
  width: 9rem;
  height: 3.7rem;
}
</style>
