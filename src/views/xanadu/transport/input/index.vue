<template>
  <div class="app-container">
    <el-card>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="进货单ID" prop="id" align="center" width="90">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>

          </template>
        </el-table-column>
        <el-table-column label="商品ID" prop="id" align="center" width="90">
          <template slot-scope="{row}">
            <product :id="row.id"></product>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="orderId" min-width="80px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.productName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="供销商ID" prop="supplierId" min-width="80px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.supplierId }}</span>
          </template>
        </el-table-column>

        <el-table-column label="进货数量" prop="number" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.number }}</span>
          </template>
        </el-table-column>

        <el-table-column label="商品单价" prop="productPrice" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.productPrice }}</span>
          </template>
        </el-table-column>

        <el-table-column label="进货单总消费" prop="totalCost" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.totalCost }}</span>
          </template>
        </el-table-column>

        <el-table-column label="购货单状态" min-width="50px" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.status ==='已采购'?'info':'success'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ timestampToTime()(row.createTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="更新时间" width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ timestampToTime()(row.updateTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" mid-width="230px" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button type="primary" :disabled="row.status !== '已结算' " size="medium" @click="handleUpdate(row)">
              删除
            </el-button>
            <el-button size="medium" type="danger" :disabled="row.status !=='已采购'" @click="confirmArrival(row)">
              采购到货
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[1, 2, 5, 7]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

    </el-card>
    <el-dialog title="生成进货单" :visible.sync="generateVisible" style="width: 100%;padding-left: 5%">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="25%"
               style="width: 65%; margin-left:150px;"
      >
        <el-form-item label="输入进货数量" prop="inputCount">
          <el-slider v-model="inputNum" show-input :max="Math.ceil(this.inputRan*1.2)" :min="Math.floor(this.inputRan*0.8)" :step="1">
          </el-slider>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="generateVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleArrival()">
          提交
        </el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import {
  LackRecordInspect,
  fetchLackRecordList, generatePurchaseRecord, fetchPurchaseRecordList, confirmPurchase, deletePurchase
} from '@/api/distribution'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination/index.vue'
import axios from 'axios'
import { timestampToTime } from '@/utils/ruoyi'
import ImageUpload from '@/components/ImageUpload/index.vue'
import SingleUpload from '@/components/upload/singleUpload.vue'
import { arrivalStockOut, commitStockOut, fetchStockOut, updateStockOut } from '@/api/customer'
import { update } from 'script-ext-html-webpack-plugin/lib/elements'
import Product from '@/components/detail/product.vue'

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
  name: 'ComplexTable',
  components: { Product, SingleUpload, Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      category: [],
      tableKey: 0,
      list: null,
      showList: null,
      total: 0,
      listLoading: true,
      singleLackRecord: null,
      queryInfo: '',
      currentPage: 1,//默认显示第一页
      pageSize: 5,//默认每页显示5条
      totalNum: 100, //总页数
      inputNum:0,
      nowIndex:0,
      inputRan:0,
      listQuery: {
        pageNum: 1,
        pageSize: 5,
        currentPage: 1
      },
      temp: {
        createBy: '',
        createTime: '',
        id: '',
        needNumbers: '',
        orderId: '',
        inputCount: '',
        productId: '',
        source: ''
      },
      isCheck: '',
      imageUrl: '',
      options: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      generateVisible: false,
      inputCount: '',
      oneAllLackRecord: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    timestampToTime() {
      return timestampToTime
    },
    confirmArrival(row){
      this.nowIndex = row.id
      this.inputRan = row.number
      this.inputNum = row.number
      this.generateVisible = true;
    },
    handleUpdate(row){
      deletePurchase(row.id).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '成功删除',
            type: 'success'
          })
          this.getList()
        }
      })
    },
    handleArrival(index) {
      confirmPurchase(this.nowIndex,this.inputNum).then(response => {
        if (response.code === 200) {
          this.$message({
            message: '成功到货',
            type: 'success'
          })
          this.getList()
          this.generateVisible = false
        }
      })
    },

    //分页组件修改页面容量
    handleSizeChange(newSize) {
      this.pageSize = newSize
    },
    // 分页组件监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.currentPage = newPage
    },
    radioChange(e) {
      if (e.target.tagName === 'INPUT') {
        if (this.isCheck === '') {
          this.isCheck = '1'
        } else {
          this.isCheck = ''
        }
      }
    },
    getList(flag) {
      let that = this
      this.list = []
      this.listLoading = false

      fetchPurchaseRecordList().then(response => {
        this.list = response.data
        this.total = this.list.length
      })
    }
  },
  handleFilter() {
    this.listQuery.page = 1
    this.getList()
  },
  handleModifyStatus(row, status) {
    this.$message({
      message: '操作Success',
      type: 'success'
    })
    row.status = status
  },
  handleUpdate(row) {
    this.temp = row
    for (var i = 0; i < this.list.length; i++) {
      if (this.list[i].product.id === row.product.id) {
        console.log(this.list[i].singleLackRecordVos)
        let tmp = this.list[i].singleLackRecordVos
        tmp.forEach(function(key) {
          if (key.id === -1) {
            key.createBy = '系统创建'
            key.id = -1
            key.orderId = -1
          }
        })
        this.singleLackRecord = this.list[i].singleLackRecordVos
      }
    }
    this.dialogFormVisible = true
  },

  handleGenerate(row) {
    this.inputCount = row.inputCount
    this.generateVisible = true
  },

  //todo 生成进货单后,系统生成缺货单不再显示
  updateData() {
    this.oneAllLackRecord.inputCount = this.inputCount
    console.log(this.oneAllLackRecord)
    generatePurchaseRecord(this.oneAllLackRecord).then(response => {
      console.log(response)
      if (response.code === 200) {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.generateVisible = false
        this.getList()
      }
    })
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

