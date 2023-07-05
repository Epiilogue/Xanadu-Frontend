<template>
  <div class="app-container">
    <!-- 提示当前订单操作 -->
    <div class="alert">
      <p v-if="opType !== ''">正在进行的订单操作是</p>
      <p v-else>正在查看所有订单</p>
      <el-select v-model="opType" class="select" placeholder="选择订单操作" @change="handleOpChange" clearable
        @clear="handleOpChange">
        <el-option v-for="item in opTypeOption" :key="item" :label="item" :value="item" />
      </el-select>
    </div>
    <el-card>
      <!-- 订单查询 -->
      <div class="filter-container">
        <el-form :inline="true" style="margin: 0px;">
          <el-form-item label="录入时间">
            <el-date-picker v-model="createRange" type="daterange" align="right" style="width: 240px"
              value-format="yyyy-MM-dd HH:mm:ss" unlink-panels range-separator="-" start-placeholder="开始日期"
              end-placeholder="结束日期" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="订单类型"><el-select v-model="listQuery.orderType" placeholder="订单类型"
              style="width: 200px; margin-right: 5px" class="filter-item" clearable>
              <el-option v-for="item in orderTypeOption" :key="item" :label="item" :value="item" />
            </el-select></el-form-item>
          <el-form-item><el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              查询
            </el-button>
            <el-button class="filter-item" style="margin-left: 5px" type="primary" icon="el-icon-edit"
              @click="handleCreate">
              新订
            </el-button></el-form-item>
        </el-form>
      </div>

      <el-table :key="tableKey" :data="queryList.slice((currentPage - 1) * pageSize, currentPage * pageSize)" border fit
        highlight-current-row style="width: 100%" v-loading="listLoading">
        <!-- 点击查看订单详情 -->
        <el-table-column label="订单编号" prop="id" align="center" width="100">
          <template slot-scope="{ row }">
            <Order :id="row.id" :orderType="row.orderType"></Order>
          </template>
        </el-table-column>
        <!-- 一般表格列 -->
        <el-table-column v-for="column in tableColumns" :prop="column.prop" :label="column.label" v-if="column.show"
          min-width="120" align="center">
        </el-table-column>
        <!-- 日期列 -->
        <el-table-column label="创建日期" min-width="200" align="center">
          <template slot-scope="{ row }">
            <i class="el-icon-time"></i>
            <span>{{
              $moment(new Date(row.createTime)).format("YYYY-MM-DD HH:mm:ss")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="要求完成日期" min-width="200" align="center">
          <template slot-scope="{ row }">
            <i class="el-icon-time"></i>
            <span>{{
              $moment(new Date(row.deadline)).format("YYYY-MM-DD HH:mm:ss")
            }}</span>
          </template>
        </el-table-column>
        <!-- 按钮 -->
        <el-table-column label="Actions" align="center" min-width="130" class-name="small-padding fixed-width"
          fixed="right">
          <template slot-scope="{ row, $index }">
            <!-- <el-button v-if="stateOne(row)" type="primary" plain @click="handleOperateOrder(row, $event)">
            退订
          </el-button>
          <el-button v-if="stateOne(row)" type="primary" plain @click="handleCancel(row)">
            撤销
          </el-button>
          <el-button v-if="stateTwo(row)" type="danger" plain @click="handleOperateOrder(row, $event)">
            退货
          </el-button>
          <el-button v-if="stateTwo(row)" type="danger" plain @click="handleOperateOrder(row, $event)">
            换货
          </el-button> -->
            <el-button type="primary" plain
              @click="opType === '撤销' ? handleCancel(row) : handleOperateOrder(row, $event)">
              订单操作
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="newSize => pageSize = newSize" @current-change="newPage => currentPage = newPage"
        :current-page="1" :page-sizes="[1, 2, 5, 7]" :page-size="5" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>

import { fetchList, withdrawOrder } from "@/api/cc-order";
import waves from "@/directive/waves"; // waves directive

import { getColumn } from '@/components/detail/module/orderColumn'
import Order from '@/components/detail/order.vue'

export default {
  name: "OrderList",
  components: { Order },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      listLoading: true,

      list: [],   //订单列表
      opList: [],  //订单操作列表
      queryList: [], //查询后的列表
      tableColumns: undefined,

      customerId: undefined,
      // 分页
      currentPage: 1,//默认显示第一页
      pageSize: 5,//默认每页显示5条
      total: 0,

      listQuery: {
        createTime: undefined,
        orderType: "",
        orderStatus: '',
      },
      createRange: [],

      orderTypeOption: ["新订", "退订", "退货", "换货"],
      orderStatusOption: ["无效", "可分配", "缺货", "已调度", "中心库房出库", "配送站到货", "已分配", "已领货", "已完成", "失败", "部分完成"],

      // 日期选择的快捷设置
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },

      opType: '',
      opTypeOption: ["退订", "撤销", "退货", "换货"]
    };
  },
  created() {
    // 客户ID
    this.customerId = this.$route.query.id;
    // 表格列
    this.tableColumns = getColumn().order
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      // 加载列表
      fetchList(this.customerId).then((response) => {
        this.list = response.data;
        this.handleOpChange(this.opType, false)
        this.total = response.data.length;
        this.listLoading = false;
      })
    },

    // 加载对应操作的订单列表
    handleOpChange(newVal, show) {
      this.listLoading = true;
      // todo:修改下拉框选项
      switch (newVal) {
        case '退订':
        case '撤销':
          this.opList = this.list.filter(order => order.status === "缺货" || order.status === "可分配")
          break
        case '退货':
        case '换货':
          this.opList = this.list.filter(order => order.status === "已完成")
          break
        default:
          this.opList = this.list
          break
      }
      if (this.opList.length === 0 && show) {
        this.$message({
          type: 'error',
          message: '没有需要操作的任务单',
          durarion: 1000,
        });
      }
      // 查询结果
      this.queryList = this.opList
      this.listLoading = false;
    },

    // 新订
    handleCreate() {
      this.$router.push({ path: "/cc/order/newOrder" });
    },

    // 撤销
    handleCancel(row) {
      withdrawOrder(row.id).then(() => {
        this.getList();
        this.$message({
          message: '撤销成功',
          type: 'success',
          duration: 1000,
        });
      });
    },

    // 退订 退货 换货
    handleOperateOrder(row) {
      if (!this.opType) {
        this.$message({
          type: 'error',
          message: '请先选择要进行的操作',
          durarion: 1000,
        });
        return
      }
      this.$cache.local.remove("selectedProduct");
      this.$cache.local.setJSON("operateOrder", row);
      this.$router.push({
        path: "/cc/order/operateOrder",
        query: { orderId: row.id, opType: this.opType },
      });
    },

    // 查询
    handleFilter() {
      this.listLoading = true;
      this.queryList = this.opList.filter((order) => {
        // 查询条件
        let query = this.listQuery
        // 录入时间 订单类型
        let range = this.createRange
        if (range !== null && (new Date(order.createTime) < new Date(range[0]) || new Date(order.createTime) > new Date(range[1]))) {
          return false
        }
        if (query.orderType !== '' && order.orderType !== query.orderType) {
          return false
        }
        return true
      });
      this.listLoading = false;
      if (this.queryList.length === 0) {
        this.$message({
          type: 'error',
          message: '没有符合条件的订单',
          durarion: 1000,
        });
      } else {
        this.$message({
          type: 'success',
          message: '查询成功',
          durarion: 1000,
        });
      }
    },
  }
}
</script>

<style scoped>
.alert {
  display: flex;
  padding: 10px 16px;
  background-color: #ecf8ff;
  border-radius: 4px;
  border-left: 5px solid #50bfff;
  margin-bottom: 20px;
}

.alert p {
  font-size: 14px;
  color: #5e6d82;
  line-height: 1.5em;
}

.select {
  margin-left: 10px;
  margin-top: 6.5px;
}
</style>