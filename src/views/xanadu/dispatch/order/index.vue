<template>
    <div class="app-container">
        <div v-if="!dialogFormVisible">
            <!-- 提示当前订单操作 -->
            <div class="alert">
                <p v-if="opType !== ''">正在进行的订单操作是</p>
                <p v-else>正在查看所有订单</p>
                <el-select v-model="opType" class="select" placeholder="选择订单操作" @change="handleOpChange(opType, true)"
                    clearable @clear="handleOpChange(opType)">
                    <el-option v-for="item in opTypeOption" :key="item" :label="item" :value="item" />
                </el-select>
            </div>
            <div class="filter-container">
                <el-form :inline="true" style="margin: 0px;">
                    <el-form-item label="要求到货日期">
                        <el-date-picker v-model="deadlineRange" type="daterange" align="right" style="width: 240px"
                            value-format="yyyy-MM-dd HH:mm:ss" unlink-panels range-separator="-" start-placeholder="开始日期"
                            end-placeholder="结束日期" clearable>
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="订单类型">
                        <el-select v-model="listQuery.orderType" placeholder="订单类型" style="width: 200px; margin-right: 5px"
                            class="filter-item" clearable @clear="this.handleFilter">
                            <el-option v-for="item in orderTypeOption" :key="item" :label="item" :value="item" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单状态">
                        <el-select v-model="listQuery.status" placeholder="订单状态" style="width: 200px; margin-right: 5px"
                            class="filter-item" clearable @clear="this.handleFilter">
                            <el-option v-for="item in orderStatusOption" :key="item" :label="item" :value="item" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter(true)">
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
                        <el-button type="primary" plain @click="handleOperateOrder(row)">订单操作</el-button>
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
            opList: [],//订单操作列表
            queryList: [], //查询后的列表
            total: 0,
            listQuery: {
                page: 1,
                limit: 20,
                orderType: "",
                status: '',
            },
            tableColumns: undefined,
            // 分页
            currentPage: 1,//默认显示第一页
            pageSize: 5,//默认每页显示5条

            orderTypeOption: ["全部", "新订", "退订", "退货", "换货"],
            orderStatusOption: ["缺货", "可分配", "已分配", "已调度"],
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

            opType: '',
            opTypeOption: ['订单调度', '缺货检查'],
        }
    },
    created() {
        this.getList()
    },
    methods: {
        // 加载订单列表
        getList() {
            this.listLoading = true;
            // 请求
            fetchList().then((response) => {
                let list = response.data
                // 状态为：缺货/可分配/已分配/已调度 的订单
                if (list) {
                    list = list.filter((order) => {
                        if (this.orderStatusOption.includes(order.status)) return true
                        return false
                    })
                }
                this.list = list
                // 获取当前操作的订单列表
                this.handleOpChange(this.opType)
                this.listLoading = false;
            }).catch(this.listLoading = false)
        },

        // 查询
        handleFilter(show) {
            this.listLoading = true;
            // 对当前正在操作的订单列表进行查询
            this.queryList = this.opList.filter((order) => {
                // 查询条件:要求到货日期 订单类型 订单状态
                let query = this.listQuery
                let range = this.deadlineRange
                if (range !== null && (new Date(order.deadline) < new Date(range[0]) || new Date(order.deadline) > new Date(range[1]))) {
                    return false
                }
                if (query.orderType !== '' && query.orderType !== '全部' && order.orderType !== query.orderType) {
                    return false
                }
                if (query.status !== '' && order.status !== query.status) {
                    return false
                }
                return true
            });
            // 数据总条数
            this.total = this.queryList.length
            this.listLoading = false;
            // 查询提示
            if (!show) return
            if (this.total === 0) {
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

        // 加载对应操作的订单列表
        handleOpChange(newVal) {
            this.listLoading = true;
            switch (newVal) {
                case '订单调度':
                    this.opList = this.list.filter(order => order.status === "可分配")
                    this.orderStatusOption=[ "可分配"]
                    break
                case '缺货检查':
                    this.opList = this.list.filter(order => order.status === "缺货")
                    this.orderStatusOption=["缺货"]
                    break
                default:
                    this.opList = this.list
                    this.orderStatusOption=["缺货", "可分配", "已分配", "已调度"]
                    break
            }
            // 查询
            this.handleFilter(false)
            // 提示
            if (this.total === 0 && newVal != '') {
                this.$message({
                    type: 'error',
                    message: '没有需要操作的订单',
                    durarion: 1000,
                });
            }
        },

        // 订单操作
        handleOperateOrder(row) {
            if (this.opType === '') {
                this.$message({
                    type: 'error',
                    message: '请先选择要进行的操作',
                    durarion: 1000,
                });
                return
            }
            // 执行对应的订单操作
            switch (this.opType) {
                case '订单调度':
                    this.handleInfo(row)
                    break
                case '缺货检查':
                    this.handleCheck(row)
                    break
                default:
                    break
            }
        },

        // 订单调度 v-if
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

        // 缺货检查
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

        // 关闭订单调度页
        close() {
            this.temp = [];
            this.dialogFormVisible = false;
        },

    }
}
</script>

<style scoped>
.alert {
    display: flex;
    padding: 10px 16px;
    background-color: #ecf8ff;
    border-radius: 4px;
    border-left: 5px solid #50bfff;
    margin-bottom: 20px;
}

.alert p {
    font-size: 14px;
    color: #5e6d82;
    line-height: 1.5em;
}

.select {
    margin-left: 10px;
    margin-top: 6.5px;
}
</style>
