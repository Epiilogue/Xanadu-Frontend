<template>
  <div>
    <div id="index">
      <dv-full-screen-container class="bg">
        <dv-loading v-if="loading">Loading...</dv-loading>
        <div v-else class="host-body">
          <!--最顶行-->
          <div class="d-flex jc-center">
            <dv-decoration-10 style="width:33.3%;height:.0625rem;" />
            <div class="d-flex jc-center">
              <dv-decoration-8 :color="['#568aea', '#000000']" style="width:2.5rem;height:.625rem;" />
              <div class="title">
                <span class="title-text">XA-Cloud 平台</span>
                <dv-decoration-6
                  class="title-bototm"
                  :reverse="true"
                  :color="['#50e3c2', '#67a1e5']"
                  style="width:3.125rem;height:.1rem;"
                />
              </div>
              <dv-decoration-8
                :reverse="true"
                :color="['#568aea', '#000000']"
                style="width:2.5rem;height:.625rem;"/>
            </div>
            <dv-decoration-10 style="width:33.3%;height:.0625rem; transform: rotateY(180deg);" />
          </div>

          <!-- 第二行 -->
          <div class="d-flex jc-between px-2">
            <div class="d-flex" style="width: 40%">
              <div
                class="react-right ml-4"
                style="width: 6.25rem; text-align: left;background-color: #0f1325;">
                <span class="react-before"></span>
                <span class="text" @click="toHome">返回</span>
              </div>
              <div class="react-right ml-3"
                   style="background-color: #0f1325;">
                <span class="text colorBlue">Xanadu管理系统</span>
              </div>
            </div>
            <div style="width: 40%" class="d-flex">
              <div class="react-left bg-color-blue mr-3">
                <span class="text fw-b">数据可视化超级大屏</span>
              </div>
              <div
                class="react-left mr-4"
                style="width: 6.25rem; background-color: #0f1325; text-align: right;">
                <span class="react-after"></span>
                <span class="text" style="margin-right: 125px;font-size: small">版本号:3.5.1</span>
                <span class="text"> 当前时间:{{ times }}</span>
              </div>
            </div>
          </div>

          <!--中间部分-->
          <div class="body-box">
            <!-- 第三行数据 -->
            <div class="content-box">
              <!--中间左侧 满意度排行榜-->
              <div>
                <dv-border-box-12>
                  <centerLeft />
                </dv-border-box-12>
              </div>
              <!-- 中间 订单统计-->
              <div>
                <dv-border-box1 style="margin-left: 10px;width: 8rem">
                  <center />
                </dv-border-box1>
              </div>
              <!-- 中间右侧 分库出库量比例 -->
              <div>
                <dv-border-box-13 style="margin-left: 10px">
                  <centerRight />
                </dv-border-box-13>
              </div>
            </div>

            <!-- 底部-->
            <div class="bototm-box">
              <!--各商品订购折线图-->
              <dv-border-box-13 style="width: 12rem">
                <bottomLeft />
              </dv-border-box-13>
              <!--地图-->
              <dv-border-box-12 style="width: 8rem">
                <bottomRight />
              </dv-border-box-12>
            </div>
          </div>


        </div>
      </dv-full-screen-container>
    </div>

  </div>

</template>

<script>
//各分组件
import centerLeft from './xanadu/DataScreen/centerLeft'
import center from './xanadu/DataScreen/center'
import centerRight from './xanadu/DataScreen/centerRight'
import bottomRight from './xanadu/DataScreen/bottomRight'
import bottomLeft from './xanadu/DataScreen/bottomLeft'

// 适配flex
import '@/common/flexible.js';

export default {
  name: 'index',
  data() {
    return {
      loading: true,
      times:'',
    };
  },
  components:{
    centerLeft,
    center,
    centerRight,
    bottomRight,
    bottomLeft
  },
  created() {
    this.getTimes()
  },
  beforeDestroy() {
    if (this.times){
      clearInterval(this.getTimesInterval);
    }
  },
  mounted() {
    this.cancelLoading();
  },
  methods: {
    toHome(){
      this.$router.push('/login')
    },

    //获取当前时间
    getTimes(){
      setInterval(this.getTimesInterval,1000);
    },
    getTimesInterval:function (){
      let _this = this;
      let year = new Date().getFullYear(); //获取当前时间的年份
      let month = new Date().getMonth() + 1; //获取当前时间的月份
      let day = new Date().getDate(); //获取当前时间的天数
      let hours = new Date().getHours(); //获取当前时间的小时
      let minutes = new Date().getMinutes(); //获取当前时间的分数
      let seconds = new Date().getSeconds(); //获取当前时间的秒数
      //当小于 10 的是时候，在前面加 0
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      //拼接格式化当前时间
      _this.times = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    },

    cancelLoading() {
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/index.scss';
@import '../assets/scss/style.scss';


.bg {
  background-image: url("../assets/images/XAbackground.png");
  padding: 0.2rem 0.2rem 0 0.2rem;
  background-size: cover;
  background-position: center center;
}

</style>
