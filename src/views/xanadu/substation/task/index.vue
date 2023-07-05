<template>
    <div class="app-container">
      <!--   打印内容   -->
      <div v-show="false">
        <form method="get" action="#" id="printJS-form-task">
          <div class="receipt">
            <h3 >Xanadu送货签收单</h3 >
            <h2>分库信息：</h2>
            <table class="receipt-table" title="分库信息">
              <tr>
                <td>分库名：</td>
                <td>{{ this.printform.substation.name }}</td>
              </tr>
              <tr>
                <td>分库地址：</td>
                <td>{{ this.printform.substation.address }}</td>
              </tr>
              <tr>
                <td>联系方式：</td>
                <td>{{ this.printform.substation.phone }}</td>
              </tr>
            </table>
            <h2>任务信息：</h2>
            <el-table :data="this.printform.task.products" >
              <el-table-column label="开始号码" align="center" prop="actualNumber" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <dict-tag  :value="this.printform.task.actualNumber"/>
                </template>
              </el-table-column>
              <el-table-column label="开始号码" align="center" prop="actualNumber" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <dict-tag  :value="scope.row.actualNumber"/>
                </template>
              </el-table-column>
              <el-table-column label="开始号码" align="center" prop="actualNumber" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <dict-tag  :value="scope.row.actualNumber"/>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </form>
      </div>
        <div v-if="!receipt">
            <!-- 提示当前任务操作 -->
            <div class="alert">
                <p v-if="opType !== ''">正在进行的任务单操作是</p>
                <p v-else>正在查看所有任务单</p>
                <el-select v-model="opType" class="select" placeholder="选择任务单操作" @change="handleOpChange" clearable
                    @clear="handleOpChange">
                    <el-option v-for="item in opTypeOption" :key="item" :label="item" :value="item" />
                </el-select>
            </div>
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
                        <el-form-item class="form-item" label="快递员编号" v-if="this.opType !== '' && this.opType !== '分配任务'">
                            <el-input v-model="listQuery.courierId" placeholder="快递员编号"
                                style="width: 200px; margin-right: 5px" class="filter-item" />
                        </el-form-item>
                        <el-form-item class="form-item">
                            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
                                查询
                            </el-button>
                            <el-button class="filter-item" type="primary" icon="el-icon-document-add"
                                @click="handleAssignSubInvoice">
                                分站发票领用
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
                    <!-- 按钮 -->
                    <el-table-column label="操作" align="center" min-width="400" class-name="small-padding fixed-width"
                        fixed="right">
                        <template slot-scope="{ row, $index }">
                            <el-button type="primary" plain @click="handleTask(row)">
                                操作任务单
                            </el-button>
                            <el-button type="primary" plain @click="deleteTask(row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <Pagination v-show="total > 0" :total="total" :page.sync="pageInfo.pageNum" :limit.sync="pageInfo.pageSize"
                    @pagination="getPageList" />
            </el-card>

            <!-- 选择快递员 -->
            <el-dialog title="选择快递员" :visible.sync="courierDialogVisible" @before-close="this.task = {}" width="70%">
                <!-- <SelectCourier ref="SelectCourier" v-if="courierDialogVisible" :subId="this.subId">
                </SelectCourier> -->
                <UserTable v-if="courierDialogVisible" ref="SelectCourier" role="COURIER" opType="查看快递员" :subId="subId">
                </UserTable>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="close">取消</el-button>
                    <el-button type="primary" @click="assignTask">分配</el-button>
                </span>
            </el-dialog>
            <!--发票领用-->
            <el-dialog title="发票领用" :visible.sync="invoicesDialogVisible" @before-close="this.task = {}" width="70%">
              <Invoices v-if="invoicesDialogVisible" :task="this.task"></Invoices>
              <span slot="footer" class="dialog-footer">
                <el-button @click="close">取消</el-button>
              </span>
            </el-dialog>
            <!--分站发票领用-->
            <el-dialog title="分站发票领用" :visible.sync="invoiceDialogVisible" @before-close="this.task = {}" width="70%">
              <Invoice v-if="invoiceDialogVisible"></Invoice>
              <span slot="footer" class="dialog-footer">
                  <el-button @click="close">取消</el-button>
                </span>
            </el-dialog>
        </div>
        <!-- 回执录入 -->
        <div v-else>
            <Receipt @close="submited(success)" :payment="this.task && this.task.taskType === '收款'"></Receipt>
        </div>

    </div>
</template>
<script>

import { getTaskList, assign, listHanding, takeProducts, deleteTask } from '@/api/sub-task'
import Pagination from '@/components/Pagination'
import SelectCourier from './selectCourier.vue'
import Receipt from './inputReceipt.vue'
import { getColumn, getOption } from '@/components/detail/module/taskColumn'
import Task from '@/components/detail/task.vue'
import UserTable from './userTable'
import Invoices from "@/views/xanadu/substation/task/invoices.vue";
import Invoice from "@/views/xanadu/substation/task/invoice.vue";
import axios from "axios";
import printJS from "print-js";
import Vue from 'vue'
Vue.use(print)


