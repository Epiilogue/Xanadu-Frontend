<template>
  <div class="app-container">
    <!--发票列表-->
    <el-table v-loading="loading" :data="invoiceList" >
      <el-table-column label="开始号码" align="center" prop="startNumber" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_invoice_normal" :value="scope.row.startNumber"/>
        </template>
      </el-table-column>
      <el-table-column label="结束号码" align="center" prop="endNumber" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_invoice_normal" :value="scope.row.endNumber"/>
        </template>
      </el-table-column>
      <el-table-column label="批次" align="center" prop="batch" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_invoice_normal" :value="scope.row.batch"/>
        </template>
      </el-table-column>
      <el-table-column label="本数" align="center" prop="total" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_invoice_normal" :value="scope.row.total"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="time" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime()(scope.row.time, '{y}-{m}-{d}-{h}-{m}-{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.registration === '未登记'"
                     size="small"
                     type="primary"
                     @click="getinvoice(scope.row)"
          >领用</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination v-show="total > 0" :total="total" :page.sync="pageInfo.pageNum" :limit.sync="pageInfo.pageSize"
                @pagination="getPageList" />
  </div>
</template>

<script>
import axios from "axios";
import {parseTime} from "@/utils/ruoyi";
export default {
  name: "invoice",
  dicts: ['sys_invoice_normal'],
  data: function () {
    return {
      // 分站id
      subId: '0',
      totalId: '0',
      // 遮罩层
      loading: true,
      // 发票信息
      invoiceList: [],
      // 分页数据
      total: 0,
      pageList: [],   //表格数据
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
      },
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
    getList() {
      const that = this
      this.loading = true;
      axios.get("http://localhost:8010/ac/invoice/listByReceipt").then( function(res){
        //代表请求成功之后处理
        console.log(res);
        that.total = res.data.data.length;
        that.invoiceList = res.data.data;
        that.loading = false;
      }).catch( function (err){
        //代表请求失败之后处理
        console.log (err);
        that.$message.error('发票列表获取失败');
      });
    },
    getPageList() {
      this.total = this.queryList.length
      let pageNum = this.pageInfo.pageNum
      let pageSize = this.pageInfo.pageSize
      this.pageList = this.queryList.slice((pageNum - 1) * pageSize, pageNum * pageSize)
    },
    getinvoice(row){
      const that = this
      row.substationId = that.subId;
      axios.post("http://localhost:8010/ac/invoices/update/",row)
        .then(function(promise){
          that.$message.success('领用成功');
        }).catch( function (err){
        //代表请求失败之后处理
        console.log (err);
        that.$message.error('领用失败');
      });
      that.getList();
    }
  },
}
</script>

<style scoped>

</style>
