<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="供应商名称"
        style="width: 200px; margin-right: 5px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.address"
        placeholder="地址"
        style="width: 200px; margin-right: 5px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
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
        新增
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
      <el-table-column label="供应商名称" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人" width="200" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.contactPerson }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开户行" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.bankAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.comment }}</span>
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
        label="Actions"
        align="center"
        min-width="390"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            type="primary"
            plain
            @click="handleOperateOrder(row, $event)"
          >
            编辑
          </el-button>
          <el-button type="primary" plain @click="handleCancel(row)">
            删除
          </el-button>
          <el-button @click="handleInfo(row, $event)">详情</el-button>
          <el-button
            type="primary"
            plain
            @click="handleOperateOrder(row, $event)"
          >
            查看商品
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

    <!-- 供应商信息 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="85%">
      <el-form
        ref="supForm"
        :rules="rules"
        :model="temp"
        label-width="100px"
        label-position="left"
        style="min-width: 300px; margin-left:50px;"
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
          <el-date-picker v-model="temp.createTime" type="datetime" />
        </el-form-item>
        <el-form-item label="修改日期" prop="contactPerson">
          <el-date-picker v-model="temp.updateTime" type="datetime" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="temp.remarks"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> Cancel </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <!-- 商品列表 -->
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
    </el-dialog>

    <!-- 商品表单 -->
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
    </el-dialog>
  </div>
</template>

<script>
import { createSup,getSupList } from "@/api/supplier";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "OrderList",
  components: { Pagination },
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
        // status: undefined,
        // orderType:undefined,

        // importance: undefined,
        // title: undefined,
        // type: undefined,
        // sort: '+id'
      },

      textMap: {
        update: "编辑",
        create: "新增",
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

      product: [],

      dialogFormVisible: false,

      dialogPvVisible: false,

      dialogStatus:'',
      pvData: [],
      rules: {
        
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      // 加载列表
      getSupList(this.listQuery).then((response) => {
        this.list = response.data.records;
        this.total = response.data.total;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },

    resetTemp(){
        this.temp=this.$options.data().temp;
    },

    // 添加
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["supForm"].clearValidate();
      });
    },
    createData() {
      this.$refs['supForm'].validate((valid) => {
        if (valid) {
          this.temp.createTime=new Date()
          this.temp.updateTime=new Date()
          createSup(this.temp).then((res) => {
            this.temp.id=res.data    //设置供应商id
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },

    //   // 删除
    //   handleDelete(row){
    //     DeleteSupplier(row.id).then(() => {
    //       this.$notify({
    //         title: "",
    //         message: "撤销成功",
    //         type: "success",
    //         duration: 2000,
    //       });
    //     });
    //     this.getList();
    //   },

    //   // 退订 退货 换货
    //   handleOperateOrder(row,e) {
    //     let op=e.target.innerText
    //     this.$cache.local.setJSON('operateOrder',row)
    //     this.$router.push({ path: "/cc/order/operateOrder", query: { orderId: row.id, opType:op} });
    //     // this.$router.push({ path: "/cc/order/operateOrder", query: { orderId: 1, opType:op} });
    //   },

    // 查询
    handleFilter($event) {
      console.log("事件", $event);
      this.getList();
    },

    // 查看商品
    handleInfo(row) {
      getOrder(row.id).then((res) => {
        temp = res.data;
      });
      this.dialogFormVisible = true;
    },

    AddProduct() {
      temp.products.push(product);
      product=[]
    },
  },
};
</script>
