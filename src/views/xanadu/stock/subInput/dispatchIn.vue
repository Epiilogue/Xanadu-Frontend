<template>
  <div>
    <!--表格-->
    <el-card style="margin: 10px 0">
      <div class="filter-container">
        <el-form :inline="true">
          <el-form-item class="form-item" label="记录状态">
            <el-select v-model="status" placeholder="记录状态" style="width: 200px; margin-right: 5px" clearable>
              <el-option label="中心仓库已出库" value="中心仓库已出库"/>
              <el-option label="已入库" value="已入库"/>
            </el-select>
          </el-form-item>
          <el-form-item class="form-item" label="商品名称">
            <el-input v-model="productName" placeholder="商品名称" style="width: 200px; margin-right: 5px"/>
          </el-form-item>
          <el-form-item class="form-item">
            <el-button type="primary" icon="el-icon-search" @click="handleFilter">
              查询
            </el-button>
          </el-form-item>
          <el-button type="primary" icon="el-icon-refresh-right" class="form-item" style="margin-left: 10px"  @click="reset">刷  新</el-button>
        </el-form>
      </div>

      <el-table ref="multipleTable" style="margin-top: 10px" border stripe :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)">
        <el-table-column label="#" type="index" align="center"></el-table-column>
        <el-table-column label="记录ID" align="center" prop="id" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="任务ID" align="center" prop="taskId" width="70" show-overflow-tooltip>
          <template slot-scope="{row}">
            <task :id="row.taskId"></task>
          </template>
        </el-table-column>
        <el-table-column label="商品ID" align="center" prop="productId" width="70" show-overflow-tooltip>
          <template slot-scope="{row}">
            <product :id="row.productId"></product>
          </template>
        </el-table-column>
        <el-table-column label="分库ID" align="center" prop="subwareId" width="70" show-overflow-tooltip>
          <template slot-scope="{row}">
            <subware :id="row.subwareId"></subware>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center" prop="productName" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="出库时间" align="center" prop="outputTime" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-show="scope.row.status === '已出库'">{{ scope.row.status }}</el-tag>
            <el-tag type="warning" v-show="scope.row.status === '分库已入库'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="入库数量" align="center" prop="outputNum" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="default" icon="el-icon-printer" @click="toConfirm(scope.row)" :disabled="scope.row.status === '分库已入库'">入库</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination style="margin: 10px 0" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
                     :page-sizes="[5, 7, 10, 15]" :page-size="10" layout="sizes, prev, pager, next" :total=tableData.length>
      </el-pagination>
    </el-card>


  </div>
</template>

<script>

import {subConfirmDispatchIn, cenDispatchOut} from '@/api/ware'
import supplier from '../../../../components/detail/supplier'
import subware from '../../../../components/detail/subware'
import product from '../../../../components/detail/product'

export default {
  name: 'dispatchIn',
  components: { supplier, subware, product },
  data(){
    return{
      tableData:[],
      currentPage: 1,
      pagesize: 10,
      subwareID:'',
      dialogFormVisible:false,
      inNum:'',
      inId:'',
      status: '',
      productName: ''
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
    handleFilter() {
      //先拿到新的数据
      cenDispatchOut().then(res=>{
        this.tableData = []
        var list = []
        list = res.data
        for (let i = 0;i < list.length;i++){
          if (list[i].subwareId == this.subwareID)
            this.tableData.push(list[i])
        }
        for (let i = 0;i < this.tableData.length;i++){
          this.tableData.at(i).outputTime = this.getLocalTime(this.tableData.at(i).outputTime)
        }
      }).then(() => {
        if (this.productName !== '') {
          this.tableData = this.tableData.filter(item => item.productName.indexOf(this.productName) > -1)
        }
        if (this.status !== '') {
          this.tableData = this.tableData.filter(item => item.status.indexOf(this.status) > -1)
        }
      })
    },
    //入库
    toConfirm(row){
      this.$confirm('此操作将全部商品调拨入库', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.confirmOut(row.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消调拨入库'
        });
      });
    },
    confirmOut(id){
      subConfirmDispatchIn(id).then(res=>{
        if (res.msg === '商品调拨入库成功'){
          this.reset()
          this.dialogFormVisible = false
          this.$message({
            message:'入库成功',
            type:'success'
          })
        }
      })
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
      this.tableData = []
      cenDispatchOut().then(res=>{
        var list = []
        list = res.data
        console.log(list)
        for (let i = 0;i < list.length;i++){
          if (list[i].subwareId == this.subwareID)
            this.tableData.push(list[i])
        }
        for (let i = 0;i < this.tableData.length;i++){
          this.tableData.at(i).outputTime = this.getLocalTime(this.tableData.at(i).outputTime)
        }
      })
    },
  },
  mounted() {
    this.subwareID = this.$route.query.stockId;
    cenDispatchOut().then(res=>{
      var list = []
      list = res.data
      console.log(list)
      for (let i = 0;i < list.length;i++){
        if (list[i].subwareId == this.subwareID)
          this.tableData.push(list[i])
      }
      for (let i = 0;i < this.tableData.length;i++){
        this.tableData.at(i).outputTime = this.getLocalTime(this.tableData.at(i).outputTime)
      }
    })
  }
}
</script>

<style scoped>

</style>
