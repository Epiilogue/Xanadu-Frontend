<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="供应商名称" style="width: 200px; margin-right: 5px" class="filter-item"
        @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.address" placeholder="地址" style="width: 200px; margin-right: 5px" class="filter-item"
        @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 5px" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>

    <el-table :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%" v-loading="listLoading">
      <el-table-column label="ID" prop="id" align="center" width="100">
      </el-table-column>
      <el-table-column label="供应商名称" prop="name" width="100" align="center">
      </el-table-column>
      <el-table-column label="地址" prop="address" width="100" align="center">
      </el-table-column>
      <el-table-column label="联系人" prop="contactPerson" width="200" align="center">
      </el-table-column>
      <el-table-column label="联系电话" prop="phone" width="100" align="center">
      </el-table-column>
      <el-table-column label="开户行" prop="bankAccount" width="100" align="center">
      </el-table-column>
      <el-table-column label="备注" prop="comment" width="100" align="center">
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
      <el-table-column label="Actions" align="center" min-width="390" class-name="small-padding fixed-width"
        fixed="right">
        <template slot-scope="{ row, $index }">
          <el-button type="primary" plain @click="handleEdit(row, $event)">
            编辑
          </el-button>
          <el-button type="primary" plain @click="handleDelete(row)">
            删除
          </el-button>
          <!-- <el-button
            type="primary"
            plain
            @click="handleOperateOrder(row, $event)"
          >
            查看商品
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
      @pagination="getList" />

    <!-- 供应商信息 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <editSupplier v-if="dialogFormVisible" :originSup="temp" :title="dialogStatus" @hideUpdateView="hideUpdateView">
      </editSupplier>
    </el-dialog>
  </div>
</template>

<script>
import { getSupList, querySupList, deleteSup } from "@/api/dbc-supplier";
import editSupplier from "./editSupplier.vue";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "SupplierList",
  components: { Pagination, editSupplier },
  directives: { waves },
  data() {
    return {
      tableKey: 0,

      list: [],
      total: 0,

      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        name: "",
        address: "",
      },

      textMap: {
        update: "编辑供应商",
        create: "新增供应商",
      },

      // dialog
      temp: {
        id: undefined,
        name: "",
        address: "",
        contactPerson: "",
        phone: "",
        bankAccount: "",
        remarks: "",
        createTime: "",
        updateTime: "",
        products: [],
      },

      dialogFormVisible: false,

      dialogStatus: '',
      rules: {},
    };
  },
  created() {
    this.getList(false);
  },
  methods: {
    // 查询全部
    getList(show) {
      let fun = getSupList
      if (this.listQuery.name || this.listQuery.address) {
        fun = querySupList
      }
      this.listLoading = true;
      // 加载列表
      fun(this.listQuery).then((response) => {
        this.list = response.data.records;
        this.total = response.data.total;
        if(show){
          this.$message({
          type: 'success',
          message: '查询成功',
          durarion: 1000,
        });
        }
        this.listLoading = false;
      }).catch(this.listLoading = false);
    },

    handleCreate() {
      this.dialogStatus = "create";
      this.temp = this.$options.data().temp;
      this.dialogFormVisible = true
    },

    handleEdit(row) {
      this.dialogStatus = "edit";
      this.temp = JSON.parse(JSON.stringify(row)),
        this.dialogFormVisible = true
    },

    hideUpdateView() {
      this.dialogFormVisible = false
      this.getList(false)
    },

    // 删除
    handleDelete(row) {
      deleteSup(row.id).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功',
          durarion: 1000,
        });
      });
      this.getList(false);
    },

    // 查询
    handleFilter() {
      this.getList(true);
    },
  },
};
</script>
