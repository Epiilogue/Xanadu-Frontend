<template>
  <div>
    <!--搜索栏-->
    <el-card style="height: 80px">
      <el-form :inline="true">
        <el-form-item label="商品ID:">
          <el-input type="text" placeholder="请输入你要搜索的商品ID" v-model="goodID" clearable @clear="reset"></el-input>
        </el-form-item>

        <el-form-item label="供应商ID:">
          <el-input type="text" placeholder="请输入你要搜索的供应商ID" v-model="supplierId" clearable @clear="reset"></el-input>
        </el-form-item>

        <el-form-item label="进货日期段:">
          <!--时间段搜索-->
          <el-date-picker
            v-model="datevalue"
            type="daterange"
            :clearable="false"
            :editable="false"
            range-separator="至"
            start-placeholder="创建开始日期"
            end-placeholder="创建结束日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item style="margin-left: 10px">
          <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button type="primary" size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
          <el-button type="primary" size="small" icon="el-icon-s-order" @click="showHistory">查看历史记录</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!--空状态-->
    <el-card style="margin: 10px 0" v-show="this.tableData.length === 0">
      <el-form :inline="true">
        <el-empty description="请输入要搜索的内容"></el-empty>
      </el-form>
    </el-card>

    <!--表格-->
    <el-card style="margin: 10px 0" v-show="this.tableData.length !== 0">
      <el-table ref="multipleTable" style="margin-top: 10px" border stripe
                :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      >
        <el-table-column label="#" type="index" align="center"></el-table-column>
        <el-table-column label="供应商ID" align="center" prop="supplierId" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品ID" align="center" prop="productId" show-overflow-tooltip>
          <template slot-scope="{row}">
            <product :id="row.productId"></product>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center" prop="productName" show-overflow-tooltip></el-table-column>
        <el-table-column label="入库数量" align="center" prop="inputNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="现有库存" align="center" prop="nowCount" show-overflow-tooltip></el-table-column>
        <el-table-column label="退货数量" align="center" prop="refundCount" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="default" icon="el-icon-printer" @click="toRefund(scope.row)">生成退货单
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

    <el-dialog title="确认退货" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" center>
      <p style="size: A3">请选择退货数量</p>
      <el-slider v-model="outNum" show-input :max="Math.ceil(this.outvalue)" :min="Math.floor(this.outvalue*0.5)"
                 :step="1"
      >
      </el-slider>
      <el-button type="primary" round @click="confirmRe()">提交</el-button>
    </el-dialog>

    <el-dialog title="历史退货安排" v-if="dialogFormVisible1" :visible.sync="dialogFormVisible1" center>
      <el-table ref="multipleTable" style="margin-top: 10px" border stripe
                :data="listData.slice((currentPage1-1)*pagesize1,currentPage1*pagesize1)"
      >
        <el-table-column label="#" type="index" align="center"></el-table-column>
        <el-table-column label="供应商ID" align="center" prop="supplierId" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品ID" align="center" prop="productId" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品名称" align="center" prop="productName" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品价格" align="center" prop="productPrice" show-overflow-tooltip></el-table-column>
        <el-table-column label="入库数量" align="center" prop="inputNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="现有库存" align="center" prop="nowCount" show-overflow-tooltip></el-table-column>
        <el-table-column label="退货数量" align="center" prop="refundCount" show-overflow-tooltip></el-table-column>
        <el-table-column label="退货时间" align="center" prop="refundTime" show-overflow-tooltip></el-table-column>
      </el-table>

      <el-pagination style="margin: 10px 0" @size-change="handleSizeChange1" @current-change="handleCurrentChange1"
                     :current-page.sync="currentPage1"
                     :page-sizes="[5, 7, 10, 15]" :page-size="10" layout="sizes, prev, pager, next"
                     :total=listData.length
      >
      </el-pagination>
    </el-dialog>

  </div>
</template>

<script>
import { historyList, refurnList, returnOrder } from '@/api/dbc-supplier'

export default {
  name: 'index',
  data() {
    return {
      supplierId: '',
      goodID: '',
      datevalue: '',
      tableData: [],
      currentPage: 1,
      currentPage1: 1,
      pagesize: 10,
      pagesize1: 10,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      outNum: '',
      outvalue: '',
      refund: {},
      listData: []
    }
  },
  methods: {
    showHistory() {
      historyList().then((res) => {
        var list = []
        list = res.data
        this.listData = []
        for (let i = 0; i < list.length; i++) {
          if (list[i].status === '已提交') {
            this.listData.push(list[i])
          }
        }
        for (let i = 0; i < this.listData.length; i++) {
          this.listData.at(i).refundTime = this.getLocalTime(this.listData.at(i).refundTime)
        }
        this.dialogFormVisible1 = true
      })
    },
    confirmRe() {
      returnOrder(this.outNum, this.refund).then((res) => {
        if (res.msg === '退货单提交成功') {
          this.dialogFormVisible = false
          this.$message({
            message: '退货单提交成功',
            type: 'success'
          })
        }
      })
      this.dialogFormVisible = false
      this.reset()
      this.tableData = []
    },
    toRefund(row) {
      this.dialogFormVisible = true
      this.outvalue = row.refundCount
      this.outNum = row.refundCount
      this.refund = row
    },
    //时间戳转换
    getLocalTime(nS) {
      var date = new Date(nS)
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
      let strDate = Y + M + D
      return strDate
    },
    //转型时间戳
    todate(date) {
      var d = new Date(date)
      d = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
      var s = new Date(d).getTime()
      return s
    },
    //重置搜索栏
    reset() {
      this.goodID = ''
      this.supplierId = ''
      this.datevalue = ''
      this.tableData = []
    },
    //搜索
    search() {
      if (this.goodID === '' && this.supplierId === '') {
        this.$message({
          type: 'info',
          message: '请输入搜索信息'
        })
      } else if (this.datevalue === '') {
        this.$message({
          type: 'info',
          message: '请选择搜索时间'
        })
      } else {
        var flag1 = true
        var flag2 = true
        var numReg = /^[0-9]+$/
        var numTe = new RegExp(numReg)
        if (this.goodID !== '') {
          flag1 = numTe.test(this.goodID)
        }
        if (this.supplierId !== '') {
          flag2 = numTe.test(this.supplierId)
        }
        if (!flag1 || !flag2) {
          this.$message({
            type: 'error',
            message: '输入信息不合法'
          })
          return
        } else {
          refurnList(this.supplierId, this.goodID,
            this.getLocalTime(this.datevalue.at(0)),
            this.getLocalTime(this.datevalue.at(1))).then((res) => {
            if (res.msg === '操作成功') {
              this.tableData = res.data
            } else {
              this.$message({
                type: 'error',
                message: '查询信息不存在'
              })
            }
          })
        }
      }
    },
    //分页
    handleSizeChange(newSize) {
      this.pagesize = newSize
    },
    // 分页组件监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.currentPage = newPage
    },
    //分页
    handleSizeChange1(newSize) {
      this.pagesize1 = newSize
    },
    // 分页组件监听页码值改变的事件
    handleCurrentChange1(newPage) {
      this.currentPage1 = newPage
    }
  }
}
</script>

<style scoped>

</style>
