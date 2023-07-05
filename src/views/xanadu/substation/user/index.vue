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
        <div style="display: flex; justify-content: space-between;">
            <el-select v-model="role" class="select">
                <el-option v-for="item in roleOption" :key="item" :label="item" :value="item" />
            </el-select>
            <el-select v-model="opType" class="select">
                <el-option v-for="item in opTypeOption" :key="item" :label="item" :value="item" />
            </el-select>
            <el-button type="primary" @click="handleAssign" style="margin-right: 5px;"
                v-if="this.opType.includes('添加')">添加到分站</el-button>
            <el-button type="primary" @click="handleDelete" style="margin-right: 5px;"
                v-if="this.opType.includes('查看')">移出分站</el-button>
        </div>
        <UserTable :role="activeName" :opType="opType" :subId="subId" ref="userTable"></UserTable>
    </div>
</template>

<script>

import UserTable from './userTable'
import { addCouriers, deleteCourier } from '@/api/sub-user.js'
import { updateSubstation,fetchSubStationById } from '@/api/sub.js'

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
        }
        // 只有管理员可以管理分站长
        if(this.$auth.hasRole("admin")){
            
            this.roleOption=['快递员','分站管理员']
        }else{
            this.roleOption=['快递员']
        }
        this.setOpOption()
    },
    data(){
        return{
            subId:'',   //分站id
            role:'快递员',
            activeName: "COURIER",
            roleMap:{COURIER:'快递员',SUBSTATION_MANAGER:'分站管理员'},
            opType:'查看快递员',
            opTypeOption:[],
            roleOption:['快递员','分站管理员'],
        }
    },
    methods:{

        // 添加管理员/快递员到分站
        handleAssign(){
            // 获取多选框选中的id列表
            let ids=this.$refs.userTable.getIds()
            // 判断是管理员还是快递员
            let fun=new Function()
            switch (this.activeName) {
                // 添加管理员到分站
                case 'SUBSTATION_MANAGER':
                    // 获取当前分站信息
                    fetchSubStationById(this.subId).then(res=>{
                        // 添加管理员ID
                        let substation=res.data
                        this.$refs.userTable.getAllIds().then(allIds=>{
                            substation.adminIds=allIds?allIds.concat(ids):ids
                            // 更新分站信息
                            updateSubstation(substation).then(res=>{
                                this.$message({
                                    type: 'success',
                                    message: res.msg,
                                    durarion: 1000,
                                });
                                // 重置表格多选框
                                this.$refs.userTable.setIds()
                                // 刷新表格数据
                                this.$refs.userTable.getList()
                            })
                        })
                    })
                    break
                // 添加快递员到分站
                case 'COURIER':
                    addCouriers(this.subId,ids).then(res=>{
                        this.$message({
                                type: 'success',
                                message: res.msg,
                                durarion: 1000,
                            });
                        // 重置表格多选框
                        this.$refs.userTable.setIds()
                        // 刷新表格数据
                        this.$refs.userTable.getList()
                    })
                    break
            }
        },

        // 删除分站管理员/快递员
        handleDelete(){
            // 获取多选框选中的id列表
            let ids=this.$refs.userTable.getIds()
            if(!ids || ids.length<1){
                this.$message({
                    type: 'error',
                    message: '请至少选中一条记录',
                    durarion: 1000,
                });
            }
            // 判断是管理员还是快递员
            let fun=new Function()
            switch (this.activeName) {
                // 删除分站管理员
                case 'SUBSTATION_MANAGER':
                    // 获取当前分站信息
                    fetchSubStationById(this.subId).then(res=>{
                        // 删除选中的管理员ID
                        let substation=res.data
                        this.$refs.userTable.getAllIds().then(allIds=>{
                            substation.adminIds=allIds.filter(id=>{
                            let index=ids.indexOf(id)
                            if(index!==-1){
                                return false
                            }
                            return true
                            })
                            // 更新分站信息
                            updateSubstation(substation).then(res=>{
                                this.$message({
                                    type: 'success',
                                    message: res.msg,
                                    durarion: 1000,
                                });
                                // 重置表格多选框
                                this.$refs.userTable.setIds()
                                // 刷新表格数据
                                this.$refs.userTable.getList()
                            })
                        })
                    })
                    break
                // 删除分站快递员
                case 'COURIER':
                    if(ids.length>1){
                        this.$message({
                            type: 'error',
                            message: '暂不支持多选删除快递员',
                            durarion: 1000,
                        });
                        return
                    }
                    deleteCourier(this.subId,ids[0]).then(res=>{
                        this.$message({
                                type: 'success',
                                message: res.msg,
                                durarion: 1000,
                            });
                        // 重置表格多选框
                        this.$refs.userTable.setIds()
                        // 刷新表格数据
                        this.$refs.userTable.getList()
                    })
                    break
            }
        },
        // 修改下拉框内容
        setOpOption(){
            this.opTypeOption=[`查看${this.roleMap[this.activeName]}`,`添加${this.roleMap[this.activeName]}`]
            this.opType=this.opTypeOption[0]
        }
    },
    watch:{
        role(){
            if(this.role==='快递员')
                this.activeName='COURIER'
            else
                this.activeName='SUBSTATION_MANAGER'
            this.setOpOption()
        }
    },
};
</script>
