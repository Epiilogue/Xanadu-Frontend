<!-- 传递的商品信息在父组件中修改后，子组件中不会同步 -->
<template>
  <div>
    <el-dialog title="订单详情" :visible.sync="this.dialogFormVisible" width="60%" :show-close="false">
      <el-descriptions v-if="this.newOrder">
        <!-- <el-descriptions-item label="订单类型">{{
          temp.orderType
        }}</el-descriptions-item> -->
        <el-descriptions-item label="订单状态">{{
          this.temp.status
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
        <el-descriptions-item label="预计送货日期">{{
          $moment(new Date(this.temp.deliveryTime)).format("YYYY-MM-DD")
        }}</el-descriptions-item>
        <el-descriptions-item label="是否需要发票">{{
          this.temp.invoiceNeed === 1 ? "是" : "否"
        }}</el-descriptions-item>
        <el-descriptions-item label="分站ID">{{
          this.temp.substationId
        }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{
          this.temp.comment
        }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions v-if="!this.newOrder">
        <el-descriptions-item label="退换货原因">{{
          this.temp.reason
        }}</el-descriptions-item>
        <el-descriptions-item label="分站ID">{{
          this.temp.substationId
        }}</el-descriptions-item>
      </el-descriptions>

      <el-table
        :key="0"
        :row-key="(row) => row.productId"
        :data="this.temp.products"
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
        <el-table-column label="商品数量" width="100" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否缺货" class-name="status-col" width="100">
          <template slot-scope="{ row }">
            <el-tag :type="!row.islack ? 'success' : 'danger'">
              {{ row.islack ? "缺货" : "不缺货" }}
            </el-tag>
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

      <div slot="footer" class="dialog-footer">
        <el-button @click="()=>this.$emit('close')"> 关闭 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "OrderInfo",
  props: ['temp','newOrder','dialogFormVisible','title','products'],
};
</script>
