<template>
  <div class="app-container" >
    <!--  上方表单  -->
    <el-form   :model="formData" ref="elForm" :rules="rules" size="small"  label-width="68px">
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


          <el-form :model="selection" ref="queryForm" size="small" :inline="true" v-show="showSearch" style="margin-left: 100px">
            <el-form-item prop="status">
              <el-select v-model="selection.status" placeholder="发票状态" clearable>
                <el-option
                  v-for="dict in options"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="select(selection.status)">筛选</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-form>


    <!--  发票列表  -->
    <el-table v-loading="loading" :data="invoiceList">
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
      <el-table-column label="创建时间" align="center" prop="time" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.time, '{y}-{m}-{d}-{h}-{m}-{s}') }}</span>
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

    <Pagination v-show="total > 0" :total="total" :page.sync="pageInfo.pageNum" :limit.sync="pageInfo.pageSize"
                @pagination="getPageList" />
  </div>
</template>

<script>

import axios from 'axios'
import ElementUI from 'element-ui';
import Vue from "vue";
Vue.use(ElementUI);

export default {
  name: "RegisInvoice",
  dicts: ['sys_normal_disable', 'sys_regisinvoice_registration', 'sys_regisinvoice_batch','sys_regisinvoice_endnumber','sys_regisinvoice_startnumber','sys_regisinvoice_total'],
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
      // 筛选参数
      selection: {
        status: "",
      },
      refreshed:true,
      pageList: [],   //表格数据
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
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
          validator: this.validateInvoiceNumber,
          message: '请检查发票号码格式',
          trigger: 'blur'
        }],
        endNumber: [{
          required: true,
          validator: this.validateInvoiceNumber,
          message: '请检查发票号码格式',
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
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 表单重置
    reset() {
      this.getList();
      this.$message({
        message: '重置成功',
        type: 'success'
      });
    },
    /** 筛选按钮操作 */
    select(){
      const that = this
      axios.get("http://localhost:8010/ac/invoice/listByState/"+this.selection.status).then( function(res){
        //代表请求成功之后处理
        console.log(res);
        that.total = res.data.data.length;
        that.invoiceList = res.data.data;
        that.$message({
          message: '筛选成功',
          type: 'success'
        });
      }).catch( function (err){
        //代表请求失败之后处理
        console.log (err);
      });
    },
    // 发票号码校验
    validateInvoiceNumber(rule, value, callback){
      const pattern = /^[A-Z]{2}\d{8}$/;
      if (pattern.test(value)) {
        callback(); // 校验通过
      } else {
        callback(new Error('请输入有效的发票号码')); // 校验不通过，返回错误消息
      }
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
    getPageList() {
      this.refreshed = false
      this.total = this.queryList.length
      let pageNum = this.pageInfo.pageNum
      let pageSize = this.pageInfo.pageSize
      this.pageList = this.queryList.slice((pageNum - 1) * pageSize, pageNum * pageSize)
      this.$nextTick(()=>{
        this.refreshed=true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["elForm"].validate((valid)=> {
        if (valid) {
          // 表单校验通过，执行提交操作
          const that = this;
          axios.post("http://localhost:8010/ac/invoice/addinvoice/",that.formData)
            .then(function(){
              console.log(that.formData)
              that.getList();
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
        } else {
          // 表单校验不通过
          this.$message({
            message: '请检查输入格式',
            type: 'error'
          });
          return false;
        }
      });
    }
  },
};
</script>
