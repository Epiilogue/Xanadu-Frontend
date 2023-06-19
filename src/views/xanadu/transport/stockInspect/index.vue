<!--缺货检查-->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="Name" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                 @click="handleDownload"
      >
        导出为EXCEL
      </el-button>
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
        <el-table-column label="ID" prop="id" align="center" width="80"
        >
          <template slot-scope="{row}">
            <span>{{ row.product.id }}</span>
          </template>
        </el-table-column>

        <el-table-column label="商品名称" prop="name" min-width="80px" align="center">
          <template slot-scope="{row}">
            <span class="link-type" @click="handleUpdate(row)">{{ row.product.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="当前库存" prop="nowCount" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span class="link-type" @click="handleUpdate(row)">{{ row.nowCount }}</span>
          </template>
        </el-table-column>

        <el-table-column label="安全库存" prop="safeStock" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span class="link-type">{{ row.product.safeStock }}</span>
          </template>
        </el-table-column>

        <el-table-column label="最大库存" prop="maxCount" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span class="link-type">{{ row.product.maxCount }}</span>
          </template>
        </el-table-column>

        <el-table-column label="缺货数量" prop="needCount" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span class="link-type">{{ row.needCount }}</span>
          </template>
        </el-table-column>


        <el-table-column label="创建时间" width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ timestampToTime()(row.createTime) }}</span>
          </template>
        </el-table-column>

        <!--        <el-table-column label="创建客服" min-width="50px" align="center">
                  <template slot-scope="{row}">
                    <span class="link-type">{{ row.createBy }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="缺货状态" min-width="50px" align="center">
                  <template slot-scope="{row}">
                    <el-tag :type="row.status ==='未提交'?'warning': row.status==='已提交'?'info':row.status ==='已到货'?'':'success'">{{ row.status }}</el-tag>
                  </template>
                </el-table-column>-->

        <el-table-column label="操作" align="center" mid-width="230px" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="medium" @click="handleUpdate(row)">
              详情
            </el-button>
            <el-button size="medium" type="danger" @click="handleCommit(row.id)">
              提交
            </el-button>
            <el-button @click="handleArrival(row.id)">
              到货
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
            <span class="link-type">{{ row.createBy}}</span>
          </template>
        </el-table-column>
        <el-table-column label="缺货数量" prop="createBy" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span class="link-type">{{ row.needNumbers}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ timestampToTime()(row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="缺货来源" prop="createBy" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span class="link-type">{{ row.source}}</span>
          </template>
        </el-table-column>
      </el-table>

    </el-dialog>

  </div>
</template>

<script>
import { fetchList, createArticle, updateArticle, deleteProduct, fetchLackRecordList } from '@/api/distribution'
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
      items: [
        { type: '', label: '已提交' },
        { type: 'success', label: '已到货' },
        { type: 'info', label: '已采购' },
        { type: 'danger', label: '' },
        { type: 'warning', label: '未提交' }
      ],
      category: [],
      tableKey: 0,
      list: null,
      showList: null,
      total: 0,
      listLoading: true,
      /*      pageNum: 5,
           pageSize: 20,  */
      defaultParams: {
        label: 'category',
        value: 'category',
        children: 'children'
      },
      currentPage: 1,//默认显示第一页
      pageSize: 5,//默认每页显示5条
      totalNum: 100, //总页数
      listQuery: {
        pageNum: 1,
        pageSize: 5,
        currentPage: 1
      },
      //importanceOptions: [false, true],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        createBy: '',
        createTime: '',
        //deleted: '',
        id: '',
        needNumbers: '',
        orderId: '',
        productId: '',
        status: ''
      },
      imageUrl: '',
      options: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      dataObj: {
        policy: '',
        signature: '',
        key: '',
        accessid: '',
        dir: '',
        host: ''
        // callback:'',
      },
      downloadLoading: false,
      singleLackRecord: null
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
    //获取缺货记录详情
    getSingleLackRecord(id) {
      for (var i = 0; i < this.list.length; i++) {
        if(this.list[i].product.id===id){
          this.singleLackRecord  =  this.list[i].singleLackRecordVos
        }
      }
      console.log(this.singleLackRecord)
    },
    handleCommit(index) {
      commitStockOut(index).then(response => {
        console.log(response)
        this.$message({
          message: '成功提交',
          type: 'success'
        })
        this.getList()
      })
    },
    handleChange(value) {
      this.temp.firstCategray = value[0]
      this.temp.secondCategray = value[1]
      console.log(value)
    },
    //分页组件修改页面容量
    handleSizeChange(newSize) {
      this.pageSize = newSize
    },
    // 分页组件监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.currentPage = newPage
    },
    //todo 查询方法
    getShowList(name) {
      this.showList = []
      let len = this.list.length

    },
    getList(name) {
      this.listLoading = true
      fetchLackRecordList().then(response => {
        this.list = response.data
        console.log(this.list)
        this.total = response.data.length
        setTimeout(() => {
          this.listLoading = false
        }, 0.1 * 1000)
      })
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
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        price: '',
        cost: '',
        upplierId: '',
        firstCategray: '',
        secondCategray: '',
        refundAble: false,
        changeAble: false,
        comment: '',
        createTime: new Date(),
        updateTime: new Date(),
        picture: ''
      }
    },
    handleUpdate(row) {
      this.dialogFormVisible = true
      this.temp = row
      this.getSingleLackRecord(row.product.id)
    },
    updateData() {
      updateStockOut(this.temp).then(response => {
        console.log(response)
        if (response.code === 200) {
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
          this.dialogFormVisible = false
        }
      })
    },
    handleDelete(row, index) {
      console.log(row)
      deleteProduct(row.id).then((res) => {
          console.log(res)
          if (res.code === 200) {
            this.$notify({
              title: 'Success',
              message: 'Delete Successfully',
              type: 'success',
              duration: 2000
            })
          }
        }
      )

      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', 'name', 'price', 'cost', 'upplierId', 'firstCategray', 'secondCategray', 'refundAble', 'changeAble', 'comment', 'createTime', 'updateTime', 'picture']
        const filterVal = ['id', 'name', 'price', 'cost', 'upplierId', 'firstCategray', 'secondCategray', 'refundAble', 'changeAble', 'comment', 'createTime', 'updateTime', 'picture']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'createTime' || j === 'updateTime') {
          return timestampToTime(v[j])
        } else {
          return v[j]
        }
      }))
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
