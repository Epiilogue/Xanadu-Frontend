<template>
  <div id="centerLeft">
    <div class="cl">
      <div class="d-flex pt-2 pl-2">
        <span style="color:#5cd9e8">
        </span>
        <span class="fs-xl text mx-2">订购排行榜</span>
      </div>
      <div class="d-flex jc-center body-box" style=" margin-top: 10px;margin-left: 20px">
        <dv-scroll-ranking-board :config="config" style="width: 6rem;height:3rem" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'centerLeft',
  data() {
    return{
      list:[
        {
          name: "李嘉伟",
          value: 89
        },
        {
          name: "徐高松",
          value: 4
        },
        {
          name: "邢凯",
          value: 100
        },
        {
          name: "阿伟罗",
          value: 7
        },
        {
          name: "李志鹏",
          value: 66
        },
        {
          name: "李志鹅",
          value: 77
        },
        {
          name: "刘益先",
          value: 56
        }
      ],
      config:{
        data:[]
      }
    }
  },
  mounted() {
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
