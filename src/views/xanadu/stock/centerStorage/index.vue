<template>
  <div>
    <!--搜索栏-->
    <el-card style="height: 80px">
      <el-form :inline="true">
        <el-form-item label="商品ID:">
          <el-input type="text" placeholder="请输入你要搜索的商品ID" v-model="goodID" clearable @clear="reset"></el-input>
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

        <el-form-item style="margin-left: 10px">
          <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button type="primary" size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!--表格-->
    <el-card style="margin: 10px 0">
      <el-table ref="multipleTable" style="margin-top: 10px" border stripe :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)">
        <el-table-column label="#" type="index" align="center"></el-table-column>
        <el-table-column label="记录ID" align="center" prop="id" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品名称" align="center" prop="productName" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品价格" align="center" prop="productPrice" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品ID" align="center" prop="productId" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="总库存量" align="center" prop="totalNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="退回数量" align="center" prop="refundNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="已分配量" align="center" prop="allocatedNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="可分配量" align="center" prop="allocateAbleNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="锁定数量" align="center" prop="lockNum" show-overflow-tooltip></el-table-column>
      </el-table>

      <el-pagination style="margin: 10px 0" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
                     :page-sizes="[5, 7, 10, 15]" :page-size="10" layout="sizes, prev, pager, next" :total=tableData.length>
      </el-pagination>
    </el-card>

  </div>
</template>

<script>

import {cenlist, cenGoodById} from '@/api/ware'

export default {
  name: 'index',
  data(){
    return {
      goodID: '',
      tableData: [],
      currentPage: 1,
      pagesize: 10,
      datevalue:'',
      datevalue1:''
    }
  },

  methods:{
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

    //搜索 id time
    search(){
      if (this.goodID !== ''){//商品id查找
        cenGoodById(this.goodID).then(res=>{
          var list = []
          list.push(res.data)
          //现在筛选时间
          if (this.datevalue === '' && this.datevalue1 === ''){//没有
            this.tableData = list
          } else if (this.datevalue !== '' && this.datevalue1 === ''){//创建
            this.tableData = []
            for (let i = 0;i < list.length;i++){
              let start = this.todate(this.datevalue.at(0))
              let end = this.todate(this.datevalue.at(1))
              if (list.at(i).createTime > start && list.at(i).createTime < end)
                this.tableData.push(list.at(i))
            }
          } else if (this.datevalue === '' && this.datevalue1 !== ''){//更新
            this.tableData = []
            for (let i = 0;i < list.length;i++){
              let start = this.todate(this.datevalue1.at(0))
              let end = this.todate(this.datevalue1.at(1))
              if (list.at(i).updateTime > start && list.at(i).updateTime < end)
                this.tableData.push(list.at(i))
            }
          } else { //同时
            this.tableData = []
            for (let i = 0;i < list.length;i++){
              let start = this.todate(this.datevalue.at(0))
              let end = this.todate(this.datevalue.at(1))
              let start1 = this.todate(this.datevalue1.at(0))
              let end1 = this.todate(this.datevalue1.at(1))
              if (list.at(i).createTime > start && list.at(i).createTime < end && list.at(i).updateTime > start1 && list.at(i).updateTime < end1)
                this.tableData.push(list.at(i))
            }
          }

          for (let i = 0;i < this.tableData.length;i++){
            this.tableData.at(i).createTime = this.getLocalTime(this.tableData.at(i).createTime)
            this.tableData.at(i).updateTime = this.getLocalTime(this.tableData.at(i).updateTime)
          }
        })
      } else {//不需要id筛选
        cenlist().then(res=>{
          var list =[]
          list.push(res.data)
          //现在筛选时间
          if (this.datevalue === '' && this.datevalue1 === ''){//没有
            this.tableData = list[0]
          } else if (this.datevalue !== '' && this.datevalue1 === ''){//创建
            this.tableData = []
            for (let i = 0;i < list[0].length;i++){
              let start = this.todate(this.datevalue.at(0))
              let end = this.todate(this.datevalue.at(1))
              if (list[0].at(i).createTime > start && list[0].at(i).createTime < end)
                this.tableData.push(list[0].at(i))
            }
          } else if (this.datevalue === '' && this.datevalue1 !== ''){//更新
            this.tableData = []
            for (let i = 0;i < list[0].length;i++){
              let start = this.todate(this.datevalue1.at(0))
              let end = this.todate(this.datevalue1.at(1))
              if (list[0].at(i).updateTime > start && list[0].at(i).updateTime < end)
                this.tableData.push(list[0].at(i))
            }
          } else { //同时
            this.tableData = []
            for (let i = 0;i < list[0].length;i++){
              let start = this.todate(this.datevalue.at(0))
              let end = this.todate(this.datevalue.at(1))
              let start1 = this.todate(this.datevalue1.at(0))
              let end1 = this.todate(this.datevalue1.at(1))
              if (list[0].at(i).createTime > start && list[0].at(i).createTime < end && list[0].at(i).updateTime > start1 && list[0].at(i).updateTime < end1)
                this.tableData.push(list[0].at(i))
            }
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
      this.goodID=''
      this.datevalue=''
      this.datevalue1=''
      cenlist().then(res=>{
        this.tableData = res.data;
        for (let i = 0;i < this.tableData.length;i++){
          this.tableData.at(i).createTime = this.getLocalTime(this.tableData.at(i).createTime)
          this.tableData.at(i).updateTime = this.getLocalTime(this.tableData.at(i).updateTime)
        }
      })
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
    cenlist().then(res=>{
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
