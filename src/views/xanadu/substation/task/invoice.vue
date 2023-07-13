<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">该分站可领用发票</el-menu-item>
      <el-menu-item index="2">该分站已领用发票</el-menu-item>
    </el-menu>
    <!--发票列表-->

    <el-table v-loading="loading" :data="invoiceList.slice((currentPage-1)*pagesize,currentPage*pagesize)" >
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
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" >
        <template slot-scope="scope">
          <el-button size="small"
                     type="primary"
                     @click="getinvoice(scope.row)"
          >领用</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination style="margin: 10px 0" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
                   :page-sizes="[5, 7, 10, 15]" :page-size="10" layout="sizes, prev, pager, next" :total=this.total>
    </el-pagination>
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
      alinvoiceList: [],
      // 分页数据
      total: 0,
      currentPage: 1,
      pagesize: 10,
      // 选择界面
      activeIndex: '1',
      substationId: '暂无信息',
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
      if(this.activeIndex === '1'){
          this.substationId = '暂无信息';
      }else{
          this.substationId = this.subId;
      }
      const that = this
      this.loading = true;
      axios.get("http://localhost:8010/ac/invoice/listByReceipt",{
        params: {
          substationId: that.substationId,
        }
      }).then( function(res){
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
    handleSizeChange(newSize) {
      this.pagesize = newSize
    },
    // 分页组件监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.currentPage = newPage
    },
    handleSelect(key, keyPath) {
      this.activeIndex = key;
      this.getList();
    },
    getinvoice(row){
      const that = this
      if(this.activeIndex === '2'){
        that.$message.warning('该分站已领用这批发票');
      }
      else {
        row.substationId = that.subId;
        console.log(row.substationId)
        axios.post("http://localhost:8010/ac/invoice/update/",row)
          .then(function(promise){
            that.$message.success('领用成功');
          }).catch( function (err){
          //代表请求失败之后处理
          console.log (err);
          that.$message.error('领用失败');
        });
        setTimeout(function() {
          that.getList();
        }, 1000)
      }
    }
  },
}
</script>

<style scoped>

</style>
