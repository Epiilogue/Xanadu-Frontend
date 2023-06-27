<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="Name" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate"
      >
        创建商品
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
        @sort-change="sortChange"
      >
        <el-table-column label="ID" prop="id" align="center" width="80">
          <template slot-scope="{row}">
            <product :id="row.id"></product>
          </template>
        </el-table-column>

        <el-table-column label="名称" prop="name" min-width="80px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="商品大类" prop="firstCategray" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span >{{ row.firstCategray }}</span>
          </template>
        </el-table-column>

        <el-table-column label="商品小类" prop="secondCategray" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span >{{ row.secondCategray }}</span>
          </template>
        </el-table-column>

        <el-table-column label="价格" min-width="50px" prop="price" align="center">
          <template slot-scope="{row}">
            <span >{{ row.price }}</span>
          </template>
        </el-table-column>

        <el-table-column label="供应商ID" min-width="50px" prop="supplierId " align="center">
          <template slot-scope="{row}">
            <supplier :id="row.id"></supplier>
          </template>
        </el-table-column>

        <el-table-column label="可否退货" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span  >{{ row.refundAble }}</span>
          </template>
        </el-table-column>

        <el-table-column label="可否换货" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span  >{{ row.changeAble }}</span>
          </template>
        </el-table-column>

        <el-table-column label="备注" min-width="80px" align="center">
          <template slot-scope="{row}">
            <span  >{{ row.comment }}</span>
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
        <el-table-column label="最大库存量" min-width="80px">
          <template slot-scope="{row}">
            <span >{{ row.maxCount }}</span>
          </template>
        </el-table-column>

        <el-table-column label="安全库存量" min-width="80px">
          <template slot-scope="{row}">
            <span >{{ row.safeStock }}</span>
          </template>
        </el-table-column>

        <el-table-column label="商品图片" min-width="200px" prop="picture" align="center">
          <template slot-scope="{row}">
            <el-image :src="row.picture" style="width: 100px;height: 100px">
            </el-image>
          </template>
        </el-table-column>


        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button type="primary" @click="handleUpdate(row)">
              Edit
            </el-button>
            <el-button type="danger" @click="handleDelete(row,$index)">
              Delete
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
        :total="total">
      </el-pagination>

    </el-card>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" style="width: 100%;padding-left: 5%">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="25%" :rules="rules"
               style="width: 65%; margin-left:150px;"
      >
        <el-form-item label="货物名称" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="temp.price"/>
        </el-form-item>
        <el-form-item label="成本" prop="cost">
          <el-input v-model="temp.cost"/>
        </el-form-item>
        <el-form-item label="供应商ID" prop="supplierId">
          <el-input v-model="temp.supplierId"/>
        </el-form-item>

        <el-form-item label="是否可退货" prop="refundAble">
          <el-radio v-model="temp.refundAble" :label="true">是</el-radio>
          <el-radio v-model="temp.refundAble" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="是否可换货" prop="changeAble">
          <el-radio v-model="temp.changeAble" :label="true">是</el-radio>
          <el-radio v-model="temp.changeAble" :label="false">否</el-radio>
        </el-form-item>

        <el-form-item label="安全库存量" prop="safeStock">
          <el-input v-model="temp.safeStock"/>
        </el-form-item>

        <el-form-item label="最大库存量" prop="maxCount">
          <el-input v-model="temp.maxCount"/>
        </el-form-item>

        <el-form-item label="备注" prop="comment">
          <el-input v-model="temp.comment"/>
        </el-form-item>

        <el-form-item label="图片上传" prop="picture">
          <single-upload v-model="temp.picture"></single-upload>
        </el-form-item>

        <el-form-item label="商品种类" prop="category">
          <el-cascader
            v-model="category"
            :options="options"
            :props="defaultParams"
            @change="handleChange"
          >
          </el-cascader>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateProduct, deleteProduct } from '@/api/distribution'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination/index.vue'
import axios from 'axios'
import { timestampToTime } from '@/utils/ruoyi'
import ImageUpload from '@/components/ImageUpload/index.vue'
import SingleUpload from '@/components/upload/singleUpload.vue'
import Product from '@/components/detail/product.vue'
import Supplier from '@/components/detail/supplier.vue'

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
  components: { Supplier, Product, SingleUpload, Pagination },
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
        id: undefined,
        name: '',
        price: '',
        cost: '',
        supplierId: '',
        firstCategray: '',
        secondCategray: '',
        refundAble: false,
        changeAble: false,
        comment: '',
        safeStock: '',
        maxCount: '',
        createTime: new Date(),
        updateTime: new Date(),
        picture: '',
        deleted: false
        //status: 'published'
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        cost: [{ required: true, message: '请输入成本', trigger: 'blur' }],
        price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        upplierId: [{ required: true, message: '请输入供应商ID', trigger: 'blur' }],
        firstCategray: [{ required: true, message: '请选择商品大类', trigger: 'blur' }],
        secondCategray: [{ required: true, message: '请选择商品小类', trigger: 'blur' }],
        comment: [{ required: true, message: '请输入商品备注', trigger: 'blur' }],
        maxCount: [{ required: true, message: '请输入最大库存量', trigger: 'blur' }],
        safeStock: [{ required: true, message: '请输入安全库存量', trigger: 'blur' }]
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
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getOne(id){
      console.log(this.$children)
      //this.$children[0].getProduct(id);
    },
    timestampToTime() {
      return timestampToTime
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
    getCategory() {
      let cate = []
      const that = this
      axios.get('dbc/categary/listAll')
        .then(function(res) {
          //console.log(res)
          that.options = res.data.data
        })
    },
    //todo 查询方法
    getShowList(name) {
      this.showList = []
      let len = this.list.length

    },
    getList(name) {
      this.listLoading = true
      fetchList().then(response => {
        console.log(response)
        this.list = response.data
        this.total = response.data.length
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
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
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
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
    handleCreate() {
      this.resetTemp()
      this.getCategory()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      console.log(this.temp.picture)
      this.$refs['dataForm'].validate((valid) => {
        this.temp.deleted = false
        if (valid) {
          this.getList()
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          alert('!!!')
        }
      })
    },
    handleUpdate(row) {
      this.getCategory()
      this.category.push(this.temp.firstCategray)
      this.category.push(this.temp.secondCategray)
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateProduct(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      console.log(row)
      deleteProduct(row.id).then((res)=>{
          console.log(res)
          if(res.code === 200){
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
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
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
