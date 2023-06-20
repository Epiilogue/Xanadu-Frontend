<template>
  <div class="container">
    <!-- 客户信息 -->
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <span>客户信息</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="handleSelectCustomer"
          >查看客户列表</el-button
        >
      </div>
      <el-form ref="form1" :model="form" :rules="rule" label-width="120px">
        <el-form-item label="客户编号" prop="customerId">
          <el-input v-model="form.customerId" />
        </el-form-item>
        <!-- 默认为订购客户的信息 -->
        <el-form-item label="接收人姓名">
          <el-input v-model="form.receiverName" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.telephone" />
        </el-form-item>
        <el-form-item label="送货地址">
          <el-input v-model="form.deliveryAddress" />
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 商品信息 -->
    <!-- 合计 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品信息</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="handleSelectProduct"
        >
          查看商品列表</el-button
        >
      </div>
      <el-descriptions>
        <el-descriptions-item label="商品总数">{{
          this.form.numbers
        }}</el-descriptions-item>
        <el-descriptions-item label="订单金额">{{
          this.form.totalAmount
        }}</el-descriptions-item>
      </el-descriptions>

      <!-- 保证computed被触发 -->
      <div style="display: none">
        {{ `修改次数:${proChanged}-${cusChanged}` }}
      </div>
      <!-- v-for不刷新 -->
      <div :v-if="this.ifShow">
        <el-table
          :key="0"
          :row-key="(row) => row.productId"
          :data="this.form.products"
          border
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column label="ID" prop="id" align="center" width="100">
            <template slot-scope="{ row }">
              <span>{{ row.productId }}</span>
            </template>
          </el-table-column>
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
          <el-table-column label="单价" width="100" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column label="购买数量" width="100" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.number }}</span>
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
        </el-table>
      </div>
    </el-card>
    <!-- 订单信息 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>订单信息</span>
        <el-button style="float: right; padding: 3px 0" type="text"></el-button>
      </div>
      <el-form ref="form" :model="form" :rules="rule" label-width="120px">
        <el-form-item label="订单类型">
          <el-select v-model="form.orderType" disabled>
            <el-option
              v-for="item of orderTypeOption"
              :label="item"
              :value="item"
              :key="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投递分站">
          <el-select v-model="form.substationId">
            <el-option
              v-for="item of substationIdOption"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="要求到货日期">
          <el-date-picker
            v-model="form.deadline"
            type="date"
            placeholder="Pick a date"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="预计送货日期">
          <el-date-picker
            v-model="form.deliveryTime"
            type="date"
            placeholder="Pick a date"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="付款方式">
          <el-select v-model="form.newType">
            <el-option
              v-for="item of newTypeOption"
              :label="item"
              :value="item"
              :key="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否需要发票" prop="invoiceNeed">
          <el-radio-group v-model="form.invoiceNeed">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注说明">
          <el-input v-model="form.comment" type="textarea" />
        </el-form-item>
      </el-form>
    </el-card>
    <div class="btn">
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button @click="onReset">重置</el-button>
    </div>

    <OrderInfo
      title="订单详情"
      :temp="this.form"
      newOrder="true"
      :products="this.product"
      :dialogFormVisible="this.dialogFormVisible"
      @close="close()"
    ></OrderInfo>
  </div>
</template>

<script>
import { createNewOrder } from "@/api/cc-order";
import OrderInfo from "./OrderInfo.vue";
export default {
  components: { OrderInfo },
  data() {
    return {
      // 新订单表单
      form: {
        // id,userId,status由后端设置
        id: undefined,
        status: "",

        customerId: "",
        receiverName: "",
        telephone: "",
        deliveryAddress: "",

        products: [],
        numbers: 0,
        totalAmount: 0,

        orderType: "新订",
        substationId: undefined,
        invoiceNeed: "",
        creareTime: "",
        deadline: "",
        deliveryTime: "",
        comment: "",
        newType:"", //新订类型
        deleted: false,
      },
      products:undefined,
      rule: {
        customerId: [
          { required: true, message: "请选择订单客户", trigger: "change" },
        ],

        invoiceNeed: [
          { required: true, message: "请选择是否需要发票", trigger: "change" },
        ],
      },
      // 和操作类型相同
      orderTypeOption: ["新订", "退订", "退货", "撤销", "换货"],
      newTypeOption:['付款送货','货到付款'],
      substationIdOption: [
        { label: "华东", value: 1 },
        { label: "华北", value: 2 },
        { label: "华中", value: 3 },
        { label: "华西", value: 4 },
      ],
      ifShow: true,
      dialogFormVisible: false,
    };
  },
  methods: {
    async onSubmit() {
      // 表单校验
      await this.$refs["form1"].validate((valid) => {
        if (!valid) {
          this.$modal.alertWarning("请填写客户信息");
          return;
        }
        this.$refs["form"].validate((valid) => {
          if (valid) {
            // 商品数量不为0
            if (this.form.numbers !== 0) {
              // 请求服务
              this.form.creareTime = new Date();
              createNewOrder(this.form).then((res) => {
                this.form = res.data;
                // 订单详情商品信息不更新
                this.products=res.data.products;
                this.dialogFormVisible = true;
              });
            } else {
              this.$modal.alertWarning("请选择要购买的商品");
            }
          } else {
            this.$modal.alertWarning("请填写发票信息");
          }
        });
      });
    },
    // 删除缓存 重置表单
    onReset() {
      this.form = this.$options.data().form;
      this.$cache.local.remove("selectedProduct");
      this.$cache.local.remove("selectedCustomer");
      this.$message({
        message: "reset!",
        type: "warning",
      });
    },
    handleSelectCustomer() {
      this.$router.push({ path: "/cc/customer" });
    },
    handleSelectProduct() {
      this.$router.push({ path: "/cc/product", query: { opType: "新订" } });
    },
    close() {
      // 清除缓存
      this.form = this.$options.data().form;
      this.$cache.local.remove("selectedProduct");
      this.$cache.local.remove("selectedCustomer");
      this.dialogFormVisible = false;
    },
  },
  computed: {
    proChanged() {
      // 更新商品列表
      this.form.products = this.$cache
        ? this.$cache.local.getJSON("selectedProduct")
        : [];
      // 计算数量和总价
      if (this.form.products && this.form.products.length !== 0) {
        this.form.numbers = this.form.products.reduce(
          (sum, e) => sum + Number(e.number || 0),
          0
        );
        this.form.totalAmount = this.form.products.reduce(
          (sum, e) => sum + Number(e.number * e.price || 0),
          0
        );
      }
      // 刷新DOM
      this.ifShow = false;
      if (true) {
        this.$nextTick(() => {
          // $nextTick 是在 DOM 更新循环结束之后执行延迟回调
          this.ifShow = true;
        });
      }
      return this.$store.getters.proChanged;
    },
    cusChanged() {
      // 更新客户列表
      let cus = this.$cache.local.getJSON("selectedCustomer");
      if (cus) {
        this.form.customerId = cus.customerId;
        this.form.receiverName = cus.receiverName;
        this.form.telephone = cus.telephone;
        this.form.deliveryAddress = cus.deliveryAddress;
      }
      return this.$store.getters.cusChanged;
    },
  },
  // beforeDestroy() {
  //   this.$cache.local.remove("selectedProduct");
  //   this.$cache.local.remove("selectedCustomer");
  // },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.box-card {
  width: 85%;
  align-self: center;
  margin: 5px;
}

.btn {
  text-align: center;
  display: flex;
  justify-content: space-around;
  margin: 0px 0px 5px;
}
</style>
