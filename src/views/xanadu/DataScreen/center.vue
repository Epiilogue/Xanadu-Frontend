<template>
  <div id="center">
    <div class="cc">
      <div class="d-flex pt-2 pl-2">
        <span style="color:#5cd9e8">
        </span>
        <span class="fs-xl text mx-2">分站配送信息</span>
      </div>
      <div class="d-flex jc-center body-box" style=" margin-top: 10px;margin-left: 29px">
        <dv-scroll-board :config="config" style="width: 7rem;height:3rem" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'center',
  data(){
    return{
      list:[
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

      config:{
        header: ['列1', '列2', '列3'],
        data: [],
        index: true,
        columnWidth: [45],
        align: ['center']
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
.cc{
  width: 9rem;
  height: 3.7rem;
}
</style>
