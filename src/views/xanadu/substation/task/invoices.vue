<template>
  <div class="app-container">
    <!--  发票查询  -->
    <el-form :model="query" ref="elForm" :rules="queryrules" size="small"  label-width="120px" :inline="true">
      <el-form-item label="领用人" prop="employee" label-width="80px">
        <el-col>
          <el-input v-model="query.employee"  placeholder="输入领用人"
                     prefix-icon='el-icon-paperclip' width="100%"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="发票号码" prop="invoiceNumber" label-width="80px">
        <el-col>
          <el-input v-model="query.invoiceNumber"  placeholder="输入发票号码"
                     prefix-icon='el-icon-paperclip' width="100%"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="批次" prop="batch" label-width="80px">
        <el-col>
          <el-input v-model="query.batch"  placeholder="输入批次"
                     prefix-icon='el-icon-paperclip' width="100%"></el-input>
        </el-col>
      </el-form-item>
      <el-button type="primary" size="small" @click="selectList">查  询</el-button>
      <el-button type="primary" size="small"  style="margin-right: 10px"  @click="getList">重  置</el-button>
    </el-form>
    <!-- 失效原因对话框 -->
    <el-dialog title="发票作废" :visible.sync="open1" height="300px" width="600px" append-to-body>
      <el-form ref="form" :model="dform"  label-width="80px" >
        <el-row>
          <el-col :span="24">
            <el-form-item label="失效原因">
              <el-input v-model="dform.details" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormd(dform)">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
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
          <p>收件人电话：{{ this.task.phone }}</p>
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
  <!-- 领用弹窗 -->
    <el-dialog title="请核对发票信息" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form"  label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="发票号" prop="number">
              <el-input v-model="form.number" maxlength="30" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="领用分站" prop="startnumber">
              <el-input v-model="form.substationId" maxlength="30" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="领用人" prop="endnumber">
              <el-input v-model="form.employee" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单号" prop="startnumber">
              <el-input v-model="form.orderId" maxlength="30" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品总数" prop="endnumber">
              <el-input v-model="form.productNum" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品总价" prop="startnumber">
              <el-input v-model="form.productName" maxlength="30" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm(form)">确 定</el-button>
        <el-button type="primary" @click="cancel()">取 消</el-button>
      </div>
    </el-dialog>
    <!--  发票信息  -->
    <el-table v-loading="loading" :data="invoiceList">
      <el-table-column label="发票号码" align="center" prop="number" width="200">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_invoices_normal" :value="scope.row.number"/>
        </template>
      </el-table-column>
      <el-table-column label="批次" align="center" prop="batch" width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_invoices_normal" :value="scope.row.batch"/>
        </template>
      </el-table-column>
      <el-table-column label="领用分站id" align="center" prop="substationId" width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_invoices_normal" :value="scope.row.substationId"/>
        </template>
      </el-table-column>
      <el-table-column label="领用人" align="center" prop="employee" width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_invoices_normal" :value="scope.row.employee"/>
        </template>
      </el-table-column>
      <el-table-column label="领用状态" align="center" prop="state" width="100">
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
          <el-button :disabled="scope.row.state === '已领用'
                             || scope.row.dstate === '已失效'"
                     size="small"
                     type="primary"
                     @click="receipt(scope.row)"
          >领用发票</el-button>
          <el-button :disabled="scope.row.dstate === '已失效'"
                     size="small"
                     type="danger"
                     @click="changedstate(scope.row)"
          >发票作废</el-button>
          <el-button :disabled="scope.row.dstate === '已失效'
                              || scope.row.state === '未领用'"
                     size="small"
                     type="warning"
                     @click="submitFormt(scope.row)"
          >发票退回</el-button>
          <el-button :disabled="scope.row.dstate === '已失效'"
                     size="small"
                     type="warning"
                     @click="printInvoice(scope.row)"
          >打印发票</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";
import {parseTime} from "@/utils/ruoyi";
import printJS from "print-js";
import Vue from 'vue'


