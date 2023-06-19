<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryInfo" placeholder="缺货商品ID" style="width: 250px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList(1)">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList(2)">
        搜索全部
      </el-button>
      <el-radio-group @click.native="radioChange($event)" style="margin-left: 30px" v-model="isCheck">
        <el-radio label="1" v-waves class="filter-item" type="primary">
          是否缺货检查
        </el-radio>
      </el-radio-group>
    </div>

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
        <el-table-column label="商品ID" prop="id" align="center" width="90">
          <template slot-scope="{row}">
            <span>{{ row.product.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="orderId" min-width="80px" align="center">
          <template slot-scope="{row}">
            <span class="link-type" @click="handleUpdate(row)">{{ row.product.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="实际数量" prop="nowCount" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span class="link-type" @click="handleUpdate(row)">{{ row.nowCount }}</span>
          </template>
        </el-table-column>

        <el-table-column label="缺货数量" prop="needCount" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span class="link-type" @click="handleUpdate(row)">{{ row.needCount }}</span>
          </template>
        </el-table-column>

        <el-table-column label="安全库存" prop="safeStock" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span class="link-type" @click="handleUpdate(row)">{{ row.product.safeStock }}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ timestampToTime()(row.createTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" mid-width="230px" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="medium" @click="handleUpdate(row)">
              详情
            </el-button>
            <el-button size="medium" type="danger" @click="handleGenerate(row)">
              生成进货单
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
    <el-dialog title="缺货记录详情" :visible.sync="dialogFormVisible" style="width: 100%;padding-left: 5%">
      <el-table
        :key="tableKey"
        :visible.sync="dialogFormVisible"
        v-loading="listLoading"
        :data="singleLackRecord"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="缺货记录id" prop="id" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span class="link-type">{{ row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column label="订单ID" prop="orderId" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span class="link-type">{{ row.orderId }}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建客服" prop="createBy" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span class="link-type">{{ row.createBy }}</span>
          </template>
        </el-table-column>
        <el-table-column label="缺货数量" prop="createBy" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span class="link-type">{{ row.needNumbers }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ timestampToTime()(row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="缺货来源" prop="createBy" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span class="link-type">{{ row.source }}</span>
          </template>
        </el-table-column>
      </el-table>

    </el-dialog>

    <el-dialog title="生成进货单" :visible.sync="generateVisible" style="width: 100%;padding-left: 5%">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="25%"
               style="width: 65%; margin-left:150px;"
      >
        <el-form-item label="输入进货数量" prop="inputCount">
          <el-input v-model="inputCount"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="generateVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import {
  fetchList,
  createArticle,
  updateArticle,
  deleteProduct,
  LackRecordInspect,
  fetchLackRecordList, generatePurchaseRecord
} from '@/api/distribution'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination/index.vue'
import axios from 'axios'
import { timestampToTime } from '@/utils/ruoyi'
import ImageUpload from '@/components/ImageUpload/index.vue'
import SingleUpload from '@/components/upload/singleUpload.vue'
import { arrivalStockOut, commitStockOut, fetchStockOut, updateStockOut } from '@/api/customer'
import { update } from 'script-ext-html-webpack-plugin/lib/elements'

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
  components: { SingleUpload, Pagination },
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
    handleArrival(index) {
      arrivalStockOut(index).then(response => {
        if (response.code === 200) {
          this.$message({
            message: '成功到货',
            type: 'success'
          })
          this.getList()
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
      if (flag === 2) {
        fetchLackRecordList().then(response => {
          if (that.isCheck === '') {
            let res = response.data
            res.forEach(function(item) {
              let singleRecord = item.singleLackRecordVos
              for (let i = 0; i < singleRecord.length; i++) {
                if (singleRecord[i].source === '订单缺货') {

                } else {
                  singleRecord.splice(i, 1)
                }
              }
              if (singleRecord.length !== 0) {
                that.list.push(item)
              }
            })
          } else {
            that.list = response.data
          }
          this.total = this.list.length
        })
      } else if (flag === undefined) {

      } else {
        if (this.queryInfo === '') {
          this.$message({
            message: '请输入搜索信息',
            type: 'warning'
          })
        } else {
          LackRecordInspect(parseInt(this.queryInfo), true).then(response => {
            if (this.isCheck === '1') {
              this.list.push(response.data)
            } else {
              console.log(response)
              let singleRecord = response.data.singleLackRecordVos
              for (let i = 0; i < singleRecord.length; i++) {
                if (singleRecord[i].source === '订单缺货') {

                } else {
                  singleRecord.splice(i, 1)
                }
              }
              if (singleRecord.length !== 0) {
                that.list.push(response.data)
              }

            }
            this.total = this.list.length
          })
        }
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
              key.id = '无'
              key.orderId = '无'
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
      this.oneAllLackRecord = row
    },

    //todo 生成进货单后,系统生成缺货单不再显示
    updateData() {
      this.oneAllLackRecord.inputCount = this.inputCount
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
        }
      })
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

