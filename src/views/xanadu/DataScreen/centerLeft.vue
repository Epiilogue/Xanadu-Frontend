<template>
  <div id="centerLeft">
    <div class="bg-color-black">
      <div class="d-flex pt-2 pl-2">
        <span style="color:#5cd9e8"></span>
        <span class="fs-xl text mx-2">各库出货量统计</span>
      </div>
      <div class="d-flex jc-center body-box" style=" margin-top: 10px;">
        <dv-capsule-chart :config="config" style="width: 4rem;height:3rem" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'centerLeft',
  data() {
    return{
      config:{
        data:[
          {
            name: "南阳",
            value: 167
          },
          {
            name: "周口",
            value: 67
          },
          {
            name: "漯河",
            value: 123
          },
          {
            name: "郑州",
            value: 55
          },
          {
            name: "西峡",
            value: 98
          },
        ]
      }
    }
  }
}
</script>

<style lang="scss">
#centerLeft {
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
