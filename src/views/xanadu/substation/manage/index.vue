<!-- 超级管理员可访问 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-container">
        <el-form :inline="true">
          <el-form-item class="form-item" label="地址">
            <el-input v-model="listQuery.address" placeholder="分站地址" style="width: 200px; margin-right: 5px"/>
          </el-form-item>
          <el-form-item class="form-item" label="名称">
            <el-input v-model="listQuery.name" placeholder="分站名称" style="width: 200px; margin-right: 5px"/>
          </el-form-item>
          <el-form-item class="form-item">
            <el-button type="primary" icon="el-icon-search" @click="handleFilter">
              查询
            </el-button>
            <el-button style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
              创建分站
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-card>
      <el-table :key="tableKey" v-loading="listLoading"
                :data="queryList.slice((currentPage - 1) * pageSize, currentPage * pageSize)" border fit
                highlight-current-row
                style="width: 100%;"
      >
        <el-table-column label="ID" prop="id" align="center" width="80">
          <template slot-scope="{row}">
            <span class="link-type" @click="handleUpdate(row)">{{ row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column label="名称" prop="name" min-width="80px" align="center">
          <template slot-scope="{row}">
            {{ row.name }}
          </template>
        </el-table-column>

        <el-table-column label="地址" prop="address" min-width="50px" align="center">
          <template slot-scope="{row}">
            {{ row.address }}
          </template>
        </el-table-column>

        <el-table-column label="电话" prop="phone" min-width="50px" align="center">
          <template slot-scope="{row}">
            {{ row.phone }}
          </template>
        </el-table-column>

        <!--TODO:组件添加        -->
        <el-table-column label="分库Id" min-width="50px" prop="subwareId" align="center">
          <template slot-scope="{row}">
            {{ row.subwareId }}
          </template>
        </el-table-column>


        <!-- 设置当前操作的分站 -->
        <el-table-column label="管理分站事务" min-width="100" align="center">
          <template slot-scope="{ row }">
            <!-- <p>{{ row.id  selectedSub}}</p> -->
            <el-switch :value="row.id === selectedSub" @change="handleChange(row)">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button type="primary" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-button @click="handleDelete(row, $index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1"
                     :page-sizes="[10,15,20]" :page-size="15" layout="total, sizes, prev, pager, next, jumper"
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
          <SubwareSelect
            :value="temp.subwareId"
            :single="true"
            @getInfo="getSubware"
          />
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination/index.vue'
import { AddSubstation, deleteSubstation, fetchAllSubStation, updateSubstation } from '@/api/sub'
import SubwareSelect from '@/components/Pop/Subware/index.vue'

export default {
  components: { Pagination, SubwareSelect },
  directives: { waves },
  data() {
    return {

      // 是否已确定处理事务的分站id,未设置为''
      selectedSub: '',

      tableKey: 0,
      list: [],
      queryList: [],
      total: 0,
      listLoading: true,
      currentPage: 1,//默认显示第一页
      pageSize: 15,//默认每页显示5条
      listQuery: {
        address: '',
        name: ''
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        phone: [{ required: true, message: '请选择电话', trigger: 'blur' }],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        subwareId: [{ required: true, message: '请输入分库Id', trigger: 'blur' }]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      temp: {
        id: undefined,
        name: '',
        price: '',
        address: '',
        subwareId: '',
        userId: '',
        phone: ''
      }
    }
  },
  created() {
    // 获取正在处理的分站id
    let subId = this.$cache.session.get('subProcessing')
    this.selectedSub = subId ? Number(subId) : ''
    this.getList()
  },
  // 缓存处理事务的分站id
  beforeDestroy() {
    if (this.selectedSub) {
      this.$cache.session.set('subProcessing', this.selectedSub)
    } else if (this.$cache.session.get('subProcessing')) {
      this.$cache.session.remove('subProcessing')
    }
  },
  methods: {
    getSubware(selections) {
      if (selections.length > 0) {
        this.temp.subwareId = selections[0].id + ''
        this.temp.address = selections[0].address
      }
    },
    //分页组件修改页面容量
    handleSizeChange(newSize) {
      this.pageSize = newSize
    },
    // 分页组件监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.currentPage = newPage
    },

    // 设置处理事务的分站id
    handleChange(row) {
      if (row.id === this.selectedSub) {
        // 取消选中
        this.selectedSub = ''
      } else {
        // 选中
        this.selectedSub = row.id
      }
    },

    getList() {
      this.listLoading = true
      fetchAllSubStation().then(response => {
        this.list = response.data
        this.total = response.data.length
        this.queryList = this.list
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listLoading = true
      this.queryList = this.list.filter((sub) => {
        // 查询条件
        let query = this.listQuery
        // 名称 地址
        if (query.name !== '' && sub.name.indexOf(query.name) === -1) {
          return false
        }
        if (query.address !== '' && sub.address.indexOf(query.address) === -1) {
          return false
        }
        return true
      })
      this.total = this.queryList.length
      this.listLoading = false
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        price: '',
        address: '',
        subwareId: '',
        userId: '',
        phone: ''
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
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          }).then(
            () => this.getList()
          )
        } else {
          alert('!!!')
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.subwareId = row.subwareId + ''
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
      deleteSubstation(row.id).then((res) => {
          if (res.code === 200) {
            this.total--
            this.$notify({
              title: 'Success',
              message: 'Delete Successfully',
              type: 'success',
              duration: 2000
            })
            this.list.splice(index, 1)
          }
        }
      )
    }
  }
}
</script>
