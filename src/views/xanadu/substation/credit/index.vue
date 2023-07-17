<!-- 商品收款统计 -->

<template>
    <div class="app-container">
        <!-- 查询：商品种类编号-二级，回执录入时间，商品名称-->
        <div class="filter-container">
            <el-form :inline="true" ref="dataForm" :rules="rules" :model="listQuery">
                <el-form-item class="form-item" prop='categaryId' label="商品种类">
                    <el-cascader v-model="listQuery.categaryId" :options="category"
                        :props="{ expandTrigger: 'hover', value: 'id', label: 'category', emitPath: false }"></el-cascader>
                </el-form-item>
                <el-form-item class="form-item" prop='createRange' label="回执录入时间">
                    <el-date-picker v-model="listQuery.createRange" type="daterange" align="right" style="width: 240px"
                        value-format="yyyy-MM-dd HH:mm:ss" unlink-panels range-separator="-" start-placeholder="开始日期"
                        end-placeholder="结束日期" :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <!-- 选填 -->
                <el-form-item class="form-item" prop='productName' label="商品编号">
                    <LocalProduct :single="true" :propName='name' @getInfo="selectData =>listQuery.productName=selectData[0].name"></LocalProduct>
                    <!-- <el-input placeholder="商品名称" v-model="listQuery.productName" class="input-with-select" /> -->
                </el-form-item>
                <el-form-item class="form-item">
                    <el-button type="primary" icon="el-icon-search" @click="getList(true)">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :key="tableKey" v-loading="listLoading"
            :data="list.slice((currentPage - 1) * pageSize, currentPage * pageSize)" border fit highlight-current-row
            style="width: 100%;">

            <el-table-column label="分站编号" prop="substationId" min-width="50px" align="center">
            </el-table-column>
            <el-table-column label="商品名称" prop="productName" min-width="50px" align="center">
            </el-table-column>
            <el-table-column label="送货数量" prop="deliveryNum" min-width="50px" align="center">
            </el-table-column>
            <el-table-column label="应收额" min-width="50px" prop="receive" align="center">
            </el-table-column>
            <el-table-column label="签收数量" prop="signNum" min-width="50px" align="center">
            </el-table-column>
            <el-table-column label="退回数量" prop="returnNum" min-width="50px" align="center">
            </el-table-column>
            <el-table-column label="退款额" min-width="50px" prop="refund" align="center">
            </el-table-column>
            <el-table-column label="实收额" prop="actual" min-width="50px" align="center">
            </el-table-column>
            <el-table-column label="应缴额" prop="pay" min-width="50px" align="center">
            </el-table-column>
        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1"
            :page-sizes="[10, 15, 20]" :page-size="15" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination/index.vue'
import { getPaymentByCategoryAndTime } from '@/api/sub-finance'
import axios from 'axios'
import LocalProduct from '@/components/Pop/LocalProduct/index'

export default {
    components: { Pagination,LocalProduct },
    directives: { waves },
    data() {
        return {

            tableKey: 0,
            subId: '',
            list: [],
            total: 0,
            listLoading: false,
            currentPage: 1,//默认显示第一页
            pageSize: 15,//默认每页显示5条
            listQuery: {
                subId: '',
                categaryId: '',
                productName: '',
                createRange: [],
            },
            rules: {
                categaryId: [{ required: true, message: '请选择商品种类', trigger: 'blur' }],
                createRange: [{ type: 'array', required: true, message: '请选择回执创建日期', trigger: 'blurchange' }],
            },
            category: [],
            // 日期选择的快捷设置
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
        }
    },
    mounted() {
        let sub = this.$cache.session.get('subProcessing')
        if (!sub) {
            // 未设置分站
            this.pageList = []
            this.$message({
                type: 'error',
                message: '请先在分站管理处设置要操作的分站',
                durarion: 1000,
            });
            return
        } else {
            this.subId = Number(sub)
            this.listQuery.subId = this.subId
            // this.getList(false)
            this.getCategory()
        }

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

        // 查询商品分类
        getCategory() {
            let cate = []
            const that = this
            axios.get('dbc/categary/listAll')
                .then(function (res) {
                    //that.category.push(res.data.data)
                    that.category = res.data.data
                })
            //this.category = cate
        },

        getList(show) {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.listLoading = true
                    //将起止日期添加到请求参数中
                    let query = this.addDateRange(this.listQuery, this.listQuery.createRange);
                    this.listQuery.startTime = query.params.beginTime
                    this.listQuery.endTime = query.params.endTime
                    getPaymentByCategoryAndTime(this.listQuery).then(res => {
                        this.list = res.data
                        this.total = this.list.length
                        this.$message({
                            type: 'success',
                            message: res.msg,
                            durarion: 1000,
                        });
                        this.listLoading = false
                    }).catch(this.listLoading = false)
                } else if (show) {
                    this.$message({
                        type: 'error',
                        message: '请补全查询条件',
                        durarion: 1000,
                    });
                }
            })
        },
    },
}
</script>
