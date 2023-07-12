<template>
  <div>
    <el-card style="margin: 10px 0">
      <div class="filter-container">
        <el-form :inline="true">
          <el-form-item class="form-item" label="记录状态">
            <el-select v-model="status" placeholder="记录状态" style="width: 200px; margin-right: 5px" clearable>
              <el-option label="未出库" value="未出库"/>
              <el-option label="已出库" value="已出库"/>
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
          <el-button type="primary" size="default" icon="el-icon-refresh-right" class="form-item" style="margin-left: 10px"  @click="reset">刷  新</el-button>
        </el-form>
      </div>


      <el-button type="primary" size="default" icon="el-icon-refresh-right" style="margin-right: 10px"  @click="reset">刷  新</el-button>
      <el-table ref="multipleTable" style="margin-top: 10px" border stripe :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)">
        <el-table-column label="#" type="index" align="center"></el-table-column>
        <el-table-column label="记录ID" align="center" width="80" prop="id" show-overflow-tooltip></el-table-column>
        <el-table-column label="出库ID" align="center" width="80" prop="outputId" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品ID" align="center" width="80" prop="productId" show-overflow-tooltip>
          <template slot-scope="{row}">
            <product :id="row.productId"></product>
          </template>
        </el-table-column>
        <el-table-column label="分库ID" align="center" width="80" prop="subwareId" show-overflow-tooltip>
          <template slot-scope="{row}">
            <subware :id="row.subwareId"></subware>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center" width="100" prop="productName" show-overflow-tooltip></el-table-column>
        <el-table-column label="出库时间" align="center" width="200" prop="outputTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" align="center" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag type="success" v-show="scope.row.status === '已出库'">{{ scope.row.status }}</el-tag>
            <el-tag type="danger"  v-show="scope.row.status === '未出库'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="出库数量" align="center" width="80" prop="outputNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="实际出库数量" align="center" width="80" prop="actualNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="default" icon="el-icon-printer" @click="toConfirm(scope.row)" :disabled="scope.row.status==='已出库'">出库</el-button>
            <el-button type="primary" size="default" icon="el-icon-delete" @click="open(scope.row)" style="background-color: red; border: red">删除</el-button>
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
import {subInputList, subConfirmOut, deleteReturnRecord} from '@/api/ware'
import product from '../../../../components/detail/product'
import subware from '../../../../components/detail/subware'

export default {
  name: 'pickOut',
  components: { subware, product },
  data(){
    return {
      tableData: [],
      currentPage: 1,
      pagesize: 10,
      type: '领货出库',
      subwareID:'',
      dialogFormVisible:false,
      outNum:'',
      outId:'',
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
      subInputList(this.type).then(res=>{
        var list = []
        list = res.data
        for (let i = 0;i < list.length;i++){
          if (list.at(i).subwareId == this.subwareID && !list.at(i).deleted)
            this.tableData.push(list.at(i))
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
    //toConfirm
    toConfirm(row){
      this.$confirm('此操作将全部商品领取并出库', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.confirmOut(row.id,row.outputNum)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消领货'
        });
      });
    },
    confirmOut(id,outputNum){
      subConfirmOut(id,outputNum).then(res=>{
        console.log(res)
        if (res.msg === '确认领货出库成功'){
          this.dialogFormVisible = false
          this.$message({
            message:'出库成功',
            type:'success'
          })
        }
      })
    },

    //删除
    open(row){
      this.$confirm('此操作将永久删除该条领货出库记录,若未出库则无法删除记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteConfirm(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    //确定删除
    deleteConfirm(row){
      deleteReturnRecord(row.id).then(res=>{
        console.log(res)
        if (res.msg === '删除成功'){
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
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
      subInputList(this.type).then(res=>{
        var list = []
        list = res.data
        for (let i = 0;i < list.length;i++){
          if (list.at(i).subwareId == this.subwareID && !list.at(i).deleted)
            this.tableData.push(list.at(i))
        }
        for (let i = 0;i < this.tableData.length;i++){
          this.tableData.at(i).outputTime = this.getLocalTime(this.tableData.at(i).outputTime)
        }
        console.log(this.tableData)
      })
    },
  },
  mounted() {
    this.subwareID = this.$route.query.stockId;
    subInputList(this.type).then(res=>{
      var list = []
      list = res.data
      for (let i = 0;i < list.length;i++){
        if (list.at(i).subwareId == this.subwareID && !list.at(i).deleted)
          this.tableData.push(list.at(i))
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
