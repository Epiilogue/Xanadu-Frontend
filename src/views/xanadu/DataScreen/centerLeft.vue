<template>
  <div id="centerLeft">
    <div class="cl">
      <div class="d-flex pt-2 pl-2">
        <span style="color:#5cd9e8">
        </span>
        <span class="fs-xl text mx-2">订购排行榜TOP5</span>
      </div>
      <div class="d-flex jc-center body-box" style=" margin-top: 10px;margin-left: 20px">
        <dv-scroll-ranking-board :config="config" style="width: 6rem;height:3rem" />
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
      list:[],
      config:{
        data:[]
      }
    }
  },
  mounted() {
    /* TODO*/
    // listTop(5).then((res)=>{
    //   console.log(res)
    // })
    for (let i = 0;i < this.list.length;i++)
      this.config.data.push(this.list[i])
  }
}
</script>

<style scoped>
.cl{
  width: 7rem;
  height: 3.7rem;
}
</style>