export default {
    components: {Invoices, Pagination, SelectCourier, Receipt, UserTable, Task ,Invoice},
    created() {
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
            this.subId = Number(this.$cache.session.get('subProcessing'))
            this.handleOpChange(this.opType, false);
        }
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
                courierId: "",
                needInvoice: "",
            },
            printform: {
              substation:{
                address: '',
                name: '',
                phone: '',
                subwareId: ''
              },
              task: {
                courierId: '',
                createTime: '',
                customerId: '',
                deadline: '',
                deleted: '',
                deliveryAddress: '',
                needInvoice: '',
                products: {
                  actualNumber: '',
                  number: '',
                  price: ''
                },
              }
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
            invoicesDialogVisible: false,
            invoiceDialogVisible: false,
            tableColumns: undefined, //表格列
            receipt: false,  //是否展示回执录入页面
        }
    },
    methods: {
        getList(fun) {
            // 默认查询所有任务
            if (!fun) fun = getTaskList
            // 加载列表
            return new Promise((resolve, reject) => {
                fun(this.subId).then((response) => {
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
                // 日期 任务类型 任务状态 配送员
                let range = query.deadlineRange
                if (range !== null && (new Date(task.deadline) < new Date(range[0]) || new Date(task.deadline) > new Date(range[1]))) {
                    return false
                }
                if (query.taskType !== '' && task.taskType !== query.taskType) {
                    return false
                }
                if (query.taskStatus !== '' && task.taskStatus !== query.taskStatus) {
                    console.log(task.taskStatus + query.taskStatus)
                    return false
                }
                if (query.courierId != '' && (task.courierId).toString().indexOf(query.courierId) === -1) {
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
        // 获取当前操作类型对应的任务单列表
        async handleOpChange(newVal, show) {
            this.listLoading = true;
            // 修改下拉框选项
            let option = getOption(newVal)
            this.taskStatusOption = option.status
            this.taskTypeOption = option.type
            // 修改表格列
            this.tableColumns = getColumn(newVal)
            // 加载下拉框内容
            switch (newVal) {
                // 所有任务
                case '分配任务':
                    await this.getList()
                    this.opList = this.list.filter(task => task.taskStatus === '可分配')
                    break
                // list是分站进行中的任务
                case '取货':
                    await this.getList(listHanding)
                    this.opList = this.list.filter(task => {
                        if (task.taskStatus === '已分配' && ['送货', '送货收款', '换货'].includes(task.taskType))
                            return true
                    })
                    break
                // list是分站进行中的任务
                case '发票领用':
                    await this.getList(listHanding)
                    // 只有新订的收款任务和已分配且未完成的任务需要领用发票
                    this.opList = this.list.filter(task => {
                        if (['已分配', '已领货'].includes(task.taskStatus) && ['收款', '送货收款'].includes(task.taskType)
                          && task.needInvoice === true)
                            return true
                    })
                    break
                // list是分站进行中的任务
                case '打印签收单':
                    // 已分配且未完成的任务需要打印签收单
                    await this.getList(listHanding)
                    this.opList = this.list.filter(task => {
                        if (['已分配', '已领货'].includes(task.taskStatus) && ['送货', '送货收款'].includes(task.taskType))
                            return true
                    })
                    break
                // list是分站进行中的任务
                case '回执录入':
                    await this.getList(listHanding)
                    this.opList = this.list.filter(task => {
                        if ((task.taskStatus === '已领货' && ['送货', '送货收款', '换货'].includes(task.taskType))
                            || (task.taskStatus === '已分配' && ['收款', '退货'].includes(task.taskType)))
                            return true
                    })
                    break
                // 所有任务
                default:
                    await this.getList()
                    this.opList = this.list
                    break
            }
            if (this.opList.length === 0 && show) {
                this.$message({
                    type: 'error',
                    message: '没有需要操作的任务单',
                    durarion: 1000,
                });
            }
            // 查询结果
            this.queryList = this.opList
            // 分页
            this.getPageList()
            this.listLoading = false;
        },

        // 任务单操作
        handleTask(row) {
            if (this.opType === '') {
                this.$message({
                    type: 'error',
                    message: '请先选择要进行的操作',
                    durarion: 1000,
                });
                return
            }
            // 保存当前任务信息
            this.task = row
            console.log('正在操作的任务信息', row)
            // 执行对应的任务单操作
            switch (this.opType) {
                case '分配任务':
                    // 弹出对话框，展示分站快递员编号列表
                    this.courierDialogVisible = true
                    break
                case '取货':
                    this.takeTaskProducts()
                    break
                case '发票领用':
                    this.assignInvoice()
                    break
                case '打印签收单':
                    this.printSign()
                    break
                case '回执录入':
                    this.inputReceipt()
                    break
            }

        },
        // 分配任务
        assignTask() {
            let courierId = this.$refs['SelectCourier'].getIds();
            if (!courierId || courierId.length === 0) {
                this.$message({
                    type: 'error',
                    message: '请选择任务配送员',
                    durarion: 1000,
                });
                return
            } else if (courierId.length > 1) {
                this.$message({
                    type: 'error',
                    message: '只能选择一个任务配送员',
                    durarion: 1000,
                });
                return
            } else {
                assign(this.subId, courierId[0], this.task).then(res => {
                    //更新表格数据
                    this.handleOpChange(this.opType, false)
                    this.close()
                    this.$message({
                        type: 'success',
                        message: res.msg,
                        durarion: 1000,
                    });
                    // 重置表格多选框
                    this.$refs['SelectCourier'].setIds()
                }).catch()
            }
        },
        // 分配任务完成
        close() {
            // 关闭对话框
            this.task = {}
            this.courierDialogVisible = false
            this.invoiceDialogVisible = false;
            this.invoicesDialogVisible = false;
        },

        // 取货
        takeTaskProducts() {
            takeProducts(this.task.id).then(res => {
                //更新表格数据
                this.handleOpChange(this.opType, false)
                this.$message({
                    type: 'success',
                    message: res.msg,
                    durarion: 1000,
                });
            })
        },

        // 回执录入
        inputReceipt() {
            this.$cache.local.setJSON("operateTask", this.task);
            console.log(this.task)
            this.receipt = true
        },
        // 回执录入完成
        submited(success) {
            // 关闭回执页
            this.task = {}
            // 提交成功则刷新表格
            if (success) {
                this.handleOpChange(this.opType, false)
            }
            this.receipt = false
        },

        // 删除任务
        deleteTask(row) {
            if (row.taskStatus === '可分配') {
                this.$message({
                    type: 'error',
                    message: '未分配的任务不允许删除',
                    durarion: 1000,
                });
                return
            }
            deleteTask(row.id).then(res => {
                this.$message({
                    type: 'success',
                    message: res.msg,
                    durarion: 1000,
                });
                // 重新加载操作列表
                this.handleOpChange(this.opType, false)
            })
        },


        /**
         * 选中的任务信息保存在 this.task 里，字段含义在 taskColumn.js 里
         * 如果任务列表不能加载，可以使用以下的模拟任务数据
         * task: {     //模拟的任务单信息
                id: 11,
                customerId: 1,
                receiverName: "张三",
                phone: "18535423348",
                deliveryAddress: "1",
                orderId: 95,
                courierId: 2,
                numbers: 60,
                totalAmount: 420,
                deadline: 1688054400000,
                createTime: 1687879832000,
                taskType: "收款",
                taskStatus: "已分配",
                productsJson: "[{\"number\":10,\"price\":5.0,\"productId\":1,\"productName\":\"苹果\",\"refundAble\":true},{\"number\":10,\"price\":6.0,\"productId\":2,\"productName\":\"橘子\",\"refundAble\":false},{\"number\":10,\"price\":10.0,\"productId\":3,\"productName\":\"西瓜\",\"refundAble\":false},{\"number\":10,\"price\":8.0,\"productId\":4,\"productName\":\"猕猴桃\",\"refundAble\":true},{\"number\":10,\"price\":8.0,\"productId\":5,\"productName\":\"芒果\",\"refundAble\":false},{\"number\":10,\"price\":5.0,\"productId\":6,\"productName\":\"火龙果\",\"refundAble\":true}]",
                subId: 2,
                products: null,
                receiptId: null,
                deleted: false
            },
         */

        /**
         * Todo:发票领用
         * 后端需要判断一下订单是否需要发票
         */
        assignInvoice() {
            console.log('发票领用')
            this.invoicesDialogVisible = true;
        },

        // Todo:打印签收单
        printSign() {
          const id =this.task.id;
          const that = this;
          axios.get("http://localhost:8019/sub/task/printReceipt/"+id).then( function(res){
            //代表请求成功之后处理
            that.printform = res.data.data;
            console.log(that.printform);
          }).catch( function (err){
            //代表请求失败之后处理
            alert ('进入catch')
            console.log (err);
          });
          that.print();
        },
        print(){
          printJS('printJS-form-task','html')
        },
        // Todo:分站发票领用
        // 分站id是 this.subId
        handleAssignSubInvoice() {
          this.invoiceDialogVisible = true;
          console.log('分站发票领用')
        }
    },
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

.form-item {
    margin-bottom: 0px;
    height: 100%;
    /* vertical-align:middle; */
}
.receipt {
  border: 1px solid #ccc;
  background-color: #fff;
  font-family: Arial, sans-serif;
  padding: 20px;
}
.receipt-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin-top: 10px;
}
.receipt-table td {
  padding: 5px 10px;
  border: 1px solid #ccc;
}

.receipt-table td:first-child {
  font-weight: bold;
}
</style>
