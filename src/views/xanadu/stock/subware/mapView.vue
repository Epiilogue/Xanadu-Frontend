<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="110px">
      <el-form-item label="仓库地址:" prop="address">
        <el-autocomplete v-model="form.address" style="width:100%;" popper-class="autoAddressClass"
                         :fetch-suggestions="querySearchAsync" :trigger-on-focus="false" placeholder="详细地址"
                         clearable @select="handleSelect">
          <template slot-scope="{ item }">
            <i class="el-icon-search fl mgr10" />
            <div style="overflow:hidden;">
              <div class="title">{{ item.title }}</div>
              <span class="address ellipsis">{{ item.address }}</span>
            </div>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="地图定位:">
        <div id="map-container" style="width:100%;height:500px;" />
      </el-form-item>

      <el-form :model="subware">
        <el-form-item label="仓库名称">
          <el-input v-model="subware.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="仓库管理员"></el-form-item>
          <div>
            <el-checkbox-group v-model="checkedUsers" @change="handleSelectUser">
              <el-checkbox v-for="u in user" :label="u" >库管员id：{{u.userId}}，库管员名称：{{u.nickName}}</el-checkbox>
            </el-checkbox-group>
          </div>
      </el-form>
      <el-form-item class="sumbit">
        <el-button type="primary" @click="addStock">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/* eslint-disable */
import loadBMap from '@/utils/loadBMap.js'
import axios from 'axios'
import subware from './index'
import { addSubware, userList } from '@/api/ware'
export default {
  name :'mapView',
  data() {
    return {
      form: {
        city:'',
        address: '', // 详细地址
        addrPoint: { // 详细地址经纬度
          lng: 0,
          lat: 0
        }
      },
      map: '', // 地图实例
      mk: '', // Marker实例
      locationPoint: null,
      subware :{
        id:'',
        name:'',
        address:'',
        x:'',
        y:'',
        city:'',
        managerIds:[]
      },
      user:[],
      checkedUsers:[],
    }
  },
  async mounted() {
    await loadBMap('zEHMzU0K51Kr5Q9vgPFvV1xHRwYjGlnM') // 加载引入BMap
    this.initMap()

    userList().then((res)=>{
      this.user.push(res.data)
      this.user = this.user[0]
    })

  },
  methods: {
    handleSelectUser(){
      this.subware.managerIds = []
      for (let i = 0;i < this.checkedUsers.length;i++){
        this.subware.managerIds.push(this.checkedUsers[i].userId)
      }
    },
    //添加仓库
    addStock() {
      this.subware.address = this.form.address
      this.subware.x = this.form.addrPoint.lng
      this.subware.y = this.form.addrPoint.lat
      this.subware.city = this.form.city
      if (!this.subware.name){
        this.$message.error('请输入仓库名称')
      } else if (this.subware.managerIds.length === 0){
        this.$message.error('请选择仓库管理员')
      } else if (!this.subware.address){
        this.$message.error('请输入仓库地址')
      } else if (!this.subware.city){
        this.$message.error('请选择仓库位置')
      } else {
        addSubware(this.subware).then((res)=>{
          if (res.msg == '创建分库成功'){
            this.$message({
              message:'创建分库成功',
              type:'success'
            })
            this.$emit('showMapView',false)
          }
        })
      }
    },
    // 初始化地图
    initMap() {
      var that = this
      // 1、挂载地图
      this.map = new BMap.Map('map-container', { enableMapClick: false })
      var point = new BMap.Point(123.47110,41.68383)
      this.map.centerAndZoom(point, 19)
      this.map.enableScrollWheelZoom(true);
      // 3、设置图像标注并绑定拖拽标注结束后事件
      this.mk = new BMap.Marker(point, { enableDragging: true })
      this.map.addOverlay(this.mk)
      this.mk.addEventListener('dragend', function(e) {
        that.getAddrByPoint(e.point)
      })
      // 4、添加（右上角）平移缩放控件
      this.map.addControl(new BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL }))

      // 7、绑定点击地图任意点事件
      this.map.addEventListener('click', function(e) {
        that.getAddrByPoint(e.point)
      })
    },
    //逆地址解析函数
    getAddrByPoint(point) {
      var that = this
      var geco = new BMap.Geocoder()
      geco.getLocation(point, function(res) {
        console.log(res)
        that.mk.setPosition(point)
        that.map.panTo(point)
        that.form.address = res.address
        that.form.addrPoint = point
        that.form.city = res.addressComponents.city
      })
    },
    //地址搜索
    querySearchAsync(str, cb) {
      var options = {
        onSearchComplete: function(res) {
          var s = []
          if (local.getStatus() == BMAP_STATUS_SUCCESS) {
            for (var i = 0; i < res.getCurrentNumPois(); i++) {
              s.push(res.getPoi(i))
            }
            cb(s)
          } else {
            cb(s)
          }
        }
      }
      var local = new BMap.LocalSearch(this.map, options)
      local.search(str)
    },
    // 选择地址
    handleSelect(item) {
      this.form.address = item.address + item.title
      this.form.addrPoint = item.point
      this.map.clearOverlays()
      this.mk = new BMap.Marker(item.point)
      this.map.addOverlay(this.mk)
      this.map.panTo(item.point)
    },
  }
}
</script>

<style lang="scss" scoped>
.autoAddressClass{
  li {
    i.el-icon-search {margin-top:11px;}
    .mgr10 {margin-right: 10px;}
    .title {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .address {
      line-height: 1;
      font-size: 12px;
      color: #b4b4b4;
      margin-bottom: 5px;
    }
  }
}
.sumbit{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
