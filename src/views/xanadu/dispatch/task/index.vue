<template>
    <div class="app-container">
        <div>
            <el-card>
                <!-- 任务单查询 -->
                <div class="filter-container">
                    <el-form :inline="true">
                        <el-form-item class="form-item" label="要求完成日期">
                            <el-date-picker v-model="listQuery.deadlineRange" type="daterange" align="right"
                                style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" unlink-panels range-separator="-"
                                start-placeholder="开始日期" end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item class="form-item" label="任务类型">
                            <el-select v-model="listQuery.taskType" placeholder="任务类型"
                                style="width: 200px; margin-right: 5px" class="filter-item" clearable>
                                <el-option v-for="item in taskTypeOption" :key="item" :label="item" :value="item" />
                            </el-select>
                        </el-form-item>
                        <el-form-item class="form-item" label="任务状态">
                            <el-select v-model="listQuery.taskStatus" placeholder="任务状态"
                                style="width: 200px; margin-right: 5px" class="filter-item" clearable>
                                <el-option v-for="item in taskStatusOption" :key="item" :label="item" :value="item" />
                            </el-select>
                        </el-form-item>
                        <el-form-item class="form-item" label="分站编号">
                            <el-input v-model="listQuery.subId" placeholder="分站编号" style="width: 200px; margin-right: 5px"
                                class="filter-item" />
                        </el-form-item>
                        <el-form-item class="form-item">
                            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
                                查询
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <!-- 动态列Table -->
                <el-table key=0 :data="pageList" border fit highlight-current-row style="width: 100%"
                    v-loading="listLoading">
                    <!-- 点击编号查看详情 -->
                    <el-table-column prop="id" label="任务单编号" min-width="130" align="center">
                        <template slot-scope="{row}">
                            <Task :id="row.id" :task="row" v-if="refreshed"></Task>
                        </template>
                    </el-table-column>

                  <el-table-column prop="id" label="订单编号" min-width="130" align="center">
                    <template slot-scope="{row}">
                      <order :id="row.orderId"/>
                    </template>
                  </el-table-column>
                    <el-table-column v-for="column in tableColumns" :prop="column.prop" :label="column.label"
                        v-if="column.show" min-width="130" align="center">
                    </el-table-column>
                    <!-- 日期 -->
                    <el-table-column prop="deadline" label="要求完成日期" min-width="130" align="center">
                        <template slot-scope="{ row }">
                            <i class="el-icon-time"></i>
                            <span>{{
                                $moment(new Date(row.deadline)).format("YYYY-MM-DD")
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="this.opType !== '' && this.opType !== '分配任务'" prop="createTime" label="任务生成日期"
                        min-width="130" align="center">
                        <template slot-scope="{ row }">
                            <i class="el-icon-time"></i>
                            <span>{{
                                $moment(new Date(row.createTime)).format("YYYY-MM-DD")
                            }}</span>
                        </template>
                    </el-table-column>
                </el-table>

                <Pagination v-show="total > 0" :total="total" :page.sync="pageInfo.pageNum" :limit.sync="pageInfo.pageSize"
                    @pagination="getPageList" />
            </el-card>
        </div>
    </div>
</template>
<script>

import { getTaskList } from '@/api/dpc-dispatch'
import Pagination from '@/components/Pagination'
import { getColumn, getOption } from '@/components/detail/module/taskColumn'
import Task from '@/components/detail/task.vue'

export default {
    components: { Pagination,Task },
    created() {
        this.handleOpChange(this.opType, false);
    },
    data() {
        return {
            //路由参数
            opType: "",   //任务操作类型
            subId: '',   //分站id
            //数据
            task: {},    //当前操作的任务单

            list: [],   //所有数据
            queryList: [],  //查询后数据
            opList: [],  //操作的数据
            total: 0,   //分页
            refreshed:true,
            listLoading: false,
            //查询
            listQuery: {
                deadlineRange: [],
                taskStatus: "",
                taskType: "",
                subId: "",
            },
            // 分页
            pageList: [],   //表格数据
            pageInfo: {
                pageNum: 1,
                pageSize: 10,
            },
            //下拉选择
            taskStatusOption: ['已调度', '可分配', '已分配', '已领货', '已完成', '失败', '部分完成'],
            taskTypeOption: ['收款', '送货', '送货收款', '退货', '换货'],
            opTypeOption: ['分配任务', '取货', '发票领用', '打印签收单', '回执录入'],
            // dialog
            courierDialogVisible: false,
            tableColumns: undefined, //表格列
            receipt: false,  //是否展示回执录入页面
        }
    },
    methods: {

        getList(fun) {
            // 加载列表
            return new Promise((resolve, reject) => {
                getTaskList().then((response) => {
                    this.list = response.data;
                    resolve('成功')
                }).catch(err => {
                    reject('失败')
                    this.listLoading = false
                });
            })
        },
        getPageList() {
            this.refreshed=false
            this.total = this.queryList.length
            let pageNum = this.pageInfo.pageNum
            let pageSize = this.pageInfo.pageSize
            this.pageList = this.queryList.slice((pageNum - 1) * pageSize, pageNum * pageSize)
            this.$nextTick(()=>{
                this.refreshed=true
            })
        },
        //查询
        handleFilter() {
            this.listLoading = true;
            this.queryList = this.opList.filter((task) => {
                // 查询条件
                let query = this.listQuery
                // 日期 任务类型 任务状态 分站编号
                let range = query.deadlineRange
                if (range !== null && (new Date(task.deadline) < new Date(range[0]) || new Date(task.deadline) > new Date(range[1]))) {
                    return false
                }
                if (query.taskType !== '' && task.taskType !== query.taskType) {
                    return false
                }
                if (query.taskStatus !== '' && task.taskStatus !== query.taskStatus) {
                    return false
                }
                if (query.subId != '' && task.subId !== Number(query.subId)) {
                    return false
                }
                return true
            });
            // 分页
            this.getPageList()
            this.listLoading = false;
            if (this.queryList.length === 0) {
                this.$message({
                    type: 'error',
                    message: '没有符合条件的任务',
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
        // 获取任务单列表
        async handleOpChange(newVal, show) {
            this.listLoading = true;
            let option = getOption(newVal)
            this.taskStatusOption = option.status
            this.taskTypeOption = option.type
            // 修改表格列
            this.tableColumns = getColumn(newVal)
            // 加载下拉框内容
            await this.getList()
            this.opList = this.list
            if (this.opList.length === 0 && show) {
                this.$message({
                    type: 'error',
                    message: '暂无数据',
                    durarion: 1000,
                });
            }
            // 查询结果
            this.queryList = this.opList
            // 分页
            this.getPageList()
            this.listLoading = false;
        },

        // 查看任务当前状态对应的流程分步表单
        // 查看任务详情
        handleViewTask() { },
    },
}
</script>

<style scoped>
.form-item {
    margin-bottom: 0px;
    height: 100%;
    /* vertical-align:middle; */
}
</style>
