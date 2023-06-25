<template>
  <div class="app-container">
    <el-card style="height: 80px">
      <div class="filter-container">
        <el-input v-model="listQuery.name" placeholder="客户名称" style="width: 200px; margin-right: 5px" class="filter-item"/>
        <el-input v-model="listQuery.telephone" placeholder="联系电话" style="width: 200px; margin-right: 5px"
          class="filter-item"/>
        <el-input v-model="listQuery.identityCard" placeholder="身份证号" style="width: 200px; margin-right: 5px"
          class="filter-item"/>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          查询
        </el-button>
        <el-button type="primary" class="filter-item" style="margin-left: 5px" icon="el-icon-refresh"
          @click="reset">重置</el-button>
      </div>
    </el-card>

    <el-card style="margin: 10px 0">
      <div style="margin-bottom: 5px">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">新增</el-button>
        <el-button type="primary" icon="el-icon-refresh-right" @click="refresh">刷新</el-button>
      </div>
      <el-table :key="0" :row-key="(row) => row.id" :data="list" ref="table" border fit highlight-current-row
        style="width: 100%">
        <el-table-column label="客户编号" prop="id" align="center" width="100">
        </el-table-column>
        <el-table-column label="客户名称" prop="name" width="100" align="center">
        </el-table-column>
        <el-table-column label="身份证号" prop="identityCard" width="200" align="center">
        </el-table-column>
        <el-table-column label="收货地址" prop="address" width="100" align="center">
        </el-table-column>
        <el-table-column label="联系电话" prop="telephone" width="120" align="center">
        </el-table-column>
        <el-table-column label="工作单位" prop="organization" width="100" align="center">
        </el-table-column>
        <el-table-column label="邮政编码" prop="postcode" width="100" align="center">
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
        <el-table-column label="操作" align="center" min-width="400" class-name="small-padding fixed-width" fixed="right">
          <template slot-scope="{ row, $index }">
            <el-button type="primary" icon="el-icon-edit" @click="handleEdit(row)"></el-button>
            <el-button type="primary" icon="el-icon-delete" @click="handleDelete(row)"></el-button>
            <el-button type="success" plain @click="handleOrderOp(row, '新建')">
              创建订单
            </el-button>
            <el-button type="success" plain @click="handleOrderOp(row, '查看')">
              查看订单
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
        @pagination="getList" />
    </el-card>

    <!--新增或编辑客户信息-->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <editCustomer v-if="dialogFormVisible" :originCustomer="editCustomer" :title="title" @hideUpdateView="hideUpdateView">
      </editCustomer>
    </el-dialog>
  </div>
</template>

<script>
import { getCustomerList, deleteCustomer, getCustomer } from "@/api/cc-customer";
import editCustomer from "./updateView.vue";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "CustomertList",
  components: { Pagination, editCustomer },
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
        name: "",
        telephone: "",
        identityCard: "",
      },

      // 编辑客户信息
      editCustomer: {
        id: "",
        name: "",
        identityCard: "",
        address: "",
        telephone: "",
        organization: "",
        postcode: "",
      },

      dialogFormVisible: false, //对话框是否可见
      selectedCustomer: undefined, //当前选中的客户
      title: "", //对话框标题
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

    // 查询
    handleFilter() {
      this.getList();
    },

    // 重置查询条件
    reset() {
      this.listQuery.name = ""
      this.listQuery.telephone = ""
      this.listQuery.identityCard = ""
    },

    //重新加载表格数据
    refresh() {
      this.getList()
    },

    handleCreate() {
      this.title = "新增客户"
      this.editCustomer = this.$options.data().editCustomer;
      this.dialogFormVisible = true
    },

    handleEdit(row) {
      this.title = "编辑客户"
      this.editCustomer=JSON.parse(JSON.stringify(row)),
      this.dialogFormVisible = true
    },

    hideUpdateView() {
      this.dialogFormVisible = false
      this.getList()
    },

    handleDelete(row) {
      deleteCustomer(row.id).then(res => {
        this.getList()
        this.$message({
          message: res.msg,
          type: 'success',
          duration:1000,
        })
      })
    },

    handleOrderOp(rowOb, op) {
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
      if (op === "新建") {
        // 新建订单
        this.$router.push({ path: "/cc/order/newOrder" });
      } else {
        // 查看订单
        this.$router.push({ path: "/cc/order", query: { id: this.selectedCustomer.customerId } });
      }
    },
  },
};
</script>
