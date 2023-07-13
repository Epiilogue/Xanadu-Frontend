<!-- 传递的商品信息在父组件中修改后，子组件中不会同步 -->
<template>
    <div>
        <div class="link-type" @click="getAndConvert(id)">
            {{ id }}
        </div>
        <el-dialog title="订单详情" :visible.sync="dialogFormVisible" style="padding-left: 5%" width="70%">
            <!-- 订单信息 -->
            <el-descriptions title="订单概览" :column="3" border style="margin-bottom: 15px;">
                <el-descriptions-item v-for="field in formFields.order" :label="field.label">{{
                    temp[field.prop]
                }}</el-descriptions-item>
            </el-descriptions>
            <!-- 订购信息 -->
            <el-descriptions :title="orderType + '信息'" :column="3" border style="margin-bottom: 15px;">
                <el-descriptions-item v-for="field in formFields.detail" :label="field.label">{{
                    detail[field.prop]
                }}</el-descriptions-item>
            </el-descriptions>
            <!-- 商品信息 -->
            <el-descriptions title="商品信息">
            </el-descriptions>
            <el-table :key="0" :row-key="(row) => row.productId" :data="this.productList" border fit highlight-current-row
                style="width: 100%">
                <el-table-column v-for="field in formFields.product" v-if="field.show" :label="field.label"
                    :prop="field.prop" align="center" min-width="100">
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
        </el-dialog>
    </div>
</template>
  
<script>

import { getColumn } from './module/orderColumn'
import { getOrder } from '@/api/cc-order'   //获取新订或退换货信息
export default {
    name: "order",
    props: ['id', 'orderType'], //order
    data() {
        return {
            dialogFormVisible: false,
            formFields: getColumn(''),
            temp: {},
            detail: {},
            productList: [],
        };
    },
    methods: {
        // 获取数据 格式转换
        getAndConvert(id) {
            let query = { orderId: id}
            getOrder(query).then(res => {
                this.detail = res.order
                this.temp = res.origin
                this.productList = res.productList
                this.orderType=this.temp.orderType
                // 获取列
                this.formFields = getColumn(this.orderType)
                this.formFields.order.slice(0, 1)  //不显示订单编号
                // 格式转换
                if (this.orderType === '新订') {
                    this.detail.deliveryTime = this.$moment(new Date(this.detail.deliveryTime)).format("YYYY-MM-DD")
                    this.detail.invoiceNeed = this.detail.invoiceNeed === 1 ? "是" : "否"

                }
                this.temp.deadline = this.$moment(new Date(this.temp.deadline)).format("YYYY-MM-DD")
                this.temp.createTime = this.$moment(new Date(this.temp.createTime)).format("YYYY-MM-DD")
                this.dialogFormVisible = true
            }).catch(this.dialogFormVisible = true)
        }
    },
};
</script>