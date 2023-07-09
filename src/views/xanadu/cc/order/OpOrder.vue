<template>
  <div class="container">
    <!-- 订单信息 -->
    <el-card class="box-card" shadow="always" style="margin-top: 10px">
      <el-descriptions title="订单信息">
        <el-descriptions-item label="客户编号">{{
          form.customerId
        }}</el-descriptions-item>
        <el-descriptions-item label="客户名">{{
          form.customerName
        }}</el-descriptions-item>
        <el-descriptions-item label="原订单号">{{
          form.orderId
        }}</el-descriptions-item>
        <el-descriptions-item label="原订单状态">{{
          form.status
        }}</el-descriptions-item>
      </el-descriptions>
      <el-form ref="form" :model="this.form" label-width="120px">
        <el-form-item label="订单类型">
          <el-select v-model="form.orderType" disabled> </el-select>
        </el-form-item>
        <el-form-item label="创建日期">
          <el-date-picker
            type="date"
            style="width: 100%"
            v-model="form.createTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="`要求${this.form.operationType}日期`">
          <el-date-picker
            type="date"
            style="width: 100%"
            v-model="form.deadline"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="原因">
          <el-input v-model="form.reason" type="textarea" />
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 商品信息 -->
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <span>商品信息</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="handleSelectProduct"
        >
          选择要{{ this.form.operationType }}的商品</el-button
        >
      </div>
      <!-- 保证computed被触发 -->
      <div style="display: none">
        {{ `修改次数:${proChanged}` }}
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
          <el-table-column
            v-if="this.form.operationType !== '新订'"
            :label="`原购买数量`"
            width="100"
            align="center"
          >
            <template slot-scope="{ row }">
              <span>{{ row.orNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="`${this.form.operationType}数量`"
            width="100"
            align="center"
          >
            <template slot-scope="{ row }">
              <span>{{ row.opNumber }}</span>
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
    <div class="btn">
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button @click="onReset">重置</el-button>
    </div>
  </div>
</template>

<script>
import { getCustomer } from "@/api/cc-customer";
import { unSubscribe, Return, change } from "@/api/cc-order";
export default {
  data() {
    return {
      form: {
        id: undefined,

        orderId: undefined,
        customerId: undefined,
        customerName: undefined,
        orderType: "",
        operationType: "",

        createTime: "",
        deadline: "",
        status: "",
        reason: "",
        // 商品名称、单价、数量
        products: [],
        productsMap: new Map(),

        numbers: 0,
        totalAmount: 0,
      },
      rule: [],

      newOrder: undefined,
      ifShow: true,
    };
  },
  created() {
    this.form.orderId = this.$route.query.orderId; //订单ID
    this.form.operationType = this.$route.query.opType; // 操作类型
    // this.form.status = this.form.opType === "换货" ? "换货" : "退货"; //退换货状态

    let order = this.$cache.local.getJSON("operateOrder");
    this.form.customerId = order.customerId
    this.form.orderType = order.orderType
    this.form.createTime = order.createTime
    this.form.deadline = order.deadline
    this.form.status = order.status
    getCustomer(order.customerId).then((res) => {
      this.form.customerName = res.data.name;
    });
  },

  methods: {
    onSubmit() {
      let form = this.form;
      // 表单校验
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // 客户确认订单信息

          // 是否选择商品
          if (form.products.length !== 0) {
            form.numbers = form.products.reduce(
              (sum, e) => sum + Number(e.opNumber || 0),
              0
            );
            if (form.numbers !== 0) {
              // 商品总价
              form.totalAmount = form.products.reduce(
                (sum, e) => sum + Number(e.opNumber * e.price || 0),
                0
              );
              let opfun = new Function();
              // opNum-num
              if (form.operationType === "退货") opfun = Return;
              else if (form.operationType === "换货") opfun = change;
              else {
                opfun = unSubscribe;
              }
              for (var index in form.products) {
                let item = form.products[index];
                item.number = item.opNumber;
                form.productsMap[item.productId] = item.opNumber;
              }
              // 请求服务
              opfun(form).then((res) => {
                // 如果缺货，查询缺货商品列表
                if (res.data && res.data.status === "缺货") {
                  this.$modal
                    .confirm("订单商品缺货")
                    .then(() => {})
                    .then(() => {})
                    .catch(() => {});
                } else {
                  this.$modal.alertSuccess("操作成功");
                }
                // 清除缓存 重置表单
                (this.form.reason = ""),
                  (this.form.deadline = ""),
                  (this.form.products = []),
                  this.$cache.local.remove("selectedProduct");
              });
            } else {
              this.$modal.alertError(
                `请选择要${this.form.operationType}的商品`
              );
            }
          } else {
            this.$modal.alertError(`请选择要${this.form.operationType}的商品`);
          }
        }
      });
    },
    // 删除缓存 重置表单
    onReset() {
      this.form.reason = ""
      this.form.deadline = ""
      this.form.products = []
      this.$cache.local.remove("selectedProduct")
      this.$message({
        message: "reset!",
        type: "warning",
      });
    },
    handleSelectProduct() {
      this.$router.push({
        path: "/cc/product",
        query: { orderId: this.form.orderId, opType: this.form.operationType ,orderType:this.form.orderType},
      });
    },
  },
  computed: {
    proChanged() {
      // 更新商品列表
      this.form.products = this.$cache
        ? this.$cache.local.getJSON("selectedProduct")
        : [];
      for (var index in this.form.products) {
        let item = this.form.products[index];
        item.orNumber = item.number;
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
  },
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
