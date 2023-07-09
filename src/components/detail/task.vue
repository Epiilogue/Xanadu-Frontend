<template>
    <div>
        <div class="link-type" @click="convert">
            {{ id }}
        </div>
        <el-dialog title="任务单详情查看" :visible.sync="dialogFormVisible" style="padding-left: 5%" width="70%">
            <el-descriptions :column="3" border style="margin-bottom: 15px;">
                <el-descriptions-item v-for="field in formFields" :label="field.label" >{{
                    temp[field.prop]
                }}</el-descriptions-item>
            </el-descriptions>
        </el-dialog>
    </div>
</template>
    
<script>

import { tableColumns } from './module/taskColumn'
export default {
    name: 'task',
    props: ['id', 'task'],
    data() {
        return {
            dialogFormVisible: false,
            formFields: tableColumns,    //不展示任务单编号
            temp:JSON.parse(JSON.stringify(this.task)),
        };
    },
    methods:{
        // 格式转换
        convert(){
            this.formFields.slice(0,1)
            this.temp.deadline=this.temp.deadline?this.$moment(new Date(this.temp.deadline)).format("YYYY-MM-DD"):''
            this.temp.createTime=this.temp.createTime?this.$moment(new Date(this.temp.createTime)).format("YYYY-MM-DD"):''
            this.dialogFormVisible = true
        }
    }
}
</script>
  
<style scoped></style>
  