<template>
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
</template>

<script>
import axios from "axios";

export default {
  name: "Invoices",
  dicts: ['sys_invoices_normal'],
  data: function () {
    return {
      // 打印数据
      printform: {},
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
    getList(){
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
    }
  }
}
</script>

<style scoped>

</style>
