<template>
    <div class="app-container">
        <el-tabs tab-position="left" v-model="activeName" @tab-click="changeTab" style="height: 100%;">
            <el-tab-pane label="商品调度记录" name="dispatch">
                <dispatchRecords ref="dispatchRecords"></dispatchRecords>
            </el-tab-pane>
            <el-tab-pane label="主库库存查询" name="center">
                <el-table :key="0" :row-key="(row) => row.id" :data="centerList" ref="table" border fit
                    highlight-current-row style="width: 100%" v-loading="listLoading">
                    <el-table-column label="记录编号" prop="id" align="center" min-width="100">
                    </el-table-column>
                    <el-table-column label="商品编号" prop="productId" min-width="100" align="center">
                        <template slot-scope="{row}">
                            <product :id="row.productId"></product>
                        </template>
                    </el-table-column>
                    <el-table-column label="商品名称" prop="productName" min-width="100" align="center">
                    </el-table-column>
                    <el-table-column label="商品单价" prop="productPrice" min-width="100" align="center">
                    </el-table-column>
                    <el-table-column label="可分配数量" prop="allocateAbleNum" min-width="100" align="center">
                    </el-table-column>
                    <el-table-column label="已分配数量" prop="allocatedNum" min-width="100" align="center">
                    </el-table-column>
                    <el-table-column label="退货数量" prop="refundNum" min-width="100" align="center">
                    </el-table-column>
                    <el-table-column label="锁定数量" prop="lockNum" min-width="100" align="center">
                    </el-table-column>
                    <el-table-column label="总计" prop="totalNum" min-width="100" align="center">
                    </el-table-column>
                    <el-table-column label="操作" min-width="150" align="center">
                        <template slot-scope="{ row, $index }">
                            <el-button :disabled="row.allocateAbleNum <= 0" type="primary" plain
                                @click="handleOutDispatch(row, $event)">
                                出库调度
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="centerTotal > 0" :total="centerTotal" :page.sync="listQuery.pageNum"
                    :limit.sync="listQuery.pageSize" @pagination="getCenterList" />
            </el-tab-pane>
            <el-tab-pane label="分库调度入库" name="sub">
                <div>
                    <!-- 分库库存查询：商品id，分库id-->
                    <div class="filter-container">
                        <el-form :inline="true" style="margin: 0px;" @submit.native.prevent>
                            <el-form-item label="商品编号" prop="productId" style="margin-bottom:0px;">
                                <el-input v-model.number="productId" placeholder="商品编号" style="width: 200px; margin:0px,5px"
                                    class="filter-item" @keyup.enter.native="handleFilter" />
                            </el-form-item>
                            <!-- <el-form-item label="分库城市" style="margin-bottom:0px;">
                            <el-input v-model="listQuery.city" placeholder="分库城市"
                                style="width: 200px; margin-right: 0px,5px" class="filter-item" /></el-form-item>
                        <el-form-item style="margin-bottom:0px;" width="100%">
                            <el-button type="primary" @click="handleFilter">查询分库</el-button>
                        </el-form-item> -->
                        </el-form>

                    </div>
                    <div class="alert">
                        <p v-if="!productId">
                            请输入调拨商品的编号，并回车查看库存
                        </p>
                        <p v-else-if="!centerStorage">
                            正在调拨的商品编号为:<code>{{ productId }}</code>,可分配商品数量为:<code>0</code>
                        </p>
                        <p v-else>
                            正在调拨的商品编号为:<code>{{ productId }}</code>,可分配商品数量为:<code>{{ centerStorage }}</code>,请选择分库,完成商品调度
                        </p>
                    </div>
                    <el-table :key="1" :row-key="(row) => row.id" :data="subList" ref="table" border fit
                        highlight-current-row style="width: 100%" v-loading="listLoading">
                        <el-table-column label="分库编号" prop="id" align="center" min-width="100">
                            <template slot-scope="{row}">
                                <subware :id="row.id"></subware>
                            </template>
                        </el-table-column>
                        <el-table-column label="分库名称" prop="name" min-width="100" align="center">
                        </el-table-column>
                        <el-table-column label="分库地址" prop="address" min-width="100" align="center">
                        </el-table-column>
                        <el-table-column label="地址经度" prop="x" min-width="100" align="center">
                        </el-table-column>
                        <el-table-column label="地址维度" prop="y" min-width="100" align="center">
                        </el-table-column>
                        <el-table-column label="库管员" prop="master" min-width="100" align="center">
                        </el-table-column>
                        <el-table-column label="分库城市" prop="city" min-width="100" align="center">
                        </el-table-column>
                        <el-table-column label="操作" min-width="100" align="center">
                            <template slot-scope="{ row, $index }">
                                <el-button :disabled="row.allocateAbleNum <= 0" type="primary" plain
                                    @click="handleInDispatch(row)">
                                    调度入库
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination v-show="subTotal > 0" :total="subTotal" :page.sync="subwareListQuery.pageNum"
                        :limit.sync="subwareListQuery.pageSize" @pagination="getSubList" />

                    <el-dialog title="调度信息" :visible.sync="dialogFormVisible">
                        <el-form>
                            <el-form-item label="分库编号" label-width="120px">
                                <el-input v-model="req.subwareId" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="商品编号" label-width="120px">
                                <el-input v-model="req.product.productId" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="调度商品数量" label-width="120px">
                                <el-input-number size="medium" v-model="req.product.number" :min="1"></el-input-number>
                            </el-form-item>
                            <el-form-item label="要求出库日期" label-width="120px">
                                <el-date-picker v-model="req.requireDate" type="date" placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="cancel">取消</el-button>
                            <el-button type="primary" @click="submit">提交</el-button>
                        </div>
                    </el-dialog>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>

