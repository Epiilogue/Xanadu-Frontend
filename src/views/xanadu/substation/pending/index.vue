<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form :inline="true">
                <el-form-item class="form-item" label="商品名称">
                    <el-input v-model="listQuery.productName" placeholder="商品名称" style="width: 200px; margin-right: 5px" />
                </el-form-item>
                <el-form-item class="form-item" label="任务编号">
                    <el-input v-model="listQuery.taskId" placeholder="任务编号" style="width: 200px; margin-right: 5px" />
                </el-form-item>
                <el-form-item class="form-item" label="处理状态">
                    <el-select v-model="listQuery.status" placeholder="处理状态" style="width: 200px; margin-right: 5px"
                        class="filter-item" clearable>
                        <el-option v-for="item in statusOption" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item class="form-item">
                    <el-button type="primary" icon="el-icon-search" @click="handleFilter">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-card>
            <el-table :key="tableKey" v-loading="listLoading"
                :data="queryList.slice((currentPage - 1) * pageSize, currentPage * pageSize)" border fit
                highlight-current-row style="width: 100%;">
                <el-table-column label="ID" prop="id" align="center" width="80"></el-table-column>
                <el-table-column label="任务编号" prop="taskId" min-width="50px" align="center"></el-table-column>
                <el-table-column label="分库编号" min-width="50px" prop="subwareId" align="center">
                    <template slot-scope="{row}">
                            <subware :id="row.subwareId"></subware>
                        </template>
                </el-table-column>
                <el-table-column label="商品编号" prop="productId" min-width="50px" align="center">
                    <template slot-scope="{row}">
                            <product :id="row.productId"></product>
                        </template>
                </el-table-column>
                <el-table-column label="商品名称" prop="productName" min-width="50px" align="center"></el-table-column>
                <el-table-column label="商品单价" min-width="50px" prop="productPrice" align="center"></el-table-column>
                <el-table-column label="待处理数量" min-width="50px" prop="dealNumber" align="center"></el-table-column>
                <!-- <el-table-column label="来源" min-width="50px" prop="source" align="center"></el-table-column> -->


                <el-table-column label="操作" align="center" min-width="150px" class-name="small-padding fixed-width">
                    <template slot-scope="{row,$index}">
                        <el-button type="primary" @click="handleRefund(row, $event)" :disabled="row.dealNumber===0">退货出库</el-button>
                        <el-button type="primary" @click="handleRefund(row, $event)" :disabled="row.dealNumber===0">重新入库</el-button>
                        <el-button @click="handleDelete(row, $index)" :disabled="row.dealNumber!==0">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1"
                :page-sizes="[10,15,20]" :page-size="15" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>

        </el-card>
    </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination/index.vue'
import { fetchList, refund, restore, deleteRecord } from '@/api/sub-pending'
import subware from '@/components/detail/subware'
import product from '@/components/detail/product'

export default {
    components: { Pagination,subware,product },
    directives: { waves },
    data() {
        return {

            subId: '',
            tableKey: 0,
            list: [],
            queryList: [],
            total: 0,
            listLoading: true,
            currentPage: 1,//默认显示第一页
            pageSize: 15,//默认每页显示5条
            listQuery: {
                productName: '',
                taskId: '',
                status: '',
            },
            statusOption: ['待处理', '已处理']
        }
    },
    created() {
        this.subId = Number(this.$cache.session.get('subProcessing'))
        this.getList()
    },

    methods: {

        //分页组件修改页面容量
        handleSizeChange(newSize) {
            this.pageSize = newSize
        },
        // 分页组件监听页码值改变的事件
        handleCurrentChange(newPage) {
            this.currentPage = newPage
        },

        getList() {
            this.listLoading = true
            fetchList().then(response => {
                this.list = response.data
                this.total = response.data.length
                this.queryList = this.list
                this.listLoading = false
            })
            this.handleFilter(false)
        },
        // 查询
        handleFilter(show) {
            this.listLoading = true;
            if (this.list) {
                this.queryList = this.list.filter((pro) => {
                    // 查询:名称 任务编号
                    let query = this.listQuery
                    if (query.productName !== '' && pro.productName.indexOf(query.productName) === -1) {
                        return false
                    }
                    if (query.taskId !== '' && pro.taskId !== Number(query.taskId)) {
                        return false
                    }
                    if ((query.status === '待处理' && pro.dealNumber === 0) || (query.status === '已处理' && pro.dealNumber > 0))
                        return false
                    return true
                });
            } else {
                this.queryList = []
            }
            this.total = this.queryList.length
            if (this.total === 0 && show) {
                this.$message({
                    type: 'error',
                    message: '没有满足条件的数据',
                    durarion: 1000,
                });
            }
            this.listLoading = false;
        },
        //删除
        handleDelete(row, index) {
            console.log(row)
            deleteRecord(row.id).then((res) => {
                this.total--
                this.$message({
                    type: 'success',
                    message: res.msg,
                    durarion: 1000,
                });
                this.list.splice(index, 1)
            }
            )
        },
        // 退货出库 重新入库
        handleRefund(row, $event) {
            let opType = $event.target.innerHTML
            let fun = new Function
            if (opType === '退货出库')
                fun = refund
            else if (opType === '重新入库') fun = restore
            // 弹框选数量
            this.$prompt('请输入商品数量', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^([1-9][0-9]*)$/,
                inputErrorMessage: '请输入数字'
            }).then(({ value }) => {
                this.listLoading = true
                fun(row.id, value).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.msg,
                        durarion: 1000,
                    });
                    this.getList()
                }).catch(this.listLoading = false);
            });
        }
    }
}
</script>
