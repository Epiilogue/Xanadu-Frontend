<template>
    <div class="app-container">
        <div v-if="!dialogFormVisible">
            <div class="filter-container">
                <el-form :inline="true" style="margin: 0px;">
                    <el-form-item label="要求到货日期">
                        <el-date-picker v-model="deadlineRange" type="daterange" align="right" style="width: 240px"
                            value-format="yyyy-MM-dd HH:mm:ss" unlink-panels range-separator="-" start-placeholder="开始日期"
                            end-placeholder="结束日期">
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

            <el-table :key=0 :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column label="订单编号" prop="id" align="center" min-width="150">
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
                        <el-button type="primary" @click="handleInfo(row)">详情</el-button>
                        <el-button type="primary" @click="handleCheck(row)">检查</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList" />
        </div>

        <Info v-else title="订单详情" :temp="this.temp" @submit="submit" @return="close()"></Info>

    </div>
</template>

<script>
import Info from "./DispatchOrder.vue"
import { fetchList, getOrder } from "@/api/order"
import { dispatchOrder,checkAllArrival } from '@/api/dispatch'
export default {
    components: { Info },
    data() {
        return {
            list: null,
            total: 0,
            listQuery: {
                page: 1,
                limit: 20,
                orderType: "",
            },
            orderTypeOption: ["全部", "新订", "退订", "退货", "换货"],
            deadlineRange: [],  // 日期
            temp: { // 订单详情
                id: undefined,

                userId:"",
                orderType:"",
                status:"",
                postCode:"",

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
                let query = this.addDateRange(this.listQuery, this.deadlineRange);
                query.beginTime = query.params.beginTime
                query.endTime = query.params.endTime
                query.params = undefined
            }
            if(this.listQuery.orderType==='全部'){
                this.listQuery.orderType=''
            }
            // 请求
            fetchList(this.listQuery).then((response) => {
                this.list = response.data.records;
                this.total = response.data.total;
                this.listLoading = false;
            }).catch(() => {
                this.$message({
                    message: "获取订单列表失败",
                    type: "error",
                    duration: 1000,
                });
                this.listLoading = false;
            })
        },

        // 订单详情 v-if
        handleInfo(row) {
            row.orderId = row.id;
            getOrder(row).then((res) => {
                this.temp = res.order;
                this.temp.products = res.productList;
                this.temp.userId=row.userId
                this.temp.orderType=row.orderType
                this.temp.status=row.status
                this.temp.postCode=row.postCode
                this.dialogFormVisible = true;
            });
        },

        // 检查订单状态
        handleCheck(row){
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
        submit(substationId,outDate) {
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