export default {
  name: "Invoices",
  dicts: ['sys_invoices_normal'],
  props: ['task'],
  data: function () {
    return {
      // 打印数据
      printform: {
        id: "0",
        number: "暂无信息",
        printTime: "暂无信息",
        productName: "暂无信息"
      },
      query:{
        employee: '',
        invoiceNumber: '',
        batch:'0',
      },
      taskmessage: {},
      open: false,
      open1: false,
      form: {},
      // 分站id
      subId:'',
      totalId: '',
      // 遮罩层
      loading: true,
      // 发票信息
      invoiceList: [],
      dform: {},
      queryrules: {
        employee: [{
          required: true,
          validator: this.validateInvoiceNumber,
          message: '领用人不能为空',
          trigger: 'blur'
        }],
        invoiceNumber: [{
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
      }
    }
  },
  created() {
    this.getList();
  },
  methods: {
    parseTime() {
      return parseTime
    },
    selectList() {
      const that = this;
      axios.get("http://localhost:8010/ac/invoices/selectlist",{
        params: {
          employee: that.query.employee,
          invoiceNumber: that.query.invoiceNumber,
          batch: that.query.batch,
        }
      }).then( function(res){
        //代表请求成功之后处理
        that.invoiceList = res.data.data;
        console.log(that.invoiceList);
        that.$message({
          message: "查询成功",
          type: 'success'
        });
      }).catch( function (err){
        //代表请求失败之后处理
        that.$message({
          message: "后端请求失败",
          type: 'error'
        });
        console.log (err);
      });
    },
    getList(){
      this.subId = this.task.subId;
      console.log(this.subId);
      const that = this;
      axios.get("http://localhost:8010/ac/invoice/getTotalId/"+ this.subId).then( function(res1){
        //代表请求成功之后处理
        axios.get("http://localhost:8010/ac/invoices/getinvoicebytotalid/"+res1.data.data).then( function(res2){
          //代表请求成功之后处理
          that.total = res2.data.data.length;
          that.invoiceList = res2.data.data;
          that.loading = false;
        }).catch( function (err){
          //代表请求失败之后处理
        });
      }).catch( function (err){
        //代表请求失败之后处理
        that.$message.error('发票列表获取失败');
      });
    },
    printInvoice(row){
        const id = row.id || this.ids;
        const that = this;
        axios.get("http://localhost:8010/ac/invoices/printInvoices/"+id).then( function(res){
          //代表请求成功之后处理
          that.printform = res.data.data;
          setTimeout(function() {
            that.print()
          }, 1000)
          console.log(that.printform);
        }).catch( function (err){
          //代表请求失败之后处理
          alert ('进入catch')
          console.log (err);
        });
    },
    print(){
      printJS('printJS-form','html')
    },
    reset() {
      this.form = undefined;
    },
    cancel(){
      this.open = false;
    },
    receipt(row){
      this.open = true;
      const id = row.id || this.ids;
      const that = this;
      axios.get("http://localhost:8010/ac/invoices/getinvoice/"+id).then(function (res){
        that.form = res.data.data;
        that.form.substationId = that.subId;
        that.form.orderId = that.task.orderId;
        that.form.productNum = that.task.numbers;
        that.form.productName = that.task.totalAmount;
        console.log(that.form);
      }).catch(function (err){
        that.$message.error('信息获取失败');
        console.log(err);
      })
    },
    // 发票作废
    changedstate(row){
      this.open1 = true;
      const id = row.id || this.ids;
      const that = this
      axios.get("http://localhost:8010/ac/invoice/getinvoice/"+id).then( function(res){
        //代表请求成功之后处理
        console.log(res);
        that.dform = res.data.data;
      }).catch( function (err){
        that.$message.error('信息获取失败');
        console.log (err);
      });
    },
    submitForm(form){
      const that = this
      that.form.state = '已领用';
      axios.post("http://localhost:8010/ac/invoices/update/",form)
        .then(function(promise){
          console.log(form);
          that.$message.success('提交成功');
          that.open = false;
        }).catch( function (err){
        //代表请求失败之后处理
        console.log (err);
        that.$message.error('提交失败');
      });
      that.getList();
      that.open = false;
    },
    submitFormd: function(dform) {
      this.open1 = false;
      const that = this
      that.dform.dstate = '已失效';
      that.dform.state = '未领用';
      axios.post("http://localhost:8010/ac/invoices/update/",dform)
        .then(function(promise){
          that.$message.success('操作成功');
        }).catch( function (err){
        //代表请求失败之后处理
        console.log (err);
        that.$message.error('操作失败');
      });
    },
    submitFormt: function(row) {
      const that = this;
      row.state = '未领用';
      row.employee = '暂无信息';
      row.orderId = '无';
      row.productNum = '无';
      row.productName = '无';
      axios.post("http://localhost:8010/ac/invoices/update/",row)
        .then(function(promise){
          that.$message.success('操作成功');
        }).catch( function (err){
        //代表请求失败之后处理
        console.log (err);
        that.$message.error('操作失败');
      });
    }
  },
}
</script>

<style scoped>

</style>
