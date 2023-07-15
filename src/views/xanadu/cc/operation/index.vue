<template>
  <div class="app-container">
    <el-card style="height: 80px">
      <div class="filter-container">
        <el-form :inline="true" style="margin: 0px;">
          <el-form-item label="操作员编号">
            <el-input v-model="listQuery.userId" placeholder="操作员编号" style="width: 200px; margin-right: 5px"
                      class="filter-item"
            />
          </el-form-item>
          <el-form-item label="录入时间">
            <el-date-picker v-model="CreateRange" type="daterange" align="right" style="width: 240px"
                            value-format="yyyy-MM-dd HH:mm:ss" unlink-panels range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              查询操作记录
            </el-button>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search"
                       @click="handleFilterWork"
            >
              查询工作量
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-tabs :tab-position="tabPosition" v-model="activeName" style="height: 100%;">
      <el-tab-pane label="操作记录" name="operation">
        <!-- 操作记录表格 -->
        <el-card style="margin: 10px 0" v-if="activeName==='operation'">
          <div style="margin-bottom: 5px">
            <el-button type="primary" icon="el-icon-refresh-right" @click="refresh">刷新</el-button>
          </div>
          <el-table :key="0" :row-key="(row) => row.id" :data="list" ref="table" border fit highlight-current-row
                    style="width: 100%" v-loading="listLoading"
          >
            <el-table-column label="记录编号" prop="id" align="center" width="100">
            </el-table-column>

            <el-table-column label="操作员编号" min-width="100" align="center">
              <template slot-scope="{ row }">
                <user :id="row.userId"/>
              </template>
            </el-table-column>

            <el-table-column label="客户编号" min-width="100" align="center">
              <template slot-scope="{ row }">
                <customer :id="row.customerId"/>
              </template>
            </el-table-column>

            <el-table-column label="订单编号" min-width="100" align="center">
              <template slot-scope="{ row }">
                <order :id="row.orderId" :orderType="row.operatorType"/>
              </template>
            </el-table-column>

            <el-table-column label="操作类型" prop="operatorType" width="100" align="center">
            </el-table-column>
            <el-table-column label="商品总数" prop="numbers" width="100" align="center">
            </el-table-column>
            <el-table-column label="交易金额" prop="totalAmount" width="100" align="center">
            </el-table-column>
            <el-table-column label="录入时间" min-width="200" align="center">
              <template slot-scope="{ row }">
                <i class="el-icon-time"></i>
                <span>{{
                    $moment(new Date(row.createTime)).format('YYYY-MM-DD HH:mm:ss')
                  }}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageNum"
                      :limit.sync="listQuery.pageSize" @pagination="getList('')"
          />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="工作量" name="work">
        <!-- 工作量表格 -->
        <WorkList :list="workList" :total="workList.length" v-if="activeName!=='operation'"></WorkList>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import { getOperation, getWork } from '@/api/cc-operation'
import WorkList from './Work.vue'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'OperationList',
  components: { Pagination, WorkList },
  directives: { waves },
  created() {
    this.getList() //操作记录查询
    // this.getWorkList(); //工作量查询
  },
  data() {
    return {
      list: [],
      total: 0,

      workList: [],
      workTotal: 0,

      listQuery: {
        pageNum: 1,
        pageSize: 20,
        userId: 1 //操作员ID
      },

      listLoading: false,

      // 日期范围选择
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      CreateRange: [],

      // 标签页
      tabPosition: 'left', //标签位置
      activeName: 'operation' // 当前标签页
    }
  },
  methods: {
    // 分页加载操作记录
    getList(op, $event) {
      //将起止日期添加到请求参数中
      let query = this.addDateRange(this.listQuery, this.CreateRange)
      query.startTime = query.params.beginTime
      query.endTime = query.params.endTime
      query.params = undefined
      this.listLoading = true
      // 请求
      getOperation(this.listQuery).then((res) => {
        // 设置表格信息
        this.list = res.data.records
        this.total = res.data.total
        this.listLoading = false
        if (!op) {
          return
        } else if (this.total === 0) {
          this.$message({
            message: `未找到符合条件的记录`,
            type: 'error',
            duration: 1000
          })
        } else {
          this.$message({
            message: `${op}成功`,
            type: 'success',
            duration: 1000
          })
        }
      }).catch(() => this.listLoading = false)
    },

    // 查询操作员工作量(未分页)
    getWorkList(show) {
      //检查输入
      if (!this.CreateRange || this.CreateRange.length === 0) {
        this.$message({
          message: '请选择要查询的时间段',
          type: 'error',
          duration: 1000
        })
        return
      } else if (!this.listQuery.userId) {
        this.$message({
          message: '请填写要查询的操作员编号',
          type: 'error',
          duration: 1000
        })
        return
      }
      //将起止日期添加到请求参数中
      let query = this.addDateRange(this.listQuery, this.CreateRange)
      query.startTime = query.params.beginTime
      query.endTime = query.params.endTime
      query.params = undefined
      this.listLoading = true
      // 请求
      getWork(this.listQuery).then((res) => {
        if (res.data.length === 0) {
          this.$message({
            message: '未找到符合条件的记录',
            type: 'error',
            duration: 1000
          })
          return
        }
        // 设置表格信息
        this.workList = res.data
        this.workTotal = res.data.length
        this.listLoading = false
        this.$message({
          message: '查询成功',
          type: 'success',
          duration: 1000
        })
      }).catch(() => this.listLoading = false)
    },

    //表格刷新
    refresh() {
      this.getList('刷新')
    },

    // 查询
    handleFilter() {
      this.getList('查询')
      this.activeName = 'operation'
    },

    handleFilterWork() {
      this.getWorkList(true)
      this.activeName = 'work'
    }
  }
}
</script>
