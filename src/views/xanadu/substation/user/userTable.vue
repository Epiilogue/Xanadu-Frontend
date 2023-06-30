<template>
  <div class="app-container">
    <el-row :gutter="30">
      <!--用户数据-->
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="queryParams.userName" placeholder="请输入用户名称" clearable style="width: 240px"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phonenumber">
          <el-input v-model="queryParams.phonenumber" placeholder="请输入手机号码" clearable style="width: 240px"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
            range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-col :span="16">
        <el-table v-loading="loading" ref="multipleTable" :data="userList" @select="handleSelect" >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="用户编号" align="center" key="userId" prop="userId" />
          <el-table-column label="用户名称" align="center" key="userName" prop="userName" 
            :show-overflow-tooltip="true" />
          <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName" 
            :show-overflow-tooltip="true" />
          <el-table-column label="部门" align="center" key="deptName" prop="dept.deptName" 
            :show-overflow-tooltip="true" />
          <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber" 
            width="120" />
          <el-table-column label="创建时间" align="center" prop="createTime"  width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
          </el-table-column>
        </el-table>

        <Pagination v-show="total > 0" :total="total" :page.sync="pageInfo.pageNum" :limit.sync="pageInfo.pageSize"
          @pagination="getPageList" />
      </el-col>
      <el-col :span="8">
        <div class="right">
          <div class="title"><span>已选</span><span class="clear" @click="handleCLearAll">清空全部</span></div>
          <template v-if="selectedAccount.length > 0">
            <div class="one-selected" v-for="(item, index) in selectedAccount" :key="index">
              <span>{{ item.userId-- - item.userName }}</span>
              <span @click="cancelSelect(item, index)">X</span>
            </div>
          </template>
          <div v-else class="no-selected">暂无选择</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
  
<script>

import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getSubCourierList, getCourierUserList, addCouriers, deleteCourier, getSubstationUserList, getSubstationManager } from '@/api/sub-user.js'
import { AddSubstation, updateSubstation } from '@/api/sub.js'

export default {
  name: "UserTable",
  props: ['role', 'opType', 'subId'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: [],
      // 查询后用户表格数据
      queryList: [],
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 查询参数
      queryParams: {
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
      },
      // 分页参数
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
      },
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: true },
        { key: 1, label: `用户名称`, visible: true },
        { key: 2, label: `用户昵称`, visible: true },
        { key: 3, label: `部门`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 6, label: `创建时间`, visible: true }
      ],
      // 多选
      // 二位数组，暂存每页点击过的数据
      stateArr: [],
      // 已经选择的数据
      selectedAccount: [],
    };
  },
  created() {
    console.log(this.role, this.opType, this.subId)
    this.getList();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      if (!this.subId) {
        this.$message({
          type: 'error',
          message: '请先在分站管理处设置要操作的分站',
          durarion: 1000,
        });
        return
      }
      // 加载表格数据
      this.loading = true;
      let fun = new Function()
      if (this.opType.includes('查看')) {
        switch (this.role) {
          case 'SUBSTATION_MANAGER':
            fun = getSubstationManager
            break
          case 'COURIER':
            fun = getSubCourierList
            break
        }
        fun(this.subId).then(res => {
          this.userList = res.data
        })
      } else if(this.opType.includes('添加')){
        switch (this.role) {
          case 'SUBSTATION_MANAGER':
            fun = getSubstationUserList
            break
          case 'COURIER':
            fun = getCourierUserList
            break
        }
        fun().then(res => {
          this.userList = res.data
        })
      }
      console.log('表格数据',this.userList)
      // if(this.userList.length===0){
      //   this.loading = false;
      //   this.$message({
      //     type: 'success',
      //     message: '暂无数据',
      //     durarion: 1000,
      //   });
      //   return
      // }
      // 分页
      this.queryList = this.userList
      this.getPageList()
      this.loading = false;
    },
    // 分页
    getPageList() {
      this.total = this.queryList.length
      let pageNum = this.pageInfo.pageNum
      let pageSize = this.pageInfo.pageSize
      this.pageList = this.queryList.slice((pageNum - 1) * pageSize, pageNum * pageSize)
      this.showPreSelected(pageNum)
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.listLoading = true;
      this.queryList = this.opList.filter((user) => {
        // 查询条件
        let query = this.queryParams
        // 用户名称 手机号码 创建时间 **状态**
        let range = this.dateRange
        if (range !== null && (new Date(user.createTime) < new Date(range[0]) || new Date(user.createTime) > new Date(range[1]))) {
          return false
        }
        if (query.userName !== '' && user.userName.indexOf(query.userName) === -1) {
          return false
        }
        if (query.phonenumber !== '' && user.phonenumber !== query.phonenumber) {
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
          message: '没有符合条件的用户',
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
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.queryParams.deptId = undefined;
      this.$refs.tree.setCurrentKey(null);
      this.handleQuery();
    },

    // 清空全部
    handleCLearAll() {
      this.stateArr[this.pageInfo.pageNum - 1] && this.stateArr[this.pageInfo.pageNum - 1].forEach(item => {
        this.$refs.multipleTable.toggleRowSelection(this.userList[item.index], false)
      })
      this.stateArr = Array(this.totalPage).fill([])
      this.selectedAccount = []
    },
    // 选择事件
    handleSelect(selection, row) {
      this.stateArr[this.pageInfo.pageNum - 1] = selection
      this.selectedAccount = this.stateArr.flat()
    },
    // 取消选择
    cancelSelect(item, index) {
      this.selectedAccount.splice(index, 1)
      const stateArrIndex = this.stateArr[this.pageInfo.pageNum - 1].findIndex(el => el.index === item.index)
      this.stateArr[this.pageInfo.pageNum - 1].splice(stateArrIndex, 1)
      this.$refs.multipleTable.toggleRowSelection(this.userList[item.index], false)
    },
    // 回显数据，调用的地方是在获取分页数据之后
    showPreSelected(page) {
      // $nextTick在下次dom更新循环结束之后回调，在修改数据之后使用，在回调中可获取更新后的Dom
      this.$nextTick(() => {
        this.stateArr[page - 1] && this.stateArr[page - 1].forEach(item => {
          this.$refs.multipleTable.toggleRowSelection(this.userList[item.index], true)
        })
      })
    },
  },

  computed: {
    // 加载表格
    change() {
      this.getList()
    }
  }
};
</script>

<style scoped>

.title{
  /* border:0.5px solid ; */
  display: flex;
  justify-content: space-between;
}

.clear{
  color: cornflowerblue;
}
</style>