<!--缺货检查-->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="optionalValue" placeholder="请选择" class="filter-item">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model="listQuery.name" placeholder="Name" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
        <el-date-picker
          v-model="date"
          class="filter-item"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
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
        <el-table-column label="退货单ID" prop="id" align="center" width="80"
        >
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column label="商品ID" prop="productId" min-width="80px" align="center">
          <template slot-scope="{row}">
            <span class="link-type" @click="handleUpdate(row)">{{ row.productId}}</span>
          </template>
        </el-table-column>

        <el-table-column label="供应商ID" prop="supplierId" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span class="link-type" @click="handleUpdate(row)">{{ row.supplierId }}</span>
          </template>
        </el-table-column>

        <el-table-column label="商品名称" prop="productName" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span class="link-type">{{ row.productName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="商品价格" prop="productPrice" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span class="link-type">{{ row.productPrice }}</span>
          </template>
        </el-table-column>

        <el-table-column label="进货数量" prop="inputNum" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span class="link-type">{{ row.inputNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="现库存量" prop="nowCount" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span class="link-type">{{ row.nowCount }}</span>
          </template>
        </el-table-column>

        <el-table-column label="退货数量" prop="refundCount" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span class="link-type">{{ row.refundCount }}</span>
          </template>
        </el-table-column>

        <el-table-column label="缺货状态" min-width="50px" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.status ==='已采购'?'success': row.status==='已入库'?'info':row.status ==='已到货'?'':'warning'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="退货时间" width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ timestampToTime()(row.refundTime) }}</span>
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
<!--            <el-button type="primary" size="medium" @click="handleUpdate(row)">
              详情
            </el-button>
            <el-button size="medium" type="danger" @click="handleCommit(row.id)">
              提交
            </el-button>-->
            <el-button @click="handleRefund(row.id)">
              退货
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
import {
  fetchList,
  createArticle,
  updateProduct,
  deleteProduct,
  fetchLackRecordList,
  getRefundList
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
      date:'',
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
      options: [{
        value: '商品ID',
        label: '商品ID'
      },{
        value: '供应商ID',
        label: '供应商ID'
      }],
      optionalValue:'',
      dialogFormVisible: false,
      dialogStatus: '',
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

    //分页组件修改页面容量
    handleSizeChange(newSize) {
      this.pageSize = newSize
    },
    // 分页组件监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.currentPage = newPage
    },

    getList(name) {
      this.listLoading = true
      getRefundList().then(response => {
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
