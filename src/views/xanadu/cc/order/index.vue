<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户ID" prop="customerId">
        <el-input
          v-model="queryParams.customerId"
          placeholder="请输入客户ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电话号码" prop="telephone">
        <el-input
          v-model="queryParams.telephone"
          placeholder="请输入电话号码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备注信息" prop="comment">
        <el-input
          v-model="queryParams.comment"
          placeholder="请输入备注信息"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="预计送货日期" prop="deliveryTime">
        <el-date-picker clearable
          v-model="queryParams.deliveryTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择预计送货日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="是否要发票" prop="invoiceNeed">
        <el-input
          v-model="queryParams.invoiceNeed"
          placeholder="请输入是否要发票"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="送货地址" prop="deliveryAddress">
        <el-input
          v-model="queryParams.deliveryAddress"
          placeholder="请输入送货地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="接收人姓名" prop="receiverName">
        <el-input
          v-model="queryParams.receiverName"
          placeholder="请输入接收人姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品大类" prop="productCategray">
        <el-input
          v-model="queryParams.productCategray"
          placeholder="请输入商品大类"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品ID" prop="productId">
        <el-input
          v-model="queryParams.productId"
          placeholder="请输入商品ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="购买商品数量" prop="productNumbers">
        <el-input
          v-model="queryParams.productNumbers"
          placeholder="请输入购买商品数量"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入商品名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品单价" prop="singleAmount">
        <el-input
          v-model="queryParams.singleAmount"
          placeholder="请输入商品单价"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="支付总价" prop="totalAmount">
        <el-input
          v-model="queryParams.totalAmount"
          placeholder="请输入支付总价"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分站ID" prop="substationId">
        <el-input
          v-model="queryParams.substationId"
          placeholder="请输入分站ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否删除" prop="deleted">
        <el-input
          v-model="queryParams.deleted"
          placeholder="请输入是否删除"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['xanadu:order:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['xanadu:order:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['xanadu:order:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xanadu:order:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="center" prop="id" />
      <el-table-column label="订单状态" align="center" prop="status" />
      <el-table-column label="客户ID" align="center" prop="customerId" />
      <el-table-column label="电话号码" align="center" prop="telephone" />
      <el-table-column label="备注信息" align="center" prop="comment" />
      <el-table-column label="预计送货日期" align="center" prop="deliveryTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.deliveryTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否要发票" align="center" prop="invoiceNeed" />
      <el-table-column label="送货地址" align="center" prop="deliveryAddress" />
      <el-table-column label="接收人姓名" align="center" prop="receiverName" />
      <el-table-column label="商品大类" align="center" prop="productCategray" />
      <el-table-column label="商品ID" align="center" prop="productId" />
      <el-table-column label="购买商品数量" align="center" prop="productNumbers" />
      <el-table-column label="商品名称" align="center" prop="productName" />
      <el-table-column label="商品单价" align="center" prop="singleAmount" />
      <el-table-column label="支付总价" align="center" prop="totalAmount" />
      <el-table-column label="分站ID" align="center" prop="substationId" />
      <el-table-column label="是否删除" align="center" prop="deleted" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xanadu:order:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xanadu:order:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户ID" prop="customerId">
          <el-input v-model="form.customerId" placeholder="请输入客户ID" />
        </el-form-item>
        <el-form-item label="电话号码" prop="telephone">
          <el-input v-model="form.telephone" placeholder="请输入电话号码" />
        </el-form-item>
        <el-form-item label="备注信息" prop="comment">
          <el-input v-model="form.comment" placeholder="请输入备注信息" />
        </el-form-item>
        <el-form-item label="预计送货日期" prop="deliveryTime">
          <el-date-picker clearable
            v-model="form.deliveryTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择预计送货日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否要发票" prop="invoiceNeed">
          <el-input v-model="form.invoiceNeed" placeholder="请输入是否要发票" />
        </el-form-item>
        <el-form-item label="送货地址" prop="deliveryAddress">
          <el-input v-model="form.deliveryAddress" placeholder="请输入送货地址" />
        </el-form-item>
        <el-form-item label="接收人姓名" prop="receiverName">
          <el-input v-model="form.receiverName" placeholder="请输入接收人姓名" />
        </el-form-item>
        <el-form-item label="商品大类" prop="productCategray">
          <el-input v-model="form.productCategray" placeholder="请输入商品大类" />
        </el-form-item>
        <el-form-item label="商品ID" prop="productId">
          <el-input v-model="form.productId" placeholder="请输入商品ID" />
        </el-form-item>
        <el-form-item label="购买商品数量" prop="productNumbers">
          <el-input v-model="form.productNumbers" placeholder="请输入购买商品数量" />
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品单价" prop="singleAmount">
          <el-input v-model="form.singleAmount" placeholder="请输入商品单价" />
        </el-form-item>
        <el-form-item label="支付总价" prop="totalAmount">
          <el-input v-model="form.totalAmount" placeholder="请输入支付总价" />
        </el-form-item>
        <el-form-item label="分站ID" prop="substationId">
          <el-input v-model="form.substationId" placeholder="请输入分站ID" />
        </el-form-item>
        <el-form-item label="是否删除" prop="deleted">
          <el-input v-model="form.deleted" placeholder="请输入是否删除" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listOrder, getOrder, delOrder, addOrder, updateOrder } from "@/api/xanadu/order";

export default {
  name: "Order",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 【请填写功能名称】表格数据
      orderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        status: null,
        customerId: null,
        telephone: null,
        comment: null,
        deliveryTime: null,
        invoiceNeed: null,
        deliveryAddress: null,
        receiverName: null,
        productCategray: null,
        productId: null,
        productNumbers: null,
        productName: null,
        singleAmount: null,
        totalAmount: null,
        substationId: null,
        deleted: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        status: [
          { required: true, message: "订单状态不能为空", trigger: "change" }
        ],
        customerId: [
          { required: true, message: "客户ID不能为空", trigger: "blur" }
        ],
        productId: [
          { required: true, message: "商品ID不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      listOrder(this.queryParams).then(response => {
        this.orderList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        status: null,
        customerId: null,
        createTime: null,
        updateTime: null,
        createBy: null,
        telephone: null,
        comment: null,
        deliveryTime: null,
        invoiceNeed: null,
        deliveryAddress: null,
        receiverName: null,
        productCategray: null,
        productId: null,
        productNumbers: null,
        productName: null,
        singleAmount: null,
        totalAmount: null,
        substationId: null,
        deleted: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加【请填写功能名称】";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOrder(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改【请填写功能名称】";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOrder(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOrder(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除【请填写功能名称】编号为"' + ids + '"的数据项？').then(function() {
        return delOrder(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xanadu/order/export', {
        ...this.queryParams
      }, `order_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
