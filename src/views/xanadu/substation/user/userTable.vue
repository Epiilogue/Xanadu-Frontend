<template>
  <div class="app-container">
    <!--用户数据-->
    <el-col>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="用户名称" prop="userName">
          <el-input
            v-model="queryParams.userName"
            placeholder="请输入用户名称"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="phonenumber">
          <el-input
            v-model="queryParams.phonenumber"
            placeholder="请输入手机号码"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="用户状态"
            clearable
            style="width: 240px"
          >
            <el-option
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['system:user:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['system:user:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:user:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="info"
            plain
            icon="el-icon-upload2"
            size="mini"
            @click="handleImport"
            v-hasPermi="['system:user:import']"
          >导入</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['system:user:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="用户编号" align="center" key="userId" prop="userId" v-if="columns[0].visible" />
        <el-table-column label="用户名称" align="center" key="userName" prop="userName" v-if="columns[1].visible" :show-overflow-tooltip="true" />
        <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName" v-if="columns[2].visible" :show-overflow-tooltip="true" />
        <el-table-column label="角色" align="center" key="remark" prop="remark" v-if="columns[3].visible" :show-overflow-tooltip="true" />
        <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber" v-if="columns[4].visible" width="120" />
        <el-table-column label="状态" align="center" key="status" v-if="columns[5].visible">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[6].visible" width="160">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="160"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope" v-if="scope.row.userId !== 1">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:user:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:user:remove']"
            >删除</el-button>
            <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)" v-hasPermi="['system:user:resetPwd', 'system:user:edit']">
              <el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="handleResetPwd" icon="el-icon-key"
                                  v-hasPermi="['system:user:resetPwd']">重置密码</el-dropdown-item>
                <el-dropdown-item command="handleAuthRole" icon="el-icon-circle-check"
                                  v-hasPermi="['system:user:edit']">分配角色</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-col>


    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入用户昵称" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="form.role" multiple placeholder="请选择角色">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleName"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" label="用户名称" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入用户名称" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入用户密码" type="password" maxlength="20" show-password/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="form.sex" placeholder="请选择性别">
                <el-option
                  v-for="dict in dict.type.sys_user_sex"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的用户数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
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
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
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
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      subId: 0,
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData"
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
      },
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: true },
        { key: 1, label: `用户名称`, visible: true },
        { key: 2, label: `用户昵称`, visible: true },
        { key: 3, label: `角色`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 5, label: `状态`, visible: true },
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
    this.subId=this.$cache.session.get('subProcessing')
    if (!this.subId) {
      return
    }
    this.getList();
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
