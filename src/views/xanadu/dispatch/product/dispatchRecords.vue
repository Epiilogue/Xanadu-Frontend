<template>
  <div class="app-container">
    <!-- 查询：商品id，分库id，调度单状态，商品调度-->
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item class="form-item" label="任务编号">
          <el-input v-model="listQuery.taskId" placeholder="任务编号" style="width: 200px; margin-right: 5px"/>
        </el-form-item>
        <el-form-item class="form-item" label="分库编号">
          <el-input v-model="listQuery.subwareId" placeholder="分库编号" style="width: 200px; margin-right: 5px"/>
        </el-form-item>
        <el-form-item class="form-item" label="调度单状态">
          <el-input v-model="listQuery.status" placeholder="调度单状态" style="width: 200px; margin-right: 5px"/>
        </el-form-item>
        <el-form-item class="form-item" label="商品名称">
          <el-input v-model="listQuery.productName" placeholder="商品名称" style="width: 200px; margin-right: 5px"/>
        </el-form-item>
        <el-form-item class="form-item">
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">
            查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :key="tableKey" v-loading="listLoading"
              :data="queryList.slice((currentPage - 1) * pageSize, currentPage * pageSize)" border fit
              highlight-current-row
              style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" align="center" min-width="50px">
        <template slot-scope="{row}">
          <dispatch :id="row.id"></dispatch>
        </template>
      </el-table-column>

      <el-table-column label="分库编号" prop="subwareId" min-width="50px" align="center">
        <template slot-scope="{row}">
          <subware :id="row.subwareId"></subware>
        </template>
      </el-table-column>

      <el-table-column label="商品编号" prop="productId" min-width="50px" align="center">
        <template slot-scope="{row}">
          <product :id="row.productId"></product>
        </template>
      </el-table-column>

      <el-table-column label="任务单编号" prop="taskId" min-width="50px" align="center">
        <template slot-scope="{row}">
          <taskvo :taskId="row.taskId"></taskvo>
        </template>
      </el-table-column>

      <el-table-column label="分站编号" prop="substationId" min-width="50px" align="center">
        <template slot-scope="{row}">
          <substation :id="row.substationId"></substation>
        </template>
      </el-table-column>

      <el-table-column label="商品名称" min-width="50px" prop="productName" align="center">
      </el-table-column>

      <el-table-column label="商品种类" min-width="50px" prop="productCategary" align="center">
      </el-table-column>

      <el-table-column label="调拨单状态" min-width="50px" prop="status" align="center">
      </el-table-column>

      <el-table-column label="商品数量" min-width="50px" prop="productNum" align="center">
      </el-table-column>

      <el-table-column label="计划出库时间" min-width="100px" prop="planTime" align="center">
        <template slot-scope="{row}">
          <span>{{ $moment(new Date(row.planTime)).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="150px" class-name="small-padding fixed-width">
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" style="width: 100%;padding-left: 5%">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="25%" :rules="rules"
               style="width: 65%; margin-left:150px;"
      >
        <!-- <el-form-item label="分库编号" prop="subwareId">
            <el-input v-model="temp.subwareId" />
        </el-form-item>
        <el-form-item label="任务单编号" prop="taskId">
            <el-input v-model="temp.taskId" />
        </el-form-item>
        <el-form-item label="商品编号" prop="productId">
            <el-input v-model="temp.productId" />
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
            <el-input v-model="temp.productName" />
        </el-form-item>
        <el-form-item label="商品分类" prop="productCategory">
            <el-input v-model="temp.productCategory" />
        </el-form-item>
        <el-form-item label="调拨单状态" prop="status">
            <el-input v-model="temp.status" />
        </el-form-item> -->
        <el-form-item label="分站编号" prop="substationId">
          <el-input v-model="temp.substationId"/>
        </el-form-item>
        <el-form-item label="商品数量" prop="productNum">
          <el-input v-model="temp.productNum"/>
        </el-form-item>
        <el-form-item label="计划出库时间" prop="planTime">
          <el-date-picker v-model="temp.planTime" type="date" placeholder="选择日期">
          </el-date-picker>
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
import dispatch from '@/components/detail/dispatch.vue'
import subware from '@/components/detail/subware.vue'
import product from '@/components/detail/product.vue'
import { deleteDispatch, editDispatch, getDispatchList } from '@/api/dpc-dispatch'

export default {
  name: 'dispatchRecords',
  components: { Pagination, dispatch, subware, product },
  directives: { waves },
  data() {
    return {

      tableKey: 0,
      list: [],
      queryList: [],
      total: 0,
      listLoading: true,
      currentPage: 1,//默认显示第一页
      pageSize: 15,//默认每页显示5条
      listQuery: {
        taskId: '',
        subwareId: '',
        status: '',
        productName: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      temp: {
        id: undefined,
        subwareId: '',
        taskId: '',
        productId: '',
        productName: '',
        productCategory: '',
        status: '',
        substationId: '',
        productNum: '',
        planTime: ''
      },
      rules: {}
    }
  },
  created() {
    this.getList()
  },

  methods: {

    //分页组件修改页面容量
    handleSizeChange(newSize) {
      this.pageSize = newSize
    },
    // 分页组件监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.currentPage = newPage
    },

        getList() {
            this.listLoading = true
            getDispatchList().then(response => {
                this.list = response.data
                this.total = response.data.length
                this.queryList = this.list
                this.listLoading = false
            }).catch(this.listLoading = false)
        },
        handleFilter() {
            this.listLoading = true;
            if (this.list) {
                this.queryList = this.list.filter((record) => {
                    // 查询条件：名称 任务编号 分库编号 调度单状态
                    let query = this.listQuery
                    if (query.productName !== '' && record.productName.indexOf(query.productName) === -1) {
                        return false
                    }
                    if (query.taskId !== '' && record.taskId !== Number(query.taskId)) {
                        return false
                    }
                    if (query.subwareId !== '' && record.subwareId !== Number(query.subwareId)) {
                        return false
                    }
                    if (query.status !== '' && record.status !== query.status) {
                        return false
                    }
                    return true
                });
            } else {
                this.queryList = []
            }
            this.total = this.queryList.length
            if (this.total === 0) {
                this.$message({
                    type: 'error',
                    message: '没有满足条件的数据',
                    durarion: 1000,
                });
            } else {
                this.$message({
                    type: 'success',
                    message: '查询成功',
                    durarion: 1000,
                });
            }
            this.listLoading = false;
        },
        //删除
        handleDelete(row, index) {
            console.log(row)
            deleteDispatch(row.id).then((res) => {
                this.total--
                this.$message({
                    type: 'success',
                    message: res.msg,
                    durarion: 1000,
                });
                this.list.splice(index, 1)
            })
        },
        // 编辑
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
                    editDispatch(tempData).then((res) => {
                        const index = this.list.findIndex(v => v.id === this.temp.id)
                        this.list.splice(index, 1, this.temp)
                        this.dialogFormVisible = false
                        this.$message({
                            type: 'success',
                            message: res.msg,
                            durarion: 1000,
                        });
                    })
                }
            })
        },
    }
}
</script>
