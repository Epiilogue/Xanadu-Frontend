<script>

/**
 * 角色————————————————————————————————————————————————————————————————
 * 超级管理员：分站增删查改，查看分站长，添加分站管理人员
 * 分站管理员：分站查，查看分站快递员，批量添加快递员到分站、任务处理、发票领用
 * 侧边栏——————————————————————————————————————————————————————————————
 * 分站管理：开关设置当前正在管理的分站
 * 分站用户：角色分配：0.设置要操作的分站 1.点击侧边栏项 2.选择要分配的角色（分站长/快递员） 3.展示分站对应角色用户
 *                  4.如果没有设置要操作的分站，就手动输入 
 *                  5.选择角色分配，查看未分配角色的用户
 *                  6.多选后点击添加到分站
 *          快递员：本日投递情况
 * 任务处理：0.设置要操作的分站 1.点击侧边栏项 3.选择并完成任务操作（任务分配、领货、**发票领用**、**打印签收单**、回执录入）
 * 数据大屏：客户满意度、商品订购前5、某类或某个商品交易金额统计
 * 快递员ID：取货？
 * 发票？
 * 主要图表—————————————————————————————————————————————————————————————
 * 分站ID：
 *      表：任务、快递员、发票、分站管理员
 *      图：客户满意度、商品订购前5、某类或某个商品交易金额统计
 * 快递员ID：
 *      图：本日投递情况
 */
</script>


<template>
    <div class="app-container">
        <el-tabs tab-position="top" v-model="activeName" @tab-click="changeTab" style="height: 100%;">
            <el-tab-pane label="管理员" name="master">
                <div style="display: flex; justify-content: space-between;">
                    <el-select v-model="opType" class="select" @change="handleOpChange">
                        <el-option v-for="item in opTypeOption" :key="item" :label="item" :value="item" />
                    </el-select>
                    <el-button type="primary" @click="handleAssign" style="margin-right: 5px;">添加到分站</el-button>
                </div>
                <UserTable></UserTable>
            </el-tab-pane>
            <el-tab-pane label="快递员" name="courier">
                <div style="display: flex; justify-content: space-between;">
                    <el-select v-model="opType" class="select" @change="handleOpChange">
                        <el-option v-for="item in opTypeOption" :key="item" :label="item" :value="item" />
                    </el-select>
                    <el-button type="primary" @click="handleAssign" style="margin-right: 5px;">添加到分站</el-button>
                </div>
                <UserTable></UserTable>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>

import UserTable from './userTable'
export default {
    components:{UserTable},
    created() {
        let sub=this.$cache.session.get('subProcessing')
        if (!sub) {
            // 未设置分站
            // this.pageList = []  表格无数据
            this.$message({
                type: 'error',
                message: '请先在分站管理处设置要操作的分站',
                durarion: 1000,
            });
            return
        }else{
            this.subId = Number(this.$cache.session.get('subProcessing'))
            this.handleOpChange(this.opType, false);
        }
    },
    data(){
        return{
            subId:'',   //分站id
            activeName: "courier",
            opType:'查看用户',
            opTypeOption:['查看用户','角色分配']
        }
    },
    methods:{
        changeTab(){
            // 切换tab
        },

        handleOpChange(){
            // 加载对应的表格
        },

        // 设置分站管理员/快递员
        handleAssign(){
            // 获取多选框选中的id列表

            // 判断是管理员还是快递员

            // 调用对应的接口
        }
    }
};
</script>