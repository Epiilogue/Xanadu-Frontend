<template>
    <div class="app-container">
        <div v-if="!dialogFormVisible">
            <div class="filter-container">
                <el-form :inline="true" style="margin: 0px;">
                    <el-form-item label="要求到货日期">
                        <el-date-picker v-model="deadlineRange" type="daterange" align="right" style="width: 240px"
                            value-format="yyyy-MM-dd HH:mm:ss" unlink-panels range-separator="-" start-placeholder="开始日期"
                            end-placeholder="结束日期" clearable>
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="订单类型"><el-select v-model="listQuery.orderType" placeholder="订单类型"
                            style="width: 200px; margin-right: 5px" class="filter-item">
                            <el-option v-for="item in orderTypeOption" :key="item" :label="item" :value="item" />
                        </el-select></el-form-item>
                    <el-form-item><el-button class="filter-item" type="primary" icon="el-icon-search"
                            @click="() => this.getList()">
                            查询
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-table :key=0 :data="queryList.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
                v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column label="订单编号" prop="id" align="center" min-width="150">
                    <template slot-scope="{ row }">
                        <Order :id="row.id" :orderType="row.orderType"></Order>
                    </template>
                </el-table-column>
                <el-table-column label="订单类型" prop="orderType" min-width="150" align="center">
                </el-table-column>
                <el-table-column label="商品数量" prop="numbers" min-width="150" align="center">
                </el-table-column>
                <el-table-column label="商品总价" prop="totalAmount" min-width="150" align="center">
                </el-table-column>
                <el-table-column label="订单状态" prop="status" min-width="150" align="center">
                </el-table-column>
                <!-- 按钮 -->
                <el-table-column label="操作" align="center" min-width="200" class-name="small-padding fixed-width">
                    <template slot-scope="{ row, $index }">
                        <el-button type="primary" @click="handleInfo(row)">调度</el-button>
                        <el-button type="primary" @click="handleCheck(row)">缺货检查</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination @size-change="newSize => pageSize = newSize" @current-change="newPage => currentPage = newPage"
                :current-page="1" :page-sizes="[1, 2, 5, 7]" :page-size="5" layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>

        <Info v-else :temp="this.temp" @submit="submit" @return="close()"></Info>

    </div>
</template>

<script>
import Info from "./DispatchOrder.vue"
import { fetchList, getOrder } from "@/api/cc-order"
import { dispatchOrder, checkAllArrival } from '@/api/dpc-dispatch'

import { getColumn } from '@/components/detail/module/orderColumn'
import Order from '@/components/detail/order.vue'

export default {
    components: { Info, Order },
    data() {
        return {
            list: [],
            queryList: [], //查询后的列表
            total: 0,
            listQuery: {
                page: 1,
                limit: 20,
                orderType: "",
            },
            tableColumns: undefined,
            // 分页
            currentPage: 1,//默认显示第一页
            pageSize: 5,//默认每页显示5条

            orderTypeOption: ["全部", "新订", "退订", "退货", "换货"],
            deadlineRange: [],  // 日期
            temp: { // 订单详情
                id: undefined,

                userId: "",
                orderType: "",
                status: "",
                postCode: "",

                telephone: 1,
                deliveryTime: "",
                comment: new Date(),
                invoiceNeed: "",
                substationId: "",
                receiverName: "",
                deliveryAddress: "",
                products: [],
            },
            listLoading: false,
            dialogFormVisible: false,
        }
    },
    created() {
        this.getList()
    },
    methods: {
        // 分页加载订单列表
        getList() {
            this.listLoading = true;
            //将起止日期添加到请求参数中
            if (this.deadlineRange && this.deadlineRange.length > 0) {
                console.log(this.deadlineRange)
                let query = this.addDateRange(this.listQuery, this.deadlineRange);
                query.beginTime = query.params.beginTime
                query.endTime = query.params.endTime
                query.params = undefined
            } else {
                this.listQuery.beginTime = ''
                this.listQuery.endTime = ''
            }
            if (this.listQuery.orderType === '全部') {
                this.listQuery.orderType = ''
            }
            // 请求
            fetchList().then((response) => {
                this.list = response.data;
                this.total = response.data.length;
                this.queryList = this.list
                this.listLoading = false;
            }).catch(this.listLoading = false)
        },

        // 查询
        handleFilter() {
            this.listLoading = true;
            this.queryList = this.opList.filter((order) => {
                // 查询条件
                let query = this.listQuery
                // 要求到货日期 订单类型
                let range = this.deadlineRange
                if (range !== null && (new Date(order.deadline) < new Date(range[0]) || new Date(order.deadline) > new Date(range[1]))) {
                    return false
                }
                if (query.orderType !== '' && order.orderType !== query.orderType) {
                    return false
                }
                return true
            });
            this.listLoading = false;
            if (this.queryList.length === 0) {
                this.$message({
                    type: 'error',
                    message: '没有符合条件的订单',
                    durarion: 1000,
                });
            } else {
                this.$message({
                    type: 'success',
                    message: '查询成功',
                    durarion: 1000,
                });
            }
        },

        // 订单详情 v-if
        handleInfo(row) {
            row.orderId = row.id;
            getOrder(row).then((res) => {
                this.temp = res.order;
                this.temp.products = res.productList;
                this.temp.userId = row.userId
                this.temp.orderType = row.orderType
                this.temp.status = row.status
                this.temp.postCode = row.postCode
                this.dialogFormVisible = true;
            });
        },

        // 检查订单状态
        handleCheck(row) {
            checkAllArrival(row.id).then((res) => {
                this.$message({
                    message: res.msg,
                    type: "success",
                    duration: 1000,
                });
                this.getList()
            });
        },

        // 完成调度
        submit(substationId, outDate) {
            this.temp.substationId = substationId
            this.temp.outDate = outDate
            dispatchOrder(this.temp).then((res) => {
                this.$message({
                    message: res.msg,
                    type: "success",
                    duration: 1000,
                });
                this.getList()
            })
        },

        // 关闭订单详情页
        close() {
            this.temp = [];
            this.dialogFormVisible = false;
        },

    }
}
</script>
