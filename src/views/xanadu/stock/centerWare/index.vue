<template>
  <div class="app-container">
    <el-form ref="form" :model="form">
      <el-form-item label="仓库地址:" prop="address">
        <el-autocomplete v-model="form.address" style="width:100%;" popper-class="autoAddressClass"
                         :fetch-suggestions="querySearchAsync" :trigger-on-focus="false" :placeholder="oldAddress"
                         clearable @select="handleSelect"
        >
          <template slot-scope="{ item }">
            <i class="el-icon-search fl mgr10"/>
            <div style="overflow:hidden;">
              <div class="title">{{ item.title }}</div>
              <span class="address ellipsis">{{ item.address }}</span>
            </div>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form :model="subware">
        <el-form-item label="仓库名称">
          <el-input v-model="subware.name" autocomplete="off">{{ this.subware.name }}</el-input>
        </el-form-item>
        <el-form-item label="仓库最大值">
          <el-input v-model="subware.maxNumber" autocomplete="off">{{ this.subware.maxNumber }}</el-input>
        </el-form-item>
        <el-form-item label="仓库预警值">
          <el-input v-model="subware.warnNumber">{{ this.subware.warnNumber }}</el-input>
        </el-form-item>
      </el-form>
      <el-form-item class="sumbit">
        <el-button type="primary" style="margin-right: 80px" @click="showMap">查看地图</el-button>
        <el-button type="primary" @click="addStock">确认提交</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="查看地图" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" label-width="110px">
        <el-form-item label="地图定位:">
          <div id="map-container" style="height:500px;width:730px;">
          </div>
        </el-form-item>
        <el-form-item class="sumbit">
          <el-button type="primary" @click="addStock">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
/* eslint-disable */
import loadBMap from '@/utils/loadBMap.js'
//import { BMap } from 'vue-baidu-map'
import { centerware, centerwareupdate } from '@/api/ware'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'updateView',

  computed: {
    oldAddress() {
      return '原地址： ' + this.inputAddress
    }
  },
  props: {
    inputID: Number,
    inputAddress: String,
    inputName: String,
    inputMaster: Number,
    inputCity: String,
    inputX: Number,
    inputY: Number
  },

  data() {
    return {
      form: {
        city: '',
        address: '', // 详细地址
        addrPoint: { // 详细地址经纬度
          lng: 0,
          lat: 0
        }
      },
      dialogFormVisible: false,
      map: '', // 地图实例
      mk: '', // Marker实例
      locationPoint: null,
      subware: {
        id: '',
        name: '',
        address: '',
        x: '',
        y: '',
        maxNumber: '',
        city: '',
        warnNumber: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      centerware().then(response => {
        this.subware.name = response.data.name
        this.subware.address = response.data.address
        this.subware.city = response.data.city
        this.subware.maxNumber = response.data.maxNumber
        this.subware.warnNumber = response.data.warnNumber
        this.subware.x = response.data.x
        this.subware.y = response.data.y
        this.form.address = this.subware.address
        this.form.addrPoint.lat = this.subware.x
        this.form.addrPoint.lng = this.subware.y
        this.form.city = this.subware.city
      })
    },
    async showMap() {
      this.dialogFormVisible = true
      await loadBMap('zEHMzU0K51Kr5Q9vgPFvV1xHRwYjGlnM') // 加载引入BMap
      this.initMap()
      setTimeout(null, 2000)

    },
    //修改仓库
    addStock() {
      this.subware.id = 1
      this.subware.x = this.form.addrPoint.lat
      this.subware.y = this.form.addrPoint.lng
      this.subware.address = this.form.address
      this.subware.city = this.form.city
      if (!this.subware.name) {
        this.$message.error('请输入仓库名称')
      } else if (!this.subware.maxNumber) {
        this.$message.error('请输入仓库管理员')
      } else if (!this.subware.address) {
        this.$message.error('请输入仓库地址')
      } else {
        centerwareupdate(this.subware).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          }
        })
      }
    },
    // 初始化地图
    initMap() {
      var that = this
      // 1、挂载地图
      this.map = new BMap.Map('map-container', { enableMapClick: false })
      //const x = this.subware.x
      //const y = this.
      var point = new BMap.Point(this.subware.x, this.subware.y)
      this.map.centerAndZoom(point, 3)
      // 3、设置图像标注并绑定拖拽标注结束后事件
      this.mk = new BMap.Marker(point, { enableDragging: true })
      this.map.addOverlay(this.mk)
      this.mk.addEventListener('dragend', function(e) {
        that.getAddrByPoint(e.point)
      })
      // 4、添加（右上角）平移缩放控件
      this.map.addControl(new BMap.NavigationControl({
        anchor: BMAP_ANCHOR_TOP_RIGHT,
        type: BMAP_NAVIGATION_CONTROL_SMALL
      }))

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
          if (local.getStatus() === BMAP_STATUS_SUCCESS) {
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
    }
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
