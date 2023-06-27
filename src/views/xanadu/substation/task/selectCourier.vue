<template>
    <div class="app-container">
        <el-table key=0 :data="list" fit highlight-current-row @current-change="newVal=>selectedCourier=newVal" 
            style="width: 100%" v-loading="listLoading" border>
            <el-table-column label="快递员编号" align="center">
                <template slot-scope="{ row }">
                    <span>{{
                        row
                    }}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

import { listCouriers } from '@/api/sub-task'
export default {
    name: 'SelectCourier',
    props: ['subId'],
    created() {
        this.getist()
    },
    data() {
        return {
            list: [],
            listLoading: true,
            selectedCourier:undefined,
        }
    },
    methods: {
        getist() {
            this.listLoading = true
            listCouriers(this.subId).then(res => {
                this.list = res.data
                this.listLoading = false
            }).catch(this.listLoading = false)
        },
        getSelectedCourier(){
            return this.selectedCourier
        }
    }
}
</script>