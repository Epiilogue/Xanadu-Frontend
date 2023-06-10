<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="客户名称" style="width: 200px; margin-right: 5px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.telephone" placeholder="联系电话" style="width: 200px; margin-right: 5px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.identityCard" placeholder="身份证号" style="width: 200px; margin-right: 5px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
        icon="el-icon-circle-plus-outline"
        @click="handleCreate"
      >
        新增
      </el-button>
    </div>
    <el-table
      :key="0"
      :row-key="(row) => row.id"
      :data="list"
      ref="table"
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
      <el-table-column label="客户名称" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证号" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.identityCard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收货地址" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.telephone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工作单位" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.organization }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮政编码" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.postcode }}</span>
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
      <el-table-column label="更新日期" width="200" align="center">
        <template slot-scope="{ row }">
          <i class="el-icon-time"></i>
          <span>{{
            $moment(new Date(row.updateTime)).format("YYYY-MM-DD HH:mm:ss")
          }}</span>
        </template>
      </el-table-column>
      <!-- 按钮 -->
      <el-table-column
        label="操作"
        align="center"
        min-width="400"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" icon="el-icon-edit" @click="handleEdit(row)"></el-button>
          <el-button type="primary" icon="el-icon-delete" @click="handleDelete(row)"></el-button>
          <el-button type="success"  plain @click="handleOrderOp(row,'新建')">
            创建订单
          </el-button>
          <el-button type="success" plain @click="handleOrderOp(row,'查看')">
            查看订单
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getCustomerList } from "@/api/customer";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "CustomertList",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      // 表格信息
      list: [],
      total: 0,
      listLoading: true,
      tableKey: 0,

      // 查询条件
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        name:"",
        telephone:"",
        identityCard:"",
      },

      selectedCustomer: undefined, //当前选中的客户
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 分页加载客户
    getList() {
      this.listLoading = true;
      // 加载客户列表
      getCustomerList(this.listQuery).then((res) => {
        let list = res.data.records;
        // 设置表格信息
        this.list = list;
        this.total = res.data.total;
      });
    },

    handleFilter() {
      this.getList()
    },

    handleCreate() {},

    handleEdit() {},

    handleDelete() {},

    handleOrderOp(rowOb,op) {
      // 修改客户属性名
      let row = [];
      row.push(rowOb);
      this.selectedCustomer = row.map(function (g) {
        return {
          customerId: g.id,
          receiverName: g.name,
          telephone: g.telephone,
          deliveryAddress: g.address,
        };
      })[0];
      // 保存客户信息
      this.$store.commit("SET_CUSCHANGED", this.selectedCustomer);
      if(op==='新建'){
        // 新建订单
        this.$router.push({ path: "/cc/order/newOrder" });
      }else{
        // 查看订单
        this.$router.push({ path: "/cc/order", query: { customerId: row.id } });
      }
    },
  },
};
</script>
