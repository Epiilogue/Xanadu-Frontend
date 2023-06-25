<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" style="margin: 0px;">
        <el-form-item label="录入时间">
          <el-date-picker
            v-model="CreateRange"
            type="daterange"
            align="right"
            style="width: 240px"
            value-format="yyyy-MM-dd HH:mm:ss"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="客户姓名">
          <el-input v-model="listQuery.customerName" placeholder="客户姓名" style="width: 200px; margin-right: 5px"
            class="filter-item"/></el-form-item>
        <el-form-item label="订单类型"><el-select v-model="listQuery.orderType" placeholder="订单类型"
            style="width: 200px; margin-right: 5px" class="filter-item">
            <el-option v-for="item in orderTypeOption" :key="item" :label="item" :value="item" />
          </el-select></el-form-item>
        <el-form-item><el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="()=>this.getList()">
            查询
          </el-button>
          <el-button class="filter-item" style="margin-left: 5px" type="primary" icon="el-icon-edit"
            @click="handleCreate">
            新订
          </el-button></el-form-item>
      </el-form>

    </div>

    <el-table :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label="订单编号" prop="id" align="center" width="100">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作员编号" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户编号" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.customerId }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="订单类型" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.orderType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品数量" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.numbers }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品总价" width="120" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.totalAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" width="200" align="center">
        <template slot-scope="{ row }">
          <i class="el-icon-time"></i>
          <span>{{
            $moment(new Date(row.createTime)).format("YYYY-MM-DD HH:mm:ss")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="要求完成日期" width="200" align="center">
        <template slot-scope="{ row }">
          <i class="el-icon-time"></i>
          <span>{{
            $moment(new Date(row.deadline)).format("YYYY-MM-DD HH:mm:ss")
          }}</span>
        </template>
      </el-table-column>
      <!-- 按钮 -->
      <el-table-column label="Actions" align="center" min-width="350" class-name="small-padding fixed-width"
        fixed="right">
        <template slot-scope="{ row, $index }">
            <el-button v-if="stateOne(row)" type="primary" plain @click="handleOperateOrder(row, $event)">
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
            </el-button>
          <el-button @click="handleInfo(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
      @pagination="getList" />

    <OrderInfo title="订单详情" :temp="this.temp" :products="this.temp.products" :newOrder="this.newOrder"
      :dialogFormVisible="this.dialogFormVisible" @close="close()"></OrderInfo>
  </div>
</template>

<script>

import { fetchList, withdrawOrder, getOrder } from "@/api/cc-order";
import OrderInfo from "./OrderInfo.vue";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "OrderList",
  components: { Pagination, OrderInfo },
  directives: { waves },
  data() {
    return {
      tableKey: 0,

      list: null,
      total: 0,

      listLoading: true,
      customerId: undefined,
      listQuery: {
        page: 1,
        limit: 20,
        customerId: null,
        customerName: "",
        createTime:undefined,
        orderType: "",
      },

      CreateRange:[],

      textMap: {
        update: "Edit",
        create: "Create",
      },
      orderTypeOption: ["新订", "退订", "退货", "换货"],

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

      // dialog
      temp: {
        id: undefined,
        telephone: 1,
        deliveryTime: "",
        comment: new Date(),
        invoiceNeed: "",
        substationId: "",
        receiverName: "",
        deliveryAddress: "",
        products: [],
      },
      newOrder: false,

      dialogFormVisible: false,
    };
  },
  created() {
    // 客户ID
    this.listQuery.customerId = this.$route.query.id;
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      //将起止日期添加到请求参数中
      let query = this.addDateRange(this.listQuery,this.CreateRange);
      query.beginTime=query.params.beginTime
      query.endTime=query.params.endTime
      query.params=undefined
      // 加载列表
      fetchList(query).then((response) => {
        this.list = response.data.records;
        this.total = response.data.total;
      })
    },

    // 设置是否显示操作按钮
    stateOne(row) {
      if (row.status !== "缺货" && row.status !== "可分配") {
        return false;
      }
      return true;
    },
    stateTwo(row) {
      if (row.status !== "已完成") {
        return false;
      }
      return true
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
          duration:1000,
        });
      });
    },

    // 退订 退货 换货
    handleOperateOrder(row, e) {
      let op = e.target.innerText;
      this.$cache.local.remove("selectedProduct");
      this.$cache.local.setJSON("operateOrder", row);
      this.$router.push({
        path: "/cc/order/operateOrder",
        query: { orderId: row.id, opType: op },
      });
    },

    // 查询
    handleFilter($event) {
      this.getList()
    },

    // 订单详情
    handleInfo(row) {
      row.orderId = row.id;
      getOrder(row).then((res) => {
        this.newOrder = row.orderType === "新订";
        this.temp = res.order;
        this.temp.products = res.productList;
        this.dialogFormVisible = true;
      });
    },

    // 关闭订单详情页
    close() {
      this.temp = [];
      this.dialogFormVisible = false;
    },
  }
}
</script>