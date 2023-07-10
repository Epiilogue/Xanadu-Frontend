<!-- 传递的商品信息在父组件中修改后，子组件中不会同步 -->
<template>
  <div class="container">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <span><i class="el-icon-edit-outline">调度信息</i></span>
      </div>
      <el-form ref="form" label-width="100px" label-position="left" :inline="true">
        <el-form-item label="预计出库日期" style="width:50%;;margin-right: 0px;">
          <el-date-picker v-model="outDate" type="date" placeholder="选择日期" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="width:50%;text-align: right;margin-right: 0px;">
          <div class="btn">
            <el-button type="primary" @click="handleSubmit" > 提交 </el-button>
            <el-button @click="() => this.$emit('return')"> 返回 </el-button>
          </div>
        </el-form-item>
      </el-form>
      <substation switchTitle="设为任务分站" :searchAble="false" :id="temp.substationId?temp.substationId:-1" ref="substation" width="50%"></substation>
    </el-card>
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <span><i class="el-icon-document">订单详情</i></span>
      </div>
      <el-descriptions :column="3" border style="margin-bottom: 15px;">
        <el-descriptions-item label="订单编号">{{
          this.temp.id
        }}</el-descriptions-item>
        <el-descriptions-item label="订单类型">{{
          this.temp.orderType
        }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">{{
          this.temp.status
        }}</el-descriptions-item>
        <el-descriptions-item label="预计送货日期">{{
          $moment(new Date(this.temp.deliveryTime)).format("YYYY-MM-DD")
        }}</el-descriptions-item>
        <el-descriptions-item label="操作员编号">{{
          this.temp.userId
        }}</el-descriptions-item>
        <el-descriptions-item label="收货人姓名">{{
          this.temp.receiverName
        }}</el-descriptions-item>
        <el-descriptions-item label="收货地址">{{
          this.temp.deliveryAddress
        }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{
          this.temp.telephone
        }}</el-descriptions-item>
        <el-descriptions-item label="新订类型" v-if="this.temp.orderType==='新订'">{{
          this.temp.newType
        }}</el-descriptions-item>

        <el-descriptions-item label="是否需要发票">{{
          this.temp.invoiceNeed === 1 ? "是" : "否"
        }}</el-descriptions-item>
        <el-descriptions-item label="任务分站编号">{{
          this.temp.substationId
        }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{
          this.temp.comment
        }}</el-descriptions-item>
      </el-descriptions>
      <el-divider>商品信息</el-divider>
      <el-table :key="0" :row-key="(row) => row.productId" :data="this.temp.products" border fit style="width: 100%">
        <el-table-column label="商品编号" prop="id" align="center" min-width="100">
          <template slot-scope="{ row }">
            <span>{{ row.productId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" min-width="100" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.productName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品大类" min-width="100" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.productCategary }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单价" min-width="100" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品数量" min-width="100" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否缺货" class-name="status-col" min-width="100">
          <template slot-scope="{ row }">
            <el-tag :type="!row.islack ? 'success' : 'danger'">
              {{ row.islack ? "缺货" : "不缺货" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="能否退货" class-name="status-col" min-width="100">
          <template slot-scope="{ row }">
            <el-tag :type="row.refundAble ? 'success' : 'danger'">
              {{ row.refundAble ? "可退货" : "不可退货" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="能否换货" class-name="status-col" min-width="100">
          <template slot-scope="{ row }">
            <el-tag :type="row.changeAble ? 'success' : 'danger'">
              {{ row.changeAble ? "可换货" : "不可换货" }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>

import substation from '@/views/xanadu/cc/order/substation'
export default {
  name: "Info",
  props: ['temp', 'title'],
  components:{substation},
  data() {
    return {
      // 是否已确定分站id
      selectedSub: this.temp.substationId ? this.temp.substationId : undefined,
      disabled: this.temp.substationId ? true : false,
      outDate: "",
      // 日期
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24;
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '明天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周后',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
    }
  },
  methods: {
    handleChange(row) {
      if (row.id === this.selectedSub) {
        // 取消选中
        this.selectedSub = ""
      } else {
        // 选中
        this.selectedSub = row.id
      }
    },

    handleSubmit() {
      this.selectedSub=this.$refs.substation.getSubId()
      if (this.selectedSub && this.outDate) {
        console.log(this.outDate)
        this.outDate=this.$moment(new Date(this.outDate)).format("YYYY-MM-DD HH:mm:ss")
        this.$emit('submit', this.selectedSub, this.outDate)
      } else {
        this.$message({
          message: "请补全调度信息",
          type: "error",
          duration: 1000,
        });
      }
    }
  }
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
  text-align: right;
  display: flex;
  justify-content:space-between;
}
</style>
