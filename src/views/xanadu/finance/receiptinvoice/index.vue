<template>
  <div class="app-container" >
    <!--筛选框-->
    <el-form :model="selection" ref="queryForm" size="small" :inline="true" v-show="showSearch">
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

    <!-- 打印内容 -->
    <div v-show="false">
      <form method="get" action="#" id="printJS-form">
        <div style="justify-content: space-between; font-size: 14px; margin-bottom: 5px;" >
          <!-- 发票头部内容 -->
          <h1>Xanadu物流管理中心</h1>
        </div>
        <div class="headerMessage" style="justify-content: space-between; font-size: 8px; margin-bottom: 5px;">
          <!-- 在此处放置发票信息，例如发票号码、日期等 -->
          <p>发票号码：{{ this.printform.number }}</p>
          <p>打印时间：{{ parseTime()(this.printform.printTime, '{y}-{m}-{d}-{h}:{m}:{s}') }}</p>
          <p>分站id：{{ this.printform.substationId }}</p>
        </div>
        <div>------------详细信息-------------</div>
        <div class="content" style=" justify-content: space-between; font-size: 14px; margin-bottom: 5px;">
          <p>商品数量：{{ this.printform.productNum }}</p>
          <p>商品总价：{{ this.printform.productName }}</p>
          <p>批次：{{ this.printform.batch }}</p>
          <!-- 在此处放置发票项目列表、数量、价格等 -->
        </div>
        <div>--------------------------------</div>
        <div class="footer" style=" border-top: 1px solid #ccc; padding-top: 10px; margin-top: 20px;">
          <p>负责人签字：</p>
          <p></p>
          <p>Xanadu公司盖章：</p>
        </div>
      </form>
    </div>

    <!-- 修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="序号" prop="id">
             <el-input v-model="form.id" maxlength="30" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票号" prop="number">
              <el-input v-model="form.number" maxlength="30" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="领用分站" prop="startnumber">
              <el-input v-model="form.substationId" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="领用人" prop="endnumber">
              <el-input v-model="form.employee" maxlength="30" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm(form)">确 定</el-button>
      </div>
    </el-dialog>

    <!--发票列表-->
    <el-table v-loading="loading" :data="invoiceList.slice((currentPage-1)*pagesize,currentPage*pagesize)" >
      <el-table-column label="序号" align="center" prop="id" width="50" />
      <el-table-column label="开始号码" align="center" prop="startNumber" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_regisinvoice_endnumber" :value="scope.row.startNumber"/>
        </template>
      </el-table-column>
      <el-table-column label="结束号码" align="center" prop="endNumber" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_regisinvoice_endnumber" :value="scope.row.endNumber"/>
        </template>
      </el-table-column>
      <el-table-column label="批次" align="center" prop="batch" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_regisinvoice_batch" :value="scope.row.batch"/>
        </template>
      </el-table-column>
      <el-table-column label="本数" align="center" prop="total" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_regisinvoice_total" :value="scope.row.total"/>
        </template>
      </el-table-column>
      <el-table-column label="领用分站" align="center" prop="substationId" class-name="small-padding fixed-width">
        <template slot-scope="{row}" >
          <div v-if="row.substationId !== '暂无信息'">
            <substation :id="row.substationId"></substation>
          </div>
          <div v-if="row.substationId === '暂无信息'">
            <dict-tag :options="dict.type.sys_regisinvoice_substationId" value='暂无信息'/>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="登记状态" align="center" prop="registration" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.registration === '已登记' ? 'success' : 'warning'"
            disable-transitions>{{scope.row.registration}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.registration === '未登记'"
            size="small"
            type="primary"
            @click="getinvoice(scope.row)"
          >领用信息</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination style="margin: 10px 0" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
                   :page-sizes="[5, 7, 10, 15]" :page-size="10" layout="sizes, prev, pager, next" :total=this.total>
    </el-pagination>


    <!--  详细信息  -->
    <el-dialog :visible.sync="opendetails" width="1080px" append-to-body>
      <el-table v-loading="loading" :data="invoiceList1.slice((currentPage1-1)*pagesize1,currentPage1*pagesize1)">
        <el-table-column label="发票号码" align="center" prop="number" width="200">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_regisinvoice_endnumber" :value="scope.row.number"/>
          </template>
        </el-table-column>
        <el-table-column label="批次" align="center" prop="batch" width="100">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_regisinvoice_batch" :value="scope.row.batch"/>
          </template>
        </el-table-column>
        <el-table-column label="领用分站id" align="center" prop="substationId" width="100">
          <template slot-scope="{row}" >
            <div v-if="row.substationId !== '暂无信息'">
              <substation :id="row.substationId"></substation>
            </div>
            <div v-if="row.substationId === '暂无信息'">
              <dict-tag :options="dict.type.sys_regisinvoice_substationId" value='暂无信息'/>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="领用人" align="center" prop="employee" width="100">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_regisinvoice_employee" :value="scope.row.employee"/>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="state" width="100">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.state === '未领用' ? 'success' : (scope.row.state === '已领用' ?'warning':'danger')"
              disable-transitions>{{scope.row.state}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="失效状态" align="center" prop="dstate" width="100">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.dstate === '生效中' ? 'success' : (scope.row.state === '已失效' ?'warning':'danger')"
              disable-transitions>{{scope.row.dstate}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.dstate === '已失效'"
              size="small"
              type="warning"
              @click="printInvoice(scope.row)"
            >打印发票</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin: 10px 0" @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page.sync="currentPage1"
                     :page-sizes="[5, 7, 10, 15]" :page-size="10" layout="sizes, prev, pager, next" :total=this.total1>
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>


import axios from 'axios'
import printJS from "print-js";
import Vue from 'vue'
import {parseTime} from "@/utils/ruoyi";
Vue.use(print)

export default {
  name: "RegisInvoice",
  dicts: ['sys_regisinvoice_employee', 'sys_regisinvoice_substationId', 'sys_regisinvoice_batch','sys_regisinvoice_endnumber','sys_regisinvoice_startnumber','sys_regisinvoice_total'],
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
      // 打印数据
      printform: {
        id: '0'
      },
      // 筛选参数
      selection: {
        status: "",
      },
      currentPage: 1,
      pagesize: 10,

      currentPage1: 1,
      pagesize1: 10,
      opendetails: false,
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
      total1: 0,
      // 单张发票数据
      invoiceList1: [],
      // 发票表格数据
      invoiceList: [],
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      rules: {
        dictLabel: [
          { required: true, message: "数据标签不能为空", trigger: "blur" }
        ],
        dictValue: [
          { required: true, message: "数据键值不能为空", trigger: "blur" }
        ],
        dictSort: [
          { required: true, message: "数据顺序不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 筛选按钮操作 */
    select(){
      console.log(this.selection.status);
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
    parseTime() {
      return parseTime
    },

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
        alert ('进入catch')
        console.log (err);
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    // 表单重置
    reset() {
      this.getList();
      this.$message({
        message: '重置成功',
        type: 'success'
      });
    },
    //分页
    handleSizeChange(newSize) {
      this.pagesize = newSize
    },
    // 分页组件监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.currentPage = newPage
    },
    handleSizeChange1(newSize) {
      this.pagesize1 = newSize
    },
    // 分页组件监听页码值改变的事件
    handleCurrentChange1(newPage) {
      this.currentPage1 = newPage
    },
    getinvoice(row){
      this.opendetails = true;
      const totalid = row.id || this.ids;
      const that = this;
      axios.get("http://localhost:8010/ac/invoices/getinvoicebytotalid/"+totalid).then( function(res){
        //代表请求成功之后处理
        that.invoiceList1 = res.data.data;
        that.total1 = res.data.data.length;
        console.log(that.invoiceList1);
      }).catch( function (err){
        //代表请求失败之后处理
        alert ('进入catch')
        console.log (err);
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    receipt(row){
      this.open = true;
      const id = row.id || this.ids;
      const that = this
      axios.get("http://localhost:8010/ac/invoices/getinvoice/"+id).then( function(res){
        //代表请求成功之后处理
        that.form = res.data.data;
        console.log(that.form);
      }).catch( function (err){
        //代表请求失败之后处理
        alert ('进入catch')
        console.log (err);
      })
    },
    printInvoice(row){
      if(this.printform.id === 0 || this.printform.id !== row.id){
        this.$message.success('发票信息加载中');
        const id = row.id || this.ids;
        const that = this;
        axios.get("http://localhost:8010/ac/invoices/printInvoices/"+id).then( function(res){
          //代表请求成功之后处理
          that.printform = res.data.data;
          console.log(that.printform);
        }).catch( function (err){
          //代表请求失败之后处理
          alert ('进入catch')
          console.log (err);
        });
      }
      else{
        const id = row.id || this.ids;
        const that = this;
        axios.get("http://localhost:8010/ac/invoices/printInvoices/"+id).then( function(res){
          //代表请求成功之后处理
          that.printform = res.data.data;
          console.log(that.printform);
        }).catch( function (err){
          //代表请求失败之后处理
          alert ('进入catch')
          console.log (err);
        });
        that.print();
      }
    },
    print(){
      printJS('printJS-form','html')
    },
    /** 提交按钮 */
    submitForm: function(form) {
      const that = this
      that.form.state = '已领用';
      axios.post("http://localhost:8010/ac/invoices/update/",form)
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
