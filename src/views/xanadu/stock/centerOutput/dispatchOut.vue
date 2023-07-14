<template>
  <div class="app-container">
    <!--   出库单打印内容   -->
    <div v-show="false">
      <form method="get" action="#" id="printJS-form-output">
        <div>
          <h3>Xanadu出库单</h3>
          <h3>打印时间：{{ parseTime()(this.printdata, '{y}-{m}-{d}-{h}:{m}:{s}') }}</h3>
          <h1>------------------------------------------------------------------------------------------------</h1>
          <table class="product-table">
            <thead>
            <tr>
              <th>商品名称</th>
              <th>单价</th>
              <th>总数</th>
              <th>供货商名称</th>
              <th>总价格</th>
              <th>预计出库日期</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in this.printform" :key="item.productId">
              <td>{{ item.productName }}</td>
              <td>{{ item.productPrice }}</td>
              <td>{{ item.totalNum }}</td>
              <td>{{ item.supplierName }}</td>
              <td>{{ item.totalPrice }}</td>
              <td>{{ parseTime()(item.date, '{y}-{m}-{d}') }}</td>
            </tr>
            </tbody>
          </table>
          <h1>------------------------------------------------------------------------------------------------</h1>
          <div style=" border-top: 1px solid #ccc; padding-top: 10px; margin-top: 20px;">
            <p>Xanadu公司盖章：</p>
          </div>
        </div>
      </form>
    </div>
    <!--  分发单打印内容  -->
    <div v-show="false">
      <form method="get" action="#" id="printJS-form-list">
        <div>
          <h3>Xanadu分发单</h3>
          <h3>打印时间：{{ parseTime()(this.printdata, '{y}-{m}-{d}-{h}:{m}:{s}') }}</h3>
          <h1>------------------------------------------------------------------------------------------------</h1>
          <table class="product-table">
            <thead>
            <tr>
              <th>商品名称</th>
              <th>单价</th>
              <th>总数</th>
              <th>供货商名称</th>
              <th>分库名</th>
              <th>总价格</th>
              <th>分发日期</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in this.printform1" :key="item.productId">
              <td>{{ item.productName }}</td>
              <td>{{ item.productPrice }}</td>
              <td>{{ item.totalNum }}</td>
              <td>{{ item.supplierName }}</td>
              <td>{{ item.subwareName }}</td>
              <td>{{ item.totalPrice }}</td>
              <td>{{ parseTime()(item.date, '{y}-{m}-{d}') }}</td>
            </tr>
            </tbody>
          </table>
          <h1>------------------------------------------------------------------------------------------------</h1>
          <div style=" border-top: 1px solid #ccc; padding-top: 10px; margin-top: 20px;">
            <h1>总金额：{{ this.totalaccount }}</h1>
            <p>分发员签字：</p>
            <p>签收人签字：</p>
            <p>Xanadu公司盖章：</p>
          </div>
        </div>
      </form>
    </div>
    <!--表格-->
    <el-card style="margin: 10px 0">

      <el-form :model="printData" ref="elForm" :rules="rules" size="small" label-width="68px" :inline="true">

        <el-form-item label="商品名称" prop="productId">
          <el-input v-model="productName" placeholder="输入商品名称"
                    prefix-icon="el-icon-paperclip" width="120%"
          ></el-input>
        </el-form-item>
        <el-form-item class="form-item" label="记录状态">
          <el-select v-model="status" placeholder="记录状态" style="width: 200px; margin-right: 5px" clearable>
            <el-option label="未出库" value="未出库"/>
            <el-option label="已出库" value="已出库"/>
            <el-option label="分库已入库" value="分库已入库"/>
          </el-select>
        </el-form-item>
        <el-button type="primary" size="small" style="margin-right: 40px" @click="refreshList">搜索</el-button>
        <br/>
        <el-form-item label="选择日期" prop="data" label-width="80px">
          <el-col>
            <el-date-picker type="date" placeholder="选择日期" v-model="printData.data" style="width: 100%;"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="商品名称" prop="productId">
          <el-input v-model="printData.productName" placeholder="输入商品名称"
                    prefix-icon="el-icon-paperclip" width="120%"
          ></el-input>
        </el-form-item>
        <el-form-item label="仓库id" prop="SubwareId">
          <el-input v-model="printData.subwareId" placeholder="输入仓库id"
                    prefix-icon="el-icon-paperclip" width="120%"
          ></el-input>
        </el-form-item>
        <el-button type="primary" size="small" @click="printDispatchOut">打印出库单</el-button>
        <el-button type="primary" size="small" @click="printDistributionList">打印分发单</el-button>
      </el-form>


      <el-table ref="multipleTable" style="margin-top: 10px" border stripe
                :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      >
        <el-table-column label="#" type="index" align="center"></el-table-column>
        <el-table-column label="记录ID" align="center" prop="id" show-overflow-tooltip></el-table-column>
        <el-table-column label="出库ID" align="center" prop="outputId" show-overflow-tooltip></el-table-column>
        <el-table-column label="任务ID" align="center" prop="taskId" show-overflow-tooltip>
          <template slot-scope="{row}">
            <task :id="row.taskId"></task>
          </template>
        </el-table-column>
        <el-table-column label="商品ID" align="center" prop="productId" show-overflow-tooltip>
          <template slot-scope="{row}">
            <product :id="row.productId"></product>
          </template>
        </el-table-column>
        <el-table-column label="分库ID" align="center" prop="subwareId" show-overflow-tooltip>
          <template slot-scope="{row}">
            <subware :id="row.subwareId"></subware>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" min-width="100" align="center" prop="productName" show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="出库时间" align="center" min-width="150" prop="outputTime" show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="预计出库时间" align="center" min-width="150" prop="requireTime" show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="状态" align="center" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag type="success" v-show="scope.row.status === '已出库'">{{ scope.row.status }}</el-tag>
            <el-tag type="danger" v-show="scope.row.status === '未出库'">{{ scope.row.status }}</el-tag>
            <el-tag type="warning" v-show="scope.row.status === '分库已入库'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="出库数量" align="center" prop="outputNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="实际出库数量" align="center" prop="actualNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="default" icon="el-icon-printer" @click="toConfirm(scope.row)"
                       :disabled="scope.row.status!=='未出库'"
            >出库
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination style="margin: 10px 0" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="currentPage"
                     :page-sizes="[5, 7, 10, 15]" :page-size="10" layout="sizes, prev, pager, next"
                     :total=tableData.length
      >
      </el-pagination>
    </el-card>

    <!--confirm-->
    <el-dialog title="确认出库" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" center>
      <p style="size: A3">请选择调拨出库的数量</p>
      <el-slider v-model="outNum" show-input :max="Math.ceil(this.outvalue)" :min="Math.floor(this.outvalue*0.5)"
                 :step="1"
      >
      </el-slider>
      <el-button type="primary" right round @click="confirmOut">提交</el-button>

    </el-dialog>


  </div>

