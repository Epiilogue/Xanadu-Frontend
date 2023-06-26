<template>
  <div class="app-container" >
    <!--  上方表单  -->
    <el-form :model="formData" ref="elForm" :rules="rules" size="small"  label-width="68px">
          <el-form-item label="开始号码" prop="startNumber" label-width="100px">
            <el-input  v-model="formData.startNumber" placeholder="DW20230606005" :maxlength="13"
                      show-word-limit clearable prefix-icon='el-icon-tickets'></el-input>
          </el-form-item>
          <el-form-item label="结束号码" prop="endNumber" label-width="100px">
            <el-input v-model="formData.endNumber" placeholder="DW20230606020" :maxlength="13"
                      show-word-limit clearable prefix-icon='el-icon-tickets' ></el-input>
          </el-form-item>
        <div style="display: flex">
          <el-form-item label="批次" prop="batch" style="margin-left: 28px">
            <el-input v-model="formData.batch"  placeholder="输入批次"
                      prefix-icon='el-icon-paperclip' ></el-input>
          </el-form-item>
          <el-form-item label="本数" prop="total" style="margin-left: 28px">
            <el-input v-model="formData.total"  placeholder="输入本数"
                      prefix-icon='el-icon-paperclip' ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" icon="el-icon-success" size="small" @click="submitForm(formData)" >    提交    </el-button>
          </el-form-item>


          <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" style="margin-left: 100px">
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
        </div>
      </el-form>


    <!--  发票列表  -->
    <el-table v-loading="loading" :data="invoiceList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" align="center" prop="id" width="50" />
      <el-table-column label="开始号码" align="center" prop="startNumber" width="240">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_regisinvoice_endnumber" :value="scope.row.startNumber"/>
        </template>
      </el-table-column>
      <el-table-column label="结束号码" align="center" prop="endNumber" width="240">
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
      <el-table-column label="创建时间" align="center" prop="time" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.time, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登记状态" align="center" prop="registration" width="100">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.registration === '已登记' ? 'success' : 'warning'"
            disable-transitions>{{scope.row.registration}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="success"
            @click="handleState1(scope.row)"
          >发票登记</el-button>
          <el-button
            size="small"
            type="warning"
            @click="handleState2(scope.row)"
          >撤销登记</el-button>
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
import {right} from "core-js/internals/array-reduce";

export default {
  name: "RegisInvoice",
  dicts: ['sys_normal_disable', 'sys_regisinvoice_registration', 'sys_regisinvoice_batch','sys_regisinvoice_endnumber','sys_regisinvoice_startnumber','sys_regisinvoice_total'],
  components: {},
  props: [],
  data: function () {
    return {
      //发票状态
      options: [{
        value: '选项1',
        label: '已登记'
      }, {
        value: '选项2',
        label: '未登记'
      }],
      // 显示搜索条件
      showSearch: true,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 表单
      form: {},
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
        status: undefined,
      },
      formData: {
        startNumber: '',
        endNumber: '',
        batch: '',
        total: '',
      },
      rules: {
        startNumber: [{
          required: true,
          message: '开始号码不能为空',
          trigger: 'blur'
        }],
        endNumber: [{
          required: true,
          length: 13,
          message: '结束号码不能为空',
          trigger: 'blur'
        }],
        batch: [{
          required: true,
          message: '批次不能为空',
          trigger: 'blur'
        }],
        total: [{
          required: true,
          message: '本数不能为空',
          trigger: 'blur'
        }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    right,
    /** 查询公告列表 */
    getList() {
      const that = this
      this.loading = true;
      axios.get("http://localhost:8010/ac/invoice/list").then( function(res){
        //代表请求成功之后处理
        console.log(res);
        that.total = res.data.data.length;
        that.invoiceList = res.data.data;
        that.loading = false;
      }).catch( function (err){
        //代表请求失败之后处理
        console.log (err);
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 表单重置
    reset() {
      this.form = undefined;
      this.resetForm("form");
    },
    /** 筛选按钮操作 */
    getListlimited(){

    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getListlimited();
    },
    handleState2(row) {
      const that = this
      if( row.registration === "未登记"){
        this.$message({
          message: '该发票还未登记',
          type: 'warning'
        });
      }
      else {
        row.registration = "未登记";
        axios.post("http://localhost:8010/ac/invoice/register/",row)
          .then(function(promise){
            console.log(promise.data)
            that.reset();
            that.$message({
              message: '撤销成功',
              type: 'success'
            });
          }).catch( function (err){
          //代表请求失败之后处理
          console.log (err);
        });
      }
    },
    handleState1(row) {
      const that = this
      if( row.registration === "已登记"){
        this.$message({
          message: '该发票已登记',
          type: 'warning'
        });
      }
      else{
        row.registration = "已登记";
        axios.post("http://localhost:8010/ac/invoice/register/",row)
          .then(function(promise){
            console.log(promise.data)
            that.reset();
            that.$message({
              message: '登记成功',
              type: 'success'
            });
          }).catch( function (err){
          //代表请求失败之后处理
          console.log (err);
        });
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.noticeId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 提交按钮 */
    submitForm: function() {
      if(this.formData.startNumber === ''||this.formData.endNumber === ''||this.formData.batch === ''
      ||this.formData.total === ''){
        this.$message({
          message: '提交信息有误，请重新输入',
          type: 'error'
        });
      }
      else{
        const that = this
        axios.post("http://localhost:8010/ac/invoice/addinvoice/",that.formData)
          .then(function(){
            console.log(that.formData)
            that.getList();
            that.reset();
            that.$message({
              message: '提交成功',
              type: 'success'
            });
          }).catch( function (err){
          //代表请求失败之后处理
          console.log (err);
          that.$message({
            message: '提交失败',
            type: 'error'
          });
        });
        that.reset();
      }
    }
  },
};
</script>
