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

    <!-- 商品列表
    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table
        :key="0"
        :row-key="(row) => row.productId"
        :data="temp.products"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="商品名称" width="100" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.productName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品大类" min-width="100" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.productCategary }}</span>
          </template>
        </el-table-column>
        <el-table-column label="一级分类ID" min-width="100" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.firstCategray }}</span>
          </template>
        </el-table-column>
        <el-table-column label="二级分类ID" min-width="100" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.secondCategray }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单价" width="100" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成本" width="100" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.cost }}</span>
          </template>
        </el-table-column>
        <el-table-column label="能否退货" class-name="status-col" width="100">
          <template slot-scope="{ row }">
            <el-tag :type="row.refundAble ? 'success' : 'danger'">
              {{ row.refundAble ? "可退货" : "不可退货" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="能否换货" class-name="status-col" width="100">
          <template slot-scope="{ row }">
            <el-tag :type="row.changeAble ? 'success' : 'danger'">
              {{ row.changeAble ? "可换货" : "不可换货" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="100" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.comment }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成本" width="100" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.cost }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图片" width="100" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.picture }}</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false"
          >Confirm</el-button
        >
      </span>
    </el-dialog> -->

    <!-- 商品表单
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="proForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="temp.address" />
        </el-form-item>
        <el-form-item label="联系人" prop="contactPerson">
          <el-input v-model="temp.contactPerson" />
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPerson">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="开户行" prop="contactPerson">
          <el-input v-model="temp.bankAccount" />
        </el-form-item>
        <el-form-item label="创建日期" prop="contactPerson">
          <el-input v-model="temp.createTime" />
        </el-form-item>
        <el-form-item label="修改日期" prop="contactPerson">
          <el-input v-model="temp.updateTime" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="temp.remarks"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> Cancel </el-button>
        <el-button type="primary" @click="AddProduct()"> Confirm </el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { getSupList, querySupList, deleteSup } from "@/api/supplier";
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