import { centerStorageList, cenGoodById, subList, subWareList } from '@/api/ware.js'
import { getProduct } from '@/api/dbc-product.js'
import { dispatchProduct } from '@/api/dpc-dispatch.js'
import Pagination from "@/components/Pagination";
import dispatchRecords from './dispatchRecords.vue'

import product from '@/components/detail/product'
import subware from '@/components/detail/subware'

export default {
    name: "DispatchProduct",
    components: { Pagination, dispatchRecords, product, subware },
    data() {
        return {
            listLoading: false,
            centerList: [],
            centerTotal: 0,
            subTotal: 0,
            subList: [],
            activeName: "dispatch",
            dialogFormVisible: false,

            listQuery: {
                pageNum: 1,
                pageSize: 20,
            },
            subwareListQuery: {
                pageNum: 1,
                pageSize: 20,
            },

            productId: "",
            centerStorage: "",

            req: {
                product: {},
                subwareId: "",
                requireDate: "", //要求出库日期
            },

            dispatchVisible: false
        }
    },
    methods: {
        // 中心仓库库存分页列表
        getCenterList() {
            this.listLoading = true;
            centerStorageList(this.listQuery).then((response) => {
                this.centerList = response.data.records;
                this.centerTotal = response.data.total;
                this.listLoading = false;
            }).catch(this.listLoading = false)
        },

        // 分库分页列表
        getSubList() {
            this.listLoading = true;
            subWareList(this.subwareListQuery).then((response) => {
                this.subList = response.data;
                this.subTotal = response.data.length;
                this.listLoading = false;
            }).catch(this.listLoading = false)
        },

        // 调度出库
        handleOutDispatch(row) {
            // 记录中心仓库商品信息
            this.productId = row.productId
            this.centerStorage = row.allocateAbleNum
            // 进行调度入库选择
            this.activeName = "sub"
            this.getSubList()
        },

        // 调度入库
        handleInDispatch(row) {
            this.req.subwareId = row.id
            this.req.product.productId = this.productId
            this.dialogFormVisible = true
        },
        submit() {
            if (!this.req.product.number || !this.req.requireDate) {
                this.$message({
                    type: 'error',
                    message: '请完善调度信息',
                    durarion: 1000,
                });
                return
            } else if (this.req.product.number > this.centerStorage) {
                this.$message({
                    type: 'error',
                    message: '调度数量超出可分配数量,调度失败',
                    durarion: 1000,
                });
                return
            }
            // 设置请求参数
            getProduct(this.req.product.productId).then(res => {
                this.req.product.productName = res.data.name
                this.req.product.productCategary = res.data.categary
                this.req.product.price = res.data.price
                this.req.requireDate = this.$moment(new Date(this.req.requireDate)).format("YYYY-MM-DD HH:mm:ss")
                console.log(this.req)
                // 调度
                dispatchProduct(this.req).then((res) => {
                    this.req = this.$options.data().req;
                    this.dialogFormVisible = false
                    this.$message({
                        type: 'success',
                        message: res.msg,
                        durarion: 1000,
                    });
                })
            })

        },

        // 取消调度入库
        cancel() {
            this.req = this.$options.data().req;
            this.dialogFormVisible = false
        },

        //切换Tab
        changeTab(tab) {
            if (tab.name === 'sub') {
                this.getSubList()
            } else if (tab.name === 'center') {
                this.getCenterList()
            } else {
                this.$refs.dispatchRecords.getList()
            }
        },

        // 单个商品库存查询
        handleFilter() {
            let newVal = this.productId
            this.centerStorage = ''
            if (newVal === '') return
            // 判断是否为数字
            let isNum = !isNaN(parseFloat(newVal)) && isFinite(newVal);
            if (!isNum) {
                this.centerStorage = ''
                this.$message({
                    type: 'error',
                    message: '输入不合法，请输入数字',
                    durarion: 1000,
                });
            } else if (isNum) {
                // 查询可分配库存
                cenGoodById(newVal).then(res => {
                    this.centerStorage = res.data.allocateAbleNum
                }).catch(this.centerStorage = 0)
            }
        }
    },
}

</script>

<style scoped>
.alert {
    padding: 8px 16px;
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

code {
    padding: 0 4px;
    border: 1px solid #eaeefb;
    border-radius: 4px;
}
</style>
