<template>
  <div class="app-container">
    <!--   打印内容   -->
    <div v-show="false">
      <form method="get" action="#" id="printJS-form-output">
        <div >
          <h3>Xanadu出库单</h3 >
          <table class="product-table">
            <thead>
            <tr>
              <th>名称</th>
              <th>单价</th>
              <th>总数</th>
              <th>供货商名称</th>
              <th>总价格</th>
              <th>日期</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="product in this.printform" :key="product.productId">
              <td>{{ product.productName }}</td>
              <td>{{ product.productPrice }}</td>
              <td>{{ product.totalNum }}</td>
              <td>{{ product.supplierName }}</td>
              <td>{{ product.totalPrice }}</td>
              <td>{{ parseTime()(product.date, '{y}-{m}-{d}') }}</td>
            </tr>
            </tbody>
          </table>

        </div>
      </form>
    </div>
    <!--表格-->
    <el-card style="margin: 10px 0">

      <el-form :model="printData" ref="elForm" :rules="rules" size="small"  label-width="68px" :inline="true">
        <el-form-item label="选择日期" prop="data" label-width="80px">
          <el-col>
            <el-date-picker type="date" placeholder="选择日期" v-model="printData.data" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="商品名称" prop="productId">
          <el-input v-model="printData.productName"  placeholder="输入商品名称"
                    prefix-icon='el-icon-paperclip' width="120%"></el-input>
        </el-form-item>
        <el-button type="primary" size="small" @click="printDispatchOut">打印出库单</el-button>
        <el-button type="primary" size="small" icon="el-icon-refresh-right" style="margin-right: 10px"  @click="reset">刷  新</el-button>
      </el-form>

      <el-table ref="multipleTable" style="margin-top: 10px" border stripe :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)">
        <el-table-column label="#" type="index" align="center"></el-table-column>
        <el-table-column label="记录ID" align="center" prop="id" show-overflow-tooltip></el-table-column>
        <el-table-column label="出库ID" align="center" prop="outputId" show-overflow-tooltip></el-table-column>
        <el-table-column label="任务ID" align="center" prop="taskId" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品ID" align="center" prop="productId" show-overflow-tooltip>
          <template slot-scope="{row}">
            <product :id="row.productId"></product>
          </template>
        </el-table-column>
        <el-table-column label="分库ID" align="center" prop="subwareId" show-overflow-tooltip>
          <template slot-scope="{row}">
            <subware :id="row.subwareId"></subware>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center" prop="productName" show-overflow-tooltip></el-table-column>
        <el-table-column label="出库时间" align="center" prop="outputTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="预计出库时间" align="center" prop="requireTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" align="center"  show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag type="success" v-show="scope.row.status === '已出库'">{{ scope.row.status }}</el-tag>
            <el-tag type="danger"  v-show="scope.row.status === '未出库'">{{ scope.row.status }}</el-tag>
            <el-tag type="warning"  v-show="scope.row.status === '分库已入库'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="出库数量" align="center" prop="outputNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="实际出库数量" align="center" prop="actualNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="default" icon="el-icon-printer" @click="toConfirm(scope.row)" :disabled="scope.row.status!=='未出库'">出库</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination style="margin: 10px 0" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
                     :page-sizes="[5, 7, 10, 15]" :page-size="10" layout="sizes, prev, pager, next" :total=tableData.length>
      </el-pagination>
    </el-card>

    <!--confirm-->
    <el-dialog title="确认出库" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" center>
      <p style="size: A3">请选择调拨出库的数量</p>
      <el-slider v-model="outNum" show-input :max="Math.ceil(this.outvalue*1.5)" :min="Math.floor(this.outvalue*0.5)" :step="1">
      </el-slider>
      <el-button type="primary" round @click="confirmOut">提交</el-button>

    </el-dialog>


  </div>

</template>

<script>

import {cenDispatchOut, cenConfirmOut} from '@/api/ware'
import subware from '../../../../components/detail/subware'
import product from '../../../../components/detail/product'
import printJS from "print-js";
import Vue from 'vue'
import axios from "axios";
import {parseTime} from "@/utils/ruoyi";
Vue.use(print)

export default {
  name: 'DispatchOut',
  components: { subware, product },
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pagesize: 10,
      outId:'',
      dialogFormVisible:false,
      outvalue:'',
      outNum:'',
      printData: {
        data: null,
        productName: '',
      },
      printform: {
        productName: '无',
        productPrice: '',
        number: '',
        supplierName: '',
        totalNum: '',
        totalPrice: '',
        date: '',
      },
      rules: {
        data: [{
          required: true,
          type: 'date',
          message: '请选择日期',
          trigger: 'blur'
        }]
      }
    }
  },
  watch:{
    dialogFormVisible:{
      handler(){
        this.reset()
      }
    }
  },
  methods:{
    parseTime() {
      return parseTime
    },

    toConfirm(row){
      this.outId = row.id
      this.outvalue = row.outputNum
      this.outNum = row.outputNum
      this.dialogFormVisible = true
    },
    confirmOut(){
      cenConfirmOut(this.outId, this.outNum).then(res=>{
        if (res.msg === '操作成功'){
          this.dialogFormVisible = false
          this.$message({
            message:'出库成功',
            type:'success'
          })
        }
      })
    },
    printDispatchOut(){
      if(this.printData.data === null){
        this.$message({
          message:'请选择日期',
          type:'warning'
        })
      }
      else{
        const that = this;
        axios.get("http://localhost:8015/ware/centerOutput/printInventoryList",{
          params: {
            date: that.printData.data.toLocaleString(),
            productName: that.printData.productName,
          }
        }).then( function(res){
          //代表请求成功之后处理
          that.printform = res.data.data;
          console.log(that.printform);
        }).catch( function (err){
          //代表请求失败之后处理
          that.$message({
            message: "后端请求失败",
            type: 'error'
          });
          console.log (err);
        });
        that.print();
      }
    },
    print(){
      printJS('printJS-form-output','html')
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

    reset(){
      cenDispatchOut().then(res=>{
        this.tableData = res.data
        for (let i = 0;i < this.tableData.length;i++){
          this.tableData.at(i).outputTime = this.getLocalTime(this.tableData.at(i).outputTime)
          this.tableData.at(i).requireTime = this.getLocalTime(this.tableData.at(i).requireTime)
        }
      })
    },
  },
  mounted() {
    cenDispatchOut().then(res=>{
      this.tableData = res.data
      for (let i = 0;i < this.tableData.length;i++){
        this.tableData.at(i).outputTime = this.getLocalTime(this.tableData.at(i).outputTime)
        this.tableData.at(i).requireTime = this.getLocalTime(this.tableData.at(i).requireTime)
      }
    })
  }

}
</script>

<style scoped>
.product-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px; /* 设置表格字体大小 */
}

.product-table th,
.product-table td {
  padding: 10px;
  border: 1px solid #ccc;
}

.product-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.product-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.product-table tbody tr:hover {
  background-color: #ebebeb;
}
</style>
