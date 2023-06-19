<template>
  <div class="app-container">
    <!--筛选框-->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" >
      <el-form-item prop="status">
        <el-select v-model="queryParams.status" placeholder="发票状态" clearable>
          <el-option
            v-for="dict in options"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">筛选</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 失效原因对话框 -->
    <el-dialog :title="title" :visible.sync="open" height="300px" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" >
          <el-col :span="20">
            <el-text></el-text>
            <el-form-item label="失效原因" prop="dstate" width="100px">
              <el-input  type="textarea":rows="2" v-model="form.details" maxlength="30"/>
            </el-form-item>
          </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm(form)">确 定</el-button>
      </div>
    </el-dialog>

    <!--发票列表-->
    <el-table v-loading="loading" :data="invoiceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" width="50" />
      <el-table-column label="开始号码" align="center" prop="startNumber" width="200">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_regisinvoice_endnumber" :value="scope.row.startNumber"/>
        </template>
      </el-table-column>
      <el-table-column label="结束号码" align="center" prop="endNumber" width="200">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_regisinvoice_endnumber" :value="scope.row.endNumber"/>
        </template>
      </el-table-column>
      <el-table-column label="批次" align="center" prop="batch" width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_regisinvoice_batch" :value="scope.row.batch"/>
        </template>
      </el-table-column>
      <el-table-column label="本数" align="center" prop="total" width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_regisinvoice_total" :value="scope.row.total"/>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="dstate" width="100">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.dstate === '已失效' ? 'danger' : 'success'"
            disable-transitions>{{scope.row.dstate}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="失效原因" align="center" prop="details" width="200">
        <template slot-scope="scope">
          <dict-tag  :options="dict.type.sys_regisinvoice_details" :value="scope.row.details"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="danger"
            @click="changedstate(scope.row)"
          >失效</el-button>
          <el-button
            size="small"
            type="danger"
            @click="changedstate1(scope.row)"
          >撤销失效</el-button>
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
  </div>
</template>

<script>


import axios from 'axios'


export default {
  name: "RegisInvoice",
  dicts: ['sys_regisinvoice_details', 'sys_regisinvoice_employee', 'sys_regisinvoice_substationId', 'sys_regisinvoice_batch','sys_regisinvoice_endnumber','sys_regisinvoice_startnumber','sys_regisinvoice_total'],
  components: {},
  props: [],
  data: function () {
    return {
      //发票状态
      options: [{
        value: '选项1',
        label: '已失效'
      }, {
        value: '选项2',
        label: '生效中'
      }],
      // 显示搜索条件
      showSearch: true,
      // 表单
      form: {},
      // 弹出层标题
      title: "",
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 发票表格数据
      invoiceList: [],
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      const that = this
      this.loading = true;
      axios.get("http://localhost:8010/invoice/list").then( function(res){
        //代表请求成功之后处理
        console.log(res);
        that.total = res.data.data.length;
        that.invoiceList = res.data.data;
        that.loading = false;
      }).catch( function (err){
        //代表请求失败之后处理
        alert ('进入catch')
        console.log (err);
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = undefined;
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    changedstate(row){
      this.open = true;
      const id = row.id || this.ids;
      const that = this
      axios.get("http://localhost:8010/invoice/getinvoice/"+id).then( function(res){
        //代表请求成功之后处理
        console.log(res);
        that.form = res.data.data;
      }).catch( function (err){
        //代表请求失败之后处理
        alert ('进入catch')
        console.log (err);
      });
    },
    changedstate1(row){
      const that = this
      row.dstate = '生效中';
      row.state = '未领用';
      row.details = '无';
      axios.post("http://localhost:8010/invoice/update/",row)
        .then(function(promise){
          that.reset();
          console.log(that.form);
          that.$message.success('提交成功');
          that.open = false;
        }).catch( function (err){
        //代表请求失败之后处理
        console.log (err);
        that.$message.error('提交失败');
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.noticeId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 提交按钮 */
    submitForm: function(form) {
      const that = this
      that.form.dstate = '已失效';
      that.form.state = '已失效';
      axios.post("http://localhost:8010/invoice/update/",form)
        .then(function(promise){
          that.reset();
          console.log(form);
          that.$message.success('提交成功');
          that.open = false;
        }).catch( function (err){
        //代表请求失败之后处理
        console.log (err);
        that.$message.error('提交失败');
      });
      that.open = false;
    }
  },
};
</script>