</template>

<script>

import { cenConfirmOut, cenDispatchOut } from '@/api/ware'
import subware from '../../../../components/detail/subware'
import product from '../../../../components/detail/product'
import printJS from 'print-js'
import axios from 'axios'
import { parseTime } from '@/utils/ruoyi'

export default {
  name: 'DispatchOut',
  components: { subware, product },
  data() {
    return {
      totalaccount: 0,
      printdata: '',
      tableData: [],
      currentPage: 1,
      pagesize: 10,
      outId: '',
      dialogFormVisible: false,
      outvalue: '',
      outNum: '',
      productName: '',
      status: '',
      printData: {
        data: null,
        productName: '',
        subwareId: undefined
      },
      printform: {
        productName: '',
        productPrice: '',
        number: '',
        supplierName: '',
        totalNum: '',
        totalPrice: '',
        date: ''
      },
      printform1: {
        productName: '',
        number: '',
        productPrice: '',
        supplierName: '',
        remark: '无',
        totalNum: '',
        totalPrice: '',
        subwareName: '',
        date: ''
      },
      rules: {
        data: [{
          required: true,
          type: 'date',
          message: '请选择日期',
          trigger: 'blur'
        }]
      }
    }
  },
  watch: {
    dialogFormVisible: {
      /*handler() {
        this.reset()
      }*/
    }
  },
  methods: {
    refreshList() {
      cenDispatchOut().then(res => {
        this.tableData = res.data
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData.at(i).outputTime = this.getLocalTime(this.tableData.at(i).outputTime)
          this.tableData.at(i).requireTime = this.getLocalTime(this.tableData.at(i).requireTime)
        }
      }).then(() => {
        if (this.productName !== '') {
          this.tableData = this.tableData.filter(item => item.productName.indexOf(this.productName) > -1)
        }
        if (this.status !== '') {
          this.tableData = this.tableData.filter(item => item.status.indexOf(this.status) > -1)
        }
      })
    },
    parseTime() {
      return parseTime
    },

    toConfirm(row) {
      this.outId = row.id
      this.outvalue = row.outputNum
      this.outNum = row.outputNum
      this.dialogFormVisible = true
    },
    confirmOut() {
      cenConfirmOut(this.outId, this.outNum).then(res => {
        if (res.msg === '操作成功') {
          this.dialogFormVisible = false
          this.$message({
            message: '出库成功',
            type: 'success'
          })
          //找到list种outId相同的行，并删除
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData.at(i).id === this.outId) {
              this.tableData.splice(i, 1)
              break
            }
          }
        }
      })
    },
    printDispatchOut() {
      if (this.printData.data === null) {
        this.$message({
          message: '请选择日期',
          type: 'warning'
        })
      } else {
        const that = this
        axios.get('http://localhost:8015/ware/centerOutput/printInventoryList', {
          params: {
            date: that.printData.data.toLocaleString(),
            productName: that.printData.productName
          }
        }).then(function(res) {
          //代表请求成功之后处理
          that.printform = res.data.data
          that.printdata = new Date()
          setTimeout(function() {
            that.print()
          }, 1000)
        }).catch(function(err) {
          //代表请求失败之后处理
          that.$message({
            message: '没有对应的出库记录',
            type: 'error'
          })
          console.log(err)
        })

      }
    },
    printDistributionList() {
      // printDistributionList(this.printData.data, this.printData.productName, this.printData.subwareId).then(res=>{
      //   this.printform1 = res.data.data;
      //   this.print1();
      // })
      if (this.printData.data === null || this.printData.subwareId === undefined) {
        this.$message({
          message: '请选择日期或仓库id',
          type: 'warning'
        })
      } else {
        console.log(this.printData.subwareId)
        const that = this
        axios.get('http://localhost:8015/ware/centerOutput/printDistributionList', {
          params: {
            date: that.printData.data.toLocaleString(),
            productName: that.printData.productName,
            subwareId: that.printData.subwareId
          }
        }).then(function(res) {
          //代表请求成功之后处理
          that.printform1 = res.data.data
          that.printdata = new Date()
          console.log(that.printform1)
          that.totalaccount = 0
          let i = 0
          while (i < that.printform1.length) {
            that.totalaccount += that.printform1[i].totalPrice
            i = i + 1
          }
          setTimeout(function() {
            that.print1()
          }, 1000)
        }).catch(function(err) {
          //代表请求失败之后处理
          that.$message({
            message: '没有对应的分发记录',
            type: 'error'
          })
        })
      }
    },
    print() {
      printJS('printJS-form-output', 'html')
    },
    print1() {
      printJS('printJS-form-list', 'html')
    },
    //时间戳转换
    getLocalTime(nS) {
      var date = new Date(nS)
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
      var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
      let strDate = Y + M + D + h + m + s
      return strDate
    },

    //转型时间戳
    todate(date) {
      var d = new Date(date)
      d = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
      var s = new Date(d).getTime()
      return s
    },

    //分页
    handleSizeChange(newSize) {
      this.pagesize = newSize
    },
    // 分页组件监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.currentPage = newPage
    },

    reset() {
      cenDispatchOut().then(res => {
        this.tableData = res.data
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData.at(i).outputTime !== null) {
            this.tableData.at(i).outputTime = this.getLocalTime(this.tableData.at(i).outputTime)
          }
          if (this.tableData.at(i).requireTime !== null) {
            this.tableData.at(i).requireTime = this.getLocalTime(this.tableData.at(i).requireTime)
          }
        }
      })
    }
  },
  mounted() {
    cenDispatchOut().then(res => {
      this.tableData = res.data
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData.at(i).outputTime !== null) {
          this.tableData.at(i).outputTime = this.getLocalTime(this.tableData.at(i).outputTime)
        }
        if (this.tableData.at(i).requireTime !== null) {
          this.tableData.at(i).requireTime = this.getLocalTime(this.tableData.at(i).requireTime)
        }
      }
    })
  }

}
</script>

<style scoped>
.product-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px; /* 设置表格字体大小 */
}

.product-table th,
.product-table td {
  padding: 10px;
  border: 1px solid #ccc;
}

.product-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.product-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.product-table tbody tr:hover {
  background-color: #ebebeb;
}
</style>
