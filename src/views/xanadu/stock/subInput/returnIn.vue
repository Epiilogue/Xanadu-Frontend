<template>
  <div>
    <el-card style="margin: 10px 0">
      <el-dropdown @command="handleCommand" split-button type="primary" >
        <span class="el-dropdown-link">入库方式</span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">调度入库</el-dropdown-item>
          <el-dropdown-item command="b">退货入库</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-table v-show="!this.type" ref="multipleTable" style="margin-top: 10px" border stripe :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)">
        <el-table-column label="#" type="index" align="center"></el-table-column>
        <el-table-column label="记录ID" align="center"  prop="id" show-overflow-tooltip></el-table-column>
        <el-table-column label="任务ID" align="center"  prop="taskId" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品ID" align="center"  prop="productId" show-overflow-tooltip>
          <template slot-scope="{row}">
            <product :id="row.productId"></product>
          </template>
        </el-table-column>
        <el-table-column label="分库ID" align="center"  prop="subwareId" show-overflow-tooltip>
          <template slot-scope="{row}">
            <subware :id="row.subwareId"></subware>
          </template>
        </el-table-column>
        <el-table-column label="供应商ID" align="center"  prop="supplierId" show-overflow-tooltip>
          <template slot-scope="{row}">
            <supplier :id="row.supplierId"></supplier>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center"  prop="productName" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品价格" align="center"  prop="productPrice" show-overflow-tooltip></el-table-column>
        <el-table-column label="出库时间" align="center"  prop="inputTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="入库数量" align="center"  prop="inputNum" show-overflow-tooltip></el-table-column>
      </el-table>

      <el-table v-show="this.type" ref="multipleTable" style="margin-top: 10px" border stripe :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)">
        <el-table-column label="#" type="index" align="center"></el-table-column>
        <el-table-column label="记录ID" align="center"  prop="id" show-overflow-tooltip></el-table-column>
        <el-table-column label="调拨ID" align="center"  prop="dispatchId" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品ID" align="center"  prop="productId" show-overflow-tooltip>
          <template slot-scope="{row}">
            <product :id="row.productId"></product>
          </template>
        </el-table-column>
        <el-table-column label="分库ID" align="center"  prop="subwareId" show-overflow-tooltip>
          <template slot-scope="{row}">
            <subware :id="row.subwareId"></subware>
          </template>
        </el-table-column>
        <el-table-column label="供应商ID" align="center"  prop="supplierId" show-overflow-tooltip>
          <template slot-scope="{row}">
            <supplier :id="row.supplierId"></supplier>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center"  prop="productName" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品价格" align="center"  prop="productPrice" show-overflow-tooltip></el-table-column>
        <el-table-column label="出库时间" align="center"  prop="inputTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="入库数量" align="center"  prop="inputNum" show-overflow-tooltip></el-table-column>
      </el-table>

      <el-pagination style="margin: 10px 0" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
                     :page-sizes="[5, 7, 10, 15]" :page-size="10" layout="sizes, prev, pager, next" :total=tableData.length>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>

import {subRefundIn} from '@/api/ware'
import supplier from '../../../../components/detail/supplier'
import subware from '../../../../components/detail/subware'
import product from '../../../../components/detail/product'

export default {
  name: 'returnIn',
  components: { supplier, subware, product },
  data(){
    return{
      tableData:[],
      currentPage: 1,
      pagesize: 10,
      subwareID:'',
      type:true, //true退货入库 false调拨入库
    }
  },
  watch:{
    type:function(newval){
      this.tableData = []
      subRefundIn(this.subwareID).then(res=>{
        console.log(res.data)
        var list = []
        list = res.data
        if (newval){
          for (let i = 0;i < list.length;i++){
            if (list.at(i).dispatchId !== null)
              this.tableData.push(list.at(i))
          }
        } else {
          for (let i = 0;i < list.length;i++){
            if (list.at(i).dispatchId === null)
              this.tableData.push(list.at(i))
          }
        }
        for (let i = 0;i < this.tableData.length;i++){
          this.tableData.at(i).inputTime = this.getLocalTime(this.tableData.at(i).inputTime)
        }
      })
    }
  },

  methods:{
    //切换入库表
    handleCommand(command) {
      this.type = command === "a";
    },

    //时间戳转换
    getLocalTime(nS) {
      var date = new Date(nS);
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
      var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
      var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
      var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
      let strDate = Y+M+D+h+m+s;
      return strDate
    },

    //转型时间戳
    todate(date){
      var d = new Date(date)
      d=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
      var s = new Date(d).getTime()
      return s
    },
//分页
    handleSizeChange(newSize) {
      this.pagesize = newSize
    },
    // 分页组件监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.currentPage = newPage
    },

  },
  mounted() {
    this.subwareID = this.$route.query.stockId;
    subRefundIn(this.subwareID).then(res=>{
      console.log(res.data)
      var list = []
      list = res.data
      for (let i = 0;i < list.length;i++){
        if (list.at(i).dispatchId !== null)
          this.tableData.push(list.at(i))
      }
      for (let i = 0;i < this.tableData.length;i++){
        this.tableData.at(i).inputTime = this.getLocalTime(this.tableData.at(i).inputTime)
      }
    })
  }
}
</script>

<style scoped>

</style>
