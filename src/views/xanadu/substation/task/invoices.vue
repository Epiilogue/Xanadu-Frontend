<template>
  <div class="app-container">
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
          <el-button :disabled="scope.row.state === '已领用'
                             || scope.row.dstate === '已失效'"
                     size="small"
                     type="primary"
                     @click="receipt(scope.row)"
          >领用发票</el-button>
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
Vue.use(print)

export default {
  name: "Invoices",
  dicts: ['sys_invoices_normal'],
  props: ['task'],
  data: function () {
    return {
      // 打印数据
      printform: {
        number: "暂无信息",
        printTime: "暂无信息",
        productName: "暂无信息"
      },
      taskmessage: {},
      open: false,
      form: {},
      // 分站id
      subId:'',
      totalId: '1',
      // 遮罩层
      loading: true,
      // 发票信息
      invoiceList: [],
    }
  },
  created() {
    this.getList();
    this.subId = this.$cache.session.get('subProcessing')
  },
  methods: {
    parseTime() {
      return parseTime
    },
    getList(){
      console.log(this.task);
      const that = this;
      axios.get("http://localhost:8010/ac/invoice/getTotalId/"+that.subId).then( function(res){
        //代表请求成功之后处理
        console.log(res);
        that.totalId = res.data
      }).catch( function (err){
        //代表请求失败之后处理
        that.$message.error('发票列表获取失败');
      });
      axios.get("http://localhost:8010/ac/invoices/getinvoicebytotalid/"+that.totalId).then( function(res){
        //代表请求成功之后处理
        that.total = res.data.data.length;
        that.invoiceList = res.data.data;
        that.loading = false;
      }).catch( function (err){
        //代表请求失败之后处理
        that.$message.error('发票列表获取失败');
      });
    },
    printInvoice(row){
      if(this.printform.number === '暂无信息'){
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
    }
  }
}
</script>

<style scoped>

</style>
