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
        创建分站
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
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column label="名称" prop="name" min-width="80px" align="center">
          <template slot-scope="{row}">
            <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="地址" prop="address" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span class="link-type" @click="handleUpdate(row)">{{ row.address }}</span>
          </template>
        </el-table-column>

        <el-table-column label="电话" prop="phone" min-width="50px" align="center">
          <template slot-scope="{row}">
            <span class="link-type" @click="handleUpdate(row)">{{ row.phone}}</span>
          </template>
        </el-table-column>

        <el-table-column label="分库Id" min-width="50px" prop="subwareId" align="center">
          <template slot-scope="{row}">
            <span class="link-type" @click="handleUpdate(row)">{{ row.subwareId }}</span>
          </template>
        </el-table-column>

        <el-table-column label="管理人ID" min-width="50px" prop="userId" align="center">
          <template slot-scope="{row}">
            <span class="link-type" @click="handleUpdate(row)">{{ row.userId }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button type="primary"  @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-button @click="handleDelete(row,$index)">
              删除
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" style="width: 100%;padding-left: 5%">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="25%" :rules="rules"
               style="width: 65%; margin-left:150px;"
      >
        <el-form-item label="分站名称" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="temp.address"/>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="temp.phone"/>
        </el-form-item>
        <el-form-item label="分库ID" prop="subwareId">
          <el-input v-model="temp.subwareId" disabled="true"/>
        </el-form-item>

        <el-form-item label="管理人ID" prop="UserId">
          <el-input v-model="temp.userId"/>
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
import { AddSubstation, deleteSubstation, fetchAllSubStation, updateSubstation } from '@/api/sub'

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
        upplierId: '',
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
        deleted: false,
        address:'',
        subwareId:'',
        userId:'',
        phone:'',
        //status: 'published'
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        phone:[{ required: true, message: '请选择电话', trigger: 'blur' }],
        address:[{ required: true, message: '请输入地址', trigger: 'blur' }],
        subwareId: [{ required: true, message: '请输入分库Id', trigger: 'blur' }],
        userId: [{ required: true, message: '请输入管理人ID', trigger: 'blur' }]
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
    //todo 查询方法
    getShowList(name) {
      this.showList = []
      let len = this.list.length

    },
    getList() {
      this.listLoading = true
      fetchAllSubStation().then(response => {
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
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        price: '',
        address:'',
        subwareId:'',
        userId:'',
        phone:'',
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        this.temp.deleted = false
        if (valid) {
          AddSubstation(this.temp).then(() => {
            this.temp.id = this.total
            this.list.push(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
          this.getList()
        } else {
          alert('!!!')
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
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
          updateSubstation(tempData).then(() => {
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
      deleteSubstation(row.id).then((res)=>{
          if(res.code === 200){
            this.total--
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
