<template>

  <div>
    <!--表格-->
    <el-card style="margin: 10px 0">
      <el-button type="primary" size="default" icon="el-icon-refresh-right" style="margin-right: 10px"  @click="reset">刷  新</el-button>
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

</style>
