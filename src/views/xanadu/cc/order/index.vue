<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="listQuery.customerName"
        type="date"
        placeholder="录入时间"
        style="width: 200px; margin-right: 5px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.customerName"
        placeholder="客户姓名"
        style="width: 200px; margin-right: 5px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.orderType"
        placeholder="订单类型"
        style="width: 200px; margin-right: 5px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in orderTypeOption"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 5px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新订
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="ID" prop="id" align="center" width="100">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作员ID" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户ID" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.customerId }}</span>
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
      <!-- 按钮 -->
      <el-table-column
        label="Actions"
        align="center"
        min-width="390"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="{ row, $index }">
          <div :style="stateOne(row)">
            <el-button
              type="primary"
              plain
              @click="handleOperateOrder(row, $event)"
            >
              退订
            </el-button>
            <el-button type="primary" plain @click="handleCancel(row)">
              撤销
            </el-button>
            <el-button @click="handleInfo(row, $event)">详情</el-button>
          </div>
          <div :style="stateTwo(row)">
            <el-button
              type="danger"
              plain
              @click="handleOperateOrder(row, $event)"
            >
              退货
            </el-button>
            <el-button
              type="danger"
              plain
              @click="handleOperateOrder(row, $event)"
            >
              换货
            </el-button>
            <el-button @click="handleInfo(row)">详情</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <OrderInfo
      title="订单详情"
      :temp="this.temp"
      :products="this.temp.products"
      :newOrder="this.newOrder"
      :dialogFormVisible="this.dialogFormVisible"
      @close="close()"
    ></OrderInfo>
  </div>
</template>

<script>
import { fetchList, withdrawOrder, getOrder } from "@/api/order";
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
      },

      textMap: {
        update: "Edit",
        create: "Create",
      },
      downloadLoading: false,
      orderTypeOption: ["新订", "退订", "退货", "撤销", "换货"],

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
    // this.listQuery.customerId = 1;
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      // 加载列表
      fetchList(this.listQuery).then((response) => {
        this.list = response.data;
        this.total = response.data.length;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },

    // 设置是否显示操作按钮
    stateOne(row) {
      if (row.status !== "缺货" && row.status !== "可分配") {
        return { display: "none" };
      }
    },
    stateTwo(row) {
      if (row.status !== "已完成") {
        return { display: "none" };
      }
    },

    // 新订
    handleCreate() {
      this.$router.push({ path: "/cc/order/newOrder" });
    },

    // 撤销
    handleCancel(row) {
      withdrawOrder(row.id).then(() => {
        this.getList();
        this.$notify({
          title: "",
          message: "撤销成功",
          type: "success",
          duration: 2000,
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
      this.getList();
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
  },
};
</script>
