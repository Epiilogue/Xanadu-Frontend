<template>
  <div id="centerLeft">
    <div class="cl">
      <div class="d-flex pt-2 pl-2">
        <span style="color:#5cd9e8">
        </span>
        <span class="fs-xl text mx-2" style="font-weight: bolder;font-size: x-large">订购排行榜TOP5</span>
      </div>
      <div class="d-flex jc-center body-box" style=" margin-top: 5px;margin-left: 20px">
        <dv-scroll-ranking-board :config="config" style="width: 5rem;height:3rem" />
      </div>
    </div>
  </div>
</template>

<script>
import {listTop} from '../../../api/dataScreen'

export default {
  name: 'centerLeft',
  data() {
    return{
      line: {
        name:'',
        value:''
      },
      list:[],
      config:{
        data:[]
      }
    }
  },
  created() {
    listTop(5).then((res)=>{
      for (let i = 0;i < res.data.length;i++){
        this.line = { name:'', value:'' }
        this.line.name = res.data[i].productName
        this.line.value = res.data[i].number
        this.list.push(this.line)
      }
      this.config = {
        data:this.list
      }
    })
  }
}
</script>

<style scoped>
.cl{
  width: 5.7rem;
  height: 3.7rem;
}
</style>
