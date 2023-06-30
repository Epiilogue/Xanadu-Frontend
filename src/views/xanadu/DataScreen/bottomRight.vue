<template>
  <div id="bottomLeft">
    <div class="bg-color-black">
      <div class="d-flex pt-2 pl-2">
        <span style="color:#5cd9e8">
        </span>
        <span class="fs-xl text mx-2">订单列表</span>
      </div>
      <div class="d-flex jc-center body-box" style=" margin-top: 10px;">
        <dv-scroll-board :config="config" style="width: 10rem;height:4.5rem" />
      </div>


    </div>
  </div>
</template>

<script>
export default {
  name: 'bottomRight',
  data() {
    return{
      config:{
        header: ['列1', '列2', '列3'],
        data: [
          ['行1列1', '行1列2', '行1列3', '行1列4', '行1列5', '行1列6'],
          ['行2列1', '行2列2', '行2列3', '行1列4', '行1列5', '行1列6'],
          ['行3列1', '行2列2', '行2列3', '行1列4', '行1列5', '行1列6'],
          ['行3列1', '行2列2', '行2列3', '行1列4', '行1列5', '行1列6'],
          ['行3列1', '行2列2', '行2列3', '行1列4', '行1列5', '行1列6'],
          ['行3列1', '行2列2', '行2列3', '行1列4', '行1列5', '行1列6'],
          ['行3列1', '行2列2', '行2列3', '行1列4', '行1列5', '行1列6'],
          ['行3列1', '行2列2', '行2列3', '行1列4', '行1列5', '行1列6'],
          ['行3列1', '行2列2', '行2列3', '行1列4', '行1列5', '行1列6'],
          ['行3列1', '行2列2', '行2列3', '行1列4', '行1列5', '行1列6'],
          ['行3列1', '行2列2', '行2列3', '行1列4', '行1列5', '行1列6'],
          ['行3列1', '行2列2', '行2列3', '行1列4', '行1列5', '行1列6'],
          ['行3列1', '行2列2', '行2列3', '行1列4', '行1列5', '行1列6'],
          ['行3列1', '行2列2', '行2列3', '行1列4', '行1列5', '行1列6'],
        ],
        index: true,
        columnWidth: [30],
        align: ['center']
      }
    }
  }

}
</script>

<style lang="scss">
#bottomLeft {
  padding: 0.2rem;
  height: 5.125rem;
  min-width: 3.75rem;
  border-radius: 0.0625rem;
  .bg-color-black {
    height: 4.8125rem;
    border-radius: 0.125rem;
  }
  .text {
    color: #c3cbde;
  }
  .chart-box {
    margin-top: 0.2rem;
    width: 2.125rem;
    height: 2.125rem;
    .active-ring-name {
      padding-top: 0.125rem;
    }
  }

  .bottom-data {
    .item-box {
      float: right;
      position: relative;
      width: 50%;
      color: #d3d6dd;
      // 金币
      .coin {
        position: absolute;
        left: 0.1rem;
        top: 0.2125rem;
        font-size: 0.25rem;
        color: #ffc107;
      }
      .colorYellow {
        color: yellowgreen;
      }
    }
  }
}
</style>
