<template>
  <div>
    <el-card style="margin: 10px 0">

      <div class="filter-container">
        <el-form :inline="true">
          <el-form-item class="form-item" label="记录状态">
            <el-select v-model="status" placeholder="记录状态" style="width: 200px; margin-right: 5px" clearable>
              <el-option label="未入库" value="未入库"/>
              <el-option label="已入库" value="已入库"/>
            </el-select>
          </el-form-item>
          <el-form-item class="form-item" label="商品名称">
            <el-input v-model="productName" placeholder="商品名称" style="width: 200px; margin-right: 5px"/>
          </el-form-item>
          <el-form-item class="form-item">
            <el-button type="primary" icon="el-icon-search" @click="handleFilter">
              查询
            </el-button>
          </el-form-item>
          <el-button type="primary" icon="el-icon-refresh-right" class="form-item"
                     style="margin-left: 10px" @click="reset"
          >刷 新
          </el-button>
        </el-form>
      </div>

      <el-table ref="multipleTable" style="margin-top: 10px" border stripe
                :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      >
        <el-table-column label="#" type="index" align="center"></el-table-column>
        <el-table-column label="记录ID" align="center" prop="id" show-overflow-tooltip></el-table-column>
        <el-table-column label="入库ID" align="center" prop="inputId" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品ID" align="center" prop="productId" show-overflow-tooltip>
          <template slot-scope="{row}">
            <product :id="row.productId"></product>
          </template>
        </el-table-column>
        <el-table-column label="分站ID" align="center" prop="substationId" show-overflow-tooltip></el-table-column>
        <el-table-column label="分库ID" align="center" prop="subwareId" show-overflow-tooltip>
          <template slot-scope="{row}">
            <subware :id="row.subwareId"></subware>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" min-width="200" align="center" prop="productName" show-overflow-tooltip></el-table-column>
        <el-table-column label="入库时间" min-width="200" align="center" prop="inputTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag type="success" v-show="scope.row.status === '已入库'">{{ scope.row.status }}</el-tag>
            <el-tag type="danger" v-show="scope.row.status === '未入库'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="入库数量" align="center" prop="inputNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="实际入库数量" align="center" prop="actualNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="default" icon="el-icon-printer" @click="toConfirm(scope.row)"
                       :disabled="scope.row.status==='已入库'"
            >入库
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
    <el-dialog title="确认入库" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" center>
      <p style="size: A3">请选择采购入库的数量</p>
      <el-slider v-model="inNum" show-input :max="Math.ceil(this.invalue)" :min="Math.floor(this.invalue*0.5)"
                 :step="1"
      >
      </el-slider>
      <el-button type="primary" round @click="confirmIn">提交</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { cenInput, cenInputList } from '@/api/ware'
import product from '../../../../components/detail/product'
import subware from '../../../../components/detail/subware'
import supplier from '../../../../components/detail/supplier'

export default {
  name: 'returnIn',
  components: { supplier, subware, product },
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pagesize: 10,
      type: '退货入库',
      inId: '',
      dialogFormVisible: false,
      invalue: '',
      inNum: '',
      status: '',
      productName: ''
    }
  },
  watch: {
    dialogFormVisible: {
      handler() {
        this.reset()
      }
    }
  },
  methods: {
    handleFilter() {
      cenInputList(this.type).then(res => {
        console.log(res.data)
        this.tableData = res.data
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData.at(i).inputTime = this.getLocalTime(this.tableData.at(i).inputTime)
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
      cenInputList(this.type).then(res => {
        console.log(res.data)
        this.tableData = res.data
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData.at(i).inputTime = this.getLocalTime(this.tableData.at(i).inputTime)
        }
      })
    },

    toConfirm(row) {
      this.inId = row.id
      this.invalue = row.inputNum
      this.inNum = row.inputNum
      this.dialogFormVisible = true
    },
    confirmIn() {
      cenInput(this.inId, this.inNum).then(res => {
        console.log(res)
        if (res.msg === '确认入库成功') {
          this.dialogFormVisible = false
          this.$message({
            message: '入库成功',
            type: 'success'
          })
        }
      })
    }
  },
  mounted() {
    cenInputList(this.type).then(res => {
      console.log(res.data)
      this.tableData = res.data
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData.at(i).inputTime = this.getLocalTime(this.tableData.at(i).inputTime)
      }
    })
  }
}
</script>

<style scoped>

</style>
