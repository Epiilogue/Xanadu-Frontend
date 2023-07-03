<template>
  <div>
    <!--搜索栏-->
    <el-card style="height: 80px">
      <el-form :inline="true">
        <el-form-item label="商品ID:">
          <el-input type="text" placeholder="请输入你要搜索的商品ID" v-model="goodID" clearable @clear="reset"></el-input>
        </el-form-item>
        <el-form-item label="仓库ID:">
          <el-input type="text" placeholder="请输入你要搜索的仓库ID" v-model="stockID" clearable @clear="reset"></el-input>
        </el-form-item>

        <!--时间段搜索-->
        <el-date-picker
          v-model="datevalue"
          type="daterange"
          :clearable="false"
          :editable="false"
          range-separator="至"
          start-placeholder="创建开始日期"
          end-placeholder="创建结束日期">
        </el-date-picker>

        <el-date-picker
          v-model="datevalue1"
          style="margin-left: 10px"
          type="daterange"
          :clearable="false"
          :editable="false"
          range-separator="至"
          start-placeholder="更新开始日期"
          end-placeholder="更新结束日期">
        </el-date-picker>
      </el-form>
    </el-card>
    <!--表格-->
    <el-card style="margin: 10px 0">
      <el-form :inline="true">
        <el-form-item style="margin-left: 10px">
          <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button type="primary" size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table ref="multipleTable" border stripe :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)">
        <el-table-column label="#" type="index" align="center"></el-table-column>
        <el-table-column label="记录ID" align="center" prop="id" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品ID" align="center" prop="productId" show-overflow-tooltip>
          <template slot-scope="{row}">
            <product :id="row.productId"></product>
          </template>
        </el-table-column>
        <el-table-column label="仓库ID" align="center" prop="subwareId" show-overflow-tooltip>
          <template slot-scope="{row}">
            <subware :id="row.subwareId"></subware>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center" prop="productName" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品价格" align="center" prop="productPrice" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="总库存量" align="center" prop="totalNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="退回数量" align="center" prop="refundNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="已分配量" align="center" prop="allocatedNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="可分配量" align="center" prop="allocateAbleNum" show-overflow-tooltip></el-table-column>
      </el-table>

      <el-pagination style="margin: 10px 0" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
                     :page-sizes="[5, 7, 10, 15]" :page-size="10" layout="sizes, prev, pager, next" :total=tableData.length>
      </el-pagination>
    </el-card>

  </div>
</template>

<script>
import { subList } from '@/api/ware'
import subware from '../../../../components/detail/subware'
import product from '../../../../components/detail/product'


export default {
  name: 'index',
  components: { subware, product },
  data(){
    return {
      stockID:'',
      goodID: '',
      tableData: [],
      currentPage: 1,
      pagesize: 10,
      datevalue:'',
      datevalue1:''
    }
  },

  methods:{
    //搜索
    search() {
      if (this.stockID === '' && this.goodID === '' && this.datevalue === '' && this.datevalue1 === ''){
        this.$message.error('请输入筛选信息')
      } else {
        subList().then(res=>{
          var list = []
          var taData = []
          list = res.data
          if (this.stockID !== ''){
            taData = []
            for (let i = 0;i < list.length;i++) {
              if (list.at(i).subwareId == this.stockID)
                taData.push(list.at(i))
            }
            list = taData
          }
          if (this.goodID !== ''){
            taData = []
            for (let i = 0;i < list.length;i++) {
              if (list.at(i).productId == this.goodID)
                taData.push(list.at(i))
            }
            list = taData
          }
          if (this.datevalue !== ''){
            taData = []
            let start = this.todate(this.datevalue.at(0))
            let end = this.todate(this.datevalue.at(1))
            for (let i = 0;i < list.length;i++){
              if (list.at(i).createTime > start && list.at(i).createTime < end)
                taData.push(list.at(i))
            }
            list = taData
          }
          if (this.datevalue1 !== ''){
            taData = []
            let start = this.todate(this.datevalue1.at(0))
            let end = this.todate(this.datevalue1.at(1))
            for (let i = 0;i < list.length;i++){
              if (list.at(i).createTime > start && list.at(i).createTime < end)
                taData.push(list.at(i))
            }
          }
          if (taData.length === 0){
            this.$message({
              message:'没有找到符合条件的信息',
              type:'error'
            })
          } else {
            this.tableData = taData
          }
          for (let i = 0;i < this.tableData.length;i++){
            this.tableData.at(i).createTime = this.getLocalTime(this.tableData.at(i).createTime)
            this.tableData.at(i).updateTime = this.getLocalTime(this.tableData.at(i).updateTime)
          }
        })

      }
    },
    //重置
    reset() {
      this.stockID=''
      this.goodID=''
      this.datevalue=''
      this.datevalue1=''
      subList().then(res=>{
        this.tableData = res.data;
        for (let i = 0;i < this.tableData.length;i++){
          this.tableData.at(i).createTime = this.getLocalTime(this.tableData.at(i).createTime)
          this.tableData.at(i).updateTime = this.getLocalTime(this.tableData.at(i).updateTime)
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
  },
  mounted() {
    subList().then(res=>{
      this.tableData = res.data;
      for (let i = 0;i < this.tableData.length;i++){
        this.tableData.at(i).createTime = this.getLocalTime(this.tableData.at(i).createTime)
        this.tableData.at(i).updateTime = this.getLocalTime(this.tableData.at(i).updateTime)
      }
    })
  }
}
</script>

<style scoped>

</style>
