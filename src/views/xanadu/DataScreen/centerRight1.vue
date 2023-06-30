<template>
  <div id="centerRight1">
    <div class="bg-color-black">
      <div class="d-flex pt-2 pl-2">
        <span style="color:#5cd9e8">
        </span>
        <span class="fs-xl text mx-2">配送员满意度排行榜</span>
      </div>
      <div class="d-flex jc-center body-box" style=" margin-top: 10px;margin-left: 20px">
        <dv-scroll-ranking-board :config="config" style="width: 5rem;height:3rem" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'centerRight1',
  data() {
    return{
      config:{
        data:[
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
        ]
      }
    }
  }
}
</script>

<style lang="scss">
#centerRight1 {
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
