<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form :inline="true">
                <el-form-item label="要求完成日期">
                    <el-date-picker v-model="listQuery.deadlineRange" type="daterange" align="right" style="width: 240px"
                        value-format="yyyy-MM-dd HH:mm:ss" unlink-panels range-separator="-" start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="任务类型"><el-select v-model="listQuery.taskType" placeholder="任务类型"
                        style="width: 200px; margin-right: 5px" class="filter-item">
                        <el-option v-for="item in taskTypeOption" :key="item" :label="item" :value="item" />
                    </el-select></el-form-item>
                <el-form-item label="任务状态">
                    <!-- <el-select v-model="listQuery.taskStatus" placeholder="任务状态"
                        style="width: 200px; margin-right: 5px" class="filter-item">
                        <el-option v-for="item in taskStatusOption" :key="item" :label="item" :value="item" />
                    </el-select> -->
                    <el-cascader :options="taskStatusOption" :props="{ checkStrictly: true }" clearable></el-cascader>
                </el-form-item>
                <el-form-item label="快递员编号">
                    <el-input v-model="listQuery.courierId" placeholder="快递员编号" style="width: 200px; margin-right: 5px"
                        class="filter-item" />
                </el-form-item>
                <el-form-item>
                    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-table key=0 :data="pageList" border fit highlight-current-row style="width: 100%" v-loading="listLoading"
            @selection-change="handleSelectionChange">
            <!-- 多选 -->
            <el-table-column type="selection" width="55">
            </el-table-column>
            <!-- 展开查看的信息 -->
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="客户编号">
                            <span>{{ props.row.customerId }}</span>
                        </el-form-item>
                        <el-form-item label="订单编号">
                            <span>{{ props.row.orderId }}</span>
                        </el-form-item>
                        <el-form-item label="商品总价">
                            <span>{{ props.row.totalAmount }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <!-- 主要信息 -->
            <el-table-column label="任务单编号" prop="id" align="center" width="100">
            </el-table-column>
            <el-table-column label="接收人姓名" prop="receiverName" width="100" align="center">
            </el-table-column>
            <el-table-column label="接收人电话" prop="phone" width="100" align="center">
            </el-table-column>
            <el-table-column label="送货地址" prop="deliveryAddress" width="100" align="center">
            </el-table-column>
            <el-table-column label="商品总数" prop="numbers" width="100" align="center">
            </el-table-column>
            <el-table-column label="任务生成日期" prop="createTime" width="100" align="center">
            </el-table-column>
            <el-table-column label="要求完成日期" prop="deadline" width="100" align="center">
            </el-table-column>
            <el-table-column label="任务类型" prop="taskType" width="100" align="center">
            </el-table-column>
            <el-table-column label="任务状态" prop="taskStatus" width="100" align="center">
            </el-table-column>
            <el-table-column label="分站编号" prop="subId" width="100" align="center">
            </el-table-column>

            <el-table-column label="快递员编号" prop="courierId" width="100" align="center">
            </el-table-column>

            <!-- 隐藏信息 -->
            <!-- <el-table-column label="客户编号" prop="customerId" width="100" align="center">
            </el-table-column>
            <el-table-column label="订单编号" prop="orderId" width="100" align="center">
            </el-table-column>
            <el-table-column label="商品总价" prop="totalAmount" width="100" align="center">
            </el-table-column> -->

            <!-- <el-table-column label="商品列表" prop="productsJson-products" width="100" align="center">
        </el-table-column> -->
            <!-- 按钮 -->
            <el-table-column label="操作" align="center" min-width="300" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="{ row, $index }">
                    <el-button type="primary" plain @click="handleViewStep(this.opType)">
                        {{ this.opType }}
                    </el-button>
                    <el-button type="primary" plain @click="handleViewTask(row)">
                        任务详情
                    </el-button>
                    <el-button type="primary" plain @click="handleViewStep(this.opType)">
                        任务流程
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <Pagination v-show="total > 0" :total="total" :page.sync="pageInfo.pageNum" :limit.sync="pageInfo.pageSize"
            @pagination="getPageList" />

        <!-- 任务详情 -->
        <!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <EditView v-if="dialogFormVisible" :originSub="temp" :title="dialogStatus" @hideUpdateView="hideUpdateView">
            </EditView>
        </el-dialog> -->
    </div>
</template>
<script>

// import { } from '@/api/task.js'
import Pagination from '@/components/Pagination'
export default {
    components: { Pagination },
    created() {
        this.opType = this.$route.query.opType; //路由参数
        this.getList();
    },
    data() {
        return {
            //路由参数
            opType: "",   //任务操作类型
            //数据
            list: [],
            queryList: [],
            total: 0,
            listLoading: false,
            //查询
            listQuery: {
                deadlineRange: [],
                taskStatus: "",
                taskType: "",

                courierId: "",
            },
            // 分页
            pageList: [],
            pageInfo: {
                pageNum: 1,
                pageSize: 10,
            },
            //下拉选择
            // taskStatusOption: ['已调度', '可分配', '已分配', '已领货', '已完成', '失败', '部分完成'],
            taskTypeOption: ['收款', '送货', '送货收款', '退货', '换货'],
            //任务操作-任务状态级联
            taskStatusOption: [{
                value: '任务分配',
                label: '任务分配',
                children: [{
                    value: '可分配',
                    label: '可分配',
                }, {
                    value: '已调度',
                    label: '已调度',
                }]
            },{
                value: '取货',
                label: '取货',
                children: [{
                    value: '已分配',
                    label: '已分配',
                }]
            },{
                value: '回执录入',
                label: '回执录入',
                children: [{
                    value: '已分配',
                    label: '已分配',
                }, {
                    value: '已领货',
                    label: '已领货',
                }]
            },{
                value: '完成状态',
                label: '完成状态',
                children: [{
                    value: '完成',
                    label: '完成',
                }, {
                    value: '失败',
                    label: '失败',
                },{
                    value: '部分完成',
                    label: '部分完成',
                }]
            }],
        }
    },
    methods: {

        // ----------------------------
        getList() {
            this.listLoading = true;
            // 加载列表
            getSubList().then((response) => {
                this.list = response.data;
                this.queryList = this.list
                this.total = response.data.length;
                // 分页
                this.getPageList()
                this.listLoading = false;
            }).catch(this.listLoading = false);
        },
        getPageList() {
            let pageNum = this.pageInfo.pageNum
            let pageSize = this.pageInfo.pageSize
            this.pageList = this.queryList.slice((pageNum - 1) * pageSize, pageNum * pageSize)
        },
        //查询
        handleFilter() {
            this.listLoading = true;
            this.queryList = this.list.filter((sub) => {
                return sub.name.indexOf(this.listQuery.name) > -1;
            });
            this.total = this.queryList.length
            // 分页
            this.getPageList()
            this.listLoading = false;
            this.$message({
                type: 'success',
                message: '查询成功',
                durarion: 1000,
            });
        },

        //表格多选框选中事件，换页时提示可能丢失选中的内容，是否切换页面
        handleSelectionChange() { },

        // 查看任务当前状态对应的流程分步表单
        handleViewStep(){},

        //查看任务详情
        handleViewTask(){},
    }
}
</script>