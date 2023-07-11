<template>
  <div class="app-container">
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
    <el-table v-loading="loading" :row-key="(row) => row.id" ref="multipleTable" :data="userList" @select="handleSelect"
      @select-all="handleSelect">
      <el-table-column type="selection" :reserve-selection="true" width="50" align="center" />
      <el-table-column label="用户编号" align="center" key="userId" prop="userId" :show-overflow-tooltip="true"/>
      <el-table-column label="用户名称" align="center" key="userName" prop="userName" :show-overflow-tooltip="true" />
      <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName" :show-overflow-tooltip="true" />
      <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber"  :show-overflow-tooltip="true"/>
      <el-table-column label="创建时间" align="center" prop="createTime" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职务" align="center" key="remark" prop="remark" width="160" class-name="small-padding fixed-width">
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination v-show="total > 0" :total="total" :page.sync="pageInfo.pageNum" :limit.sync="pageInfo.pageSize"
      @pagination="getPageList" />
  </div>
</template>

<script>

import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getSubCourierList, getCourierUserList, getSubstationUserList, getSubstationManager } from '@/api/sub-user.js'

export default {
  name: "UserTable",
  props: { role: '', opType: '', subId: '' },
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
        phoneNumber: undefined,
        status: undefined,
        deptId: undefined
      },
      // 分页参数
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
      },
      // 多选
      ids: [],
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: true },
        { key: 1, label: `用户名称`, visible: true },
        { key: 2, label: `用户昵称`, visible: true },
        { key: 3, label: `部门`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 6, label: `创建时间`, visible: true }
      ],
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
          { min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" },
          { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    console.log(this.role, this.opType, this.subId)
    this.getList()
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      // 未设置分站时不加载数据
      if (!this.subId) {
        this.loading = false;
        return
      }
      // 加载表格数据
      this.loading = true;
      let fun = new Function()
      // 查看用户（快递员、分站长）
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
        // 添加对应用户到分站
      } else if (this.opType.includes('添加')) {
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
      // 分页
      this.queryList = this.userList
      this.getPageList()
      console.log('用户信息', this.userList)
      this.loading = false;
    },
    // 分页
    getPageList() {
      if (!this.queryList || this.queryList.length === 0) {
        this.total = 0
        return
      }
      this.total = this.queryList.length
      let pageNum = this.pageInfo.pageNum
      let pageSize = this.pageInfo.pageSize
      this.pageList = this.queryList.slice((pageNum - 1) * pageSize, pageNum * pageSize)
    },
    /** 搜索按钮操作 */
    handleQuery() {
      if (!this.userList) return
      this.listLoading = true;
      this.queryList = this.userList.filter((user) => {
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
      if (this.total === 0) {
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

    // 选择事件
    handleSelect(rows, row) {
      this.ids = rows.map(item => item.userId);
      console.log(this.ids)
    },

    // 获取选中的用户ID
    getIds() {
      return this.ids
    },
    // 获取所有用户ID
    getAllIds() {
      let fun = new Function()
      switch (this.role) {
        case 'SUBSTATION_MANAGER':
          fun = getSubstationManager
          break
        case 'COURIER':
          fun = getSubCourierList
          break
      }
      return new Promise(resolve => {
        fun(this.subId).then((res) => {
          let list = res.data
          let allId = []
          if (list)
            allId = list.map(item => item.userId)
          resolve(allId)
        })
      });
    },
    // 取消表格选中
    setIds() {
      // this.$refs.multipleTable.rows.forEach(row => {
      //   this.$refs.multipleTable.toggleRowSelection(row,false)
      // })
      this.$refs.multipleTable.clearSelection()
      this.ids = []
    }
  },

  watch: {
    // 加载表格数据
    // role: {
    //   handler(newValue, oldValue) {
    //     console.log('props', newValue)
    //     this.getList()
    //   },
    // },
    opType: {
      handler(newValue, oldValue) {
        console.log('props', newValue)
        this.getList()
        this.setIds()
      },
    }
  }
};
</script>
