<!-- 订单/调度的分站列表 -->
<template>
    <div class="app-container">
        <div class="filter-container" v-if="searchAble">
            <el-form :inline="true">
                <el-form-item class="form-item" label="地址">
                    <el-input v-model="listQuery.address" placeholder="分站地址" style="width: 200px; margin-right: 5px" />
                </el-form-item>
                <el-form-item class="form-item" label="名称">
                    <el-input v-model="listQuery.name" placeholder="分站名称" style="width: 200px; margin-right: 5px" />
                </el-form-item>
                <el-form-item class="form-item">
                    <el-button type="primary" icon="el-icon-search" @click="handleFilter">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :key="tableKey" v-loading="listLoading"
            :data="queryList.slice((currentPage - 1) * pageSize, currentPage * pageSize)" border fit highlight-current-row
            style="width: 100%;" :row-key="(row) => row.id">
            <el-table-column label="ID" prop="id" align="center" width="80"></el-table-column>
            <el-table-column label="名称" prop="name" min-width="80px" align="center"></el-table-column>
            <el-table-column label="地址" prop="address" min-width="50px" align="center"></el-table-column>
            <el-table-column label="电话" prop="phone" min-width="50px" align="center"></el-table-column>
            <el-table-column label="分库Id" min-width="50px" prop="subwareId" align="center">
              <template slot-scope="{row}">
                <subware :id="row.subwareId"></subware>
              </template>
            </el-table-column>

            <!-- 选中对应分站 -->
            <el-table-column :label=switchTitle min-width="100" align="center">
                <template slot-scope="{ row }">
                    <el-switch :value="row.id === selectedSub" @change="handleChange(row)" :disabled="id!==-1">
                    </el-switch>
                </template>
            </el-table-column>

        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1"
            :page-sizes="[10,15,20]" :page-size="15" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

    </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import {fetchAllSubStation} from '@/api/sub'
import Subware from "@/components/detail/subware.vue";

export default {
    name: 'substation',
  components: {Subware},
    props: ['switchTitle','searchAble','id'],
    directives: { waves },
    data() {
        return {

            // 是否已确定处理事务的分站id,未设置为''
            selectedSub: '',

            tableKey: 0,
            list: [],
            queryList: [],
            total: 0,
            listLoading: true,
            currentPage: 1,//默认显示第一页
            pageSize: 15,//默认每页显示5条
            listQuery: {
                address: '',
                name: '',
            },
            rules: {
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                phone: [{ required: true, message: '请选择电话', trigger: 'blur' }],
                address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
                subwareId: [{ required: true, message: '请输入分库Id', trigger: 'blur' }],
            },
            dialogFormVisible: false,
            dialogStatus: '',
            textMap: {
                update: 'Edit',
                create: 'Create'
            },
            temp: {
                id: undefined,
                name: '',
                price: '',
                address: '',
                subwareId: '',
                userId: '',
                phone: '',
            },
            ids: [],
        }
    },
    created() {
        // 获取正在处理的分站id
        // let subId = this.$cache.session.get('subProcessing')
        let subId=this.id
        this.selectedSub = subId ? Number(subId) : ''
        this.getList()
    },
    // 缓存处理事务的分站id
    beforeDestroy() {
        if (this.selectedSub) {
            this.$cache.session.set('subProcessing', this.selectedSub)
        } else if (this.$cache.session.get('subProcessing')) {
            this.$cache.session.remove('subProcessing')
        }
    },
    methods: {

        // 获取选中的分站ID
        getSubId() {
            if(this.id!==-1) return this.id
            return this.selectedSub
        },

        //分页组件修改页面容量
        handleSizeChange(newSize) {
            this.pageSize = newSize
        },
        // 分页组件监听页码值改变的事件
        handleCurrentChange(newPage) {
            this.currentPage = newPage
        },

        // 设置处理事务的分站id
        handleChange(row) {
            if (row.id === this.selectedSub) {
                // 取消选中
                this.selectedSub = ''
            } else {
                // 选中
                this.selectedSub = row.id
            }
        },

        getList() {
            this.listLoading = true
            fetchAllSubStation().then(response => {
                this.list = response.data
                this.total = response.data.length
                this.queryList = this.list
                this.listLoading = false
            })
        },
        handleFilter() {
            this.listLoading = true;
            this.queryList = this.list.filter((sub) => {
                // 查询条件
                let query = this.listQuery
                // 名称 地址
                if (query.name !== '' && sub.name.indexOf(query.name) === -1) {
                    return false
                }
                if (query.address !== '' && sub.address.indexOf(query.address) === -1) {
                    return false
                }
                return true
            });
            this.total = this.queryList.length
            this.listLoading = false;
        },
    }
}
</script>
