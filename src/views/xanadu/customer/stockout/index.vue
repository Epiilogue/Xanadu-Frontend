<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.orderId" placeholder="订单号" style="width: 200px;" class="filter-item"
      />
      <el-select v-model="listQuery.status" clearable placeholder="请选择" style="width: 200px;" class="filter-item">
        <el-option
          key="已提交" label="已提交" value="已提交"
        >
        </el-option>
        <el-option
          key="未提交" label="未提交" value="未提交"
        >
        </el-option>
        <el-option
          key="已采购" label="已采购" value="已采购"
        >
        </el-option>
        <el-option
          key="已到货" label="已到货" value="已到货"
        >
        </el-option>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
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
        <el-table-column
          type="selection"
          width="55"
        >
        </el-table-column>
        <el-table-column label="缺货记录ID" prop="id" align="center" width="90"
        >
          <template slot-scope="{row}">
            <stock-out :id="row.id"></stock-out>
          </template>

        </el-table-column>

        <el-table-column label="缺货订单号" min-width="80px" align="center">
          <template slot-scope="{row}">
            <order :id="row.orderId"/>
          </template>
        </el-table-column>

        <el-table-column label="缺货商品号" min-width="50px" align="center">
          <template slot-scope="{row}">
            <product :id="row.productId"/>
          </template>
        </el-table-column>

        <el-table-column label="缺货商品数量" prop="secondCategray" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.needNumbers }}</span>
          </template>
        </el-table-column>


        <el-table-column label="创建时间" width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ timestampToTime()(row.createTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建客服" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createBy }}</span>
          </template>
        </el-table-column>

        <el-table-column label="缺货状态" min-width="50px" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.status ==='未提交'?'warning': row.status==='已提交'?'info':row.status ==='已到货'?'':'success'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" mid-width="230px" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="medium" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-button size="medium" type="danger" @click="handleCommit(row.id)">
              提交
            </el-button>
          </template>
        </el-table-column>
      </el-table>


      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[10,15,20]"
        :page-size="15"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

    </el-card>
    <el-dialog title="添加缺货" :visible.sync="dialogFormVisible" style="width: 100%;padding-left: 5%">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="25%"
               style="width: 65%; margin-left:150px;"
      >
        <el-form-item label="添加缺货数量" prop="price">
          <el-input v-model="temp.needNumbers"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { deleteProduct, fetchPv } from '@/api/distribution'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination/index.vue'
import { timestampToTime } from '@/utils/ruoyi'
import SingleUpload from '@/components/upload/singleUpload.vue'
import { arrivalStockOut, commitStockOut, fetchStockOut, updateStockOut } from '@/api/customer'
import { update } from 'script-ext-html-webpack-plugin/lib/elements'
import StockOut from '@/components/detail/stockout.vue'

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
  components: { StockOut, SingleUpload, Pagination },
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
      listLoading: false,
      /*      pageNum: 5,
           pageSize: 20,  */
      defaultParams: {
        label: 'category',
        value: 'category',
        children: 'children'
      },
      currentPage: 1,//默认显示第一页
      pageSize: 15,//默认每页显示5条
      totalNum: 100, //总页数
      listQuery: {
        pageNum: 1,
        pageSize: 15,
        currentPage: 1,
        orderId: '',
        status: ''
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
      isCheck: '0',
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
      downloadLoading: false
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
      fetchStockOut().then(response => {
        this.list = response.data
        console.log(this.list)
        this.total = response.data.length
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      fetchStockOut().then((res) => {
        this.list = res.data
        this.total = res.data.length
        this.loading = false
      }).then(
        () => {
          //根据listQuery的订单id以及status进行过滤
          if (this.listQuery.orderId !== '') {
            this.list = this.list.filter(item => {
              return item.orderId == this.listQuery.orderId
            })
          }
          if (this.listQuery.status !== '') {
            this.list = this.list.filter(item => {
              return item.status === this.listQuery.status
            })
          }
        }
      )
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
      console.log(this.temp)
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
<!--      <el-table-column label="Author" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Imp" width="80px">
        <template slot-scope="{row}">
          <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>
      <el-table-column label="Readings" align="center" width="95">
        <template slot-scope="{row}">
          <span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>-->
