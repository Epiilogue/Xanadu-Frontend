<template>
  <div>
    <!--搜索栏-->
    <el-card style="height: 80px">
      <el-form :inline="true">
        <el-form-item label="仓库ID:">
          <el-input type="text" placeholder="请输入你要搜索的仓库ID" v-model="stockID" clearable @clear="reset"></el-input>
        </el-form-item>
        <el-form-item label="商品ID:">
          <el-input type="text" placeholder="请输入你要搜索的商品ID" v-model="goodID" clearable @clear="reset"></el-input>
        </el-form-item>
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
        <el-table-column label="仓库ID" align="center"  prop="subware_id" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品名称" align="center" prop="product_name" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品ID" align="center"  prop="product_id" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品价格" align="center"  prop="product_price" show-overflow-tooltip></el-table-column>
        <el-table-column label="总库存量" align="center" prop="total_num" show-overflow-tooltip></el-table-column>
        <el-table-column label="退回数量" align="center" prop="refund_num" show-overflow-tooltip></el-table-column>
        <el-table-column label="已分配量" align="center" prop="allocated_num" show-overflow-tooltip></el-table-column>
        <el-table-column label="可分配量" align="center" prop="allocate_able_num" show-overflow-tooltip></el-table-column>
      </el-table>

      <el-pagination style="margin: 10px 0" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
                     :page-sizes="[5, 7, 10, 15]" :page-size="10" layout="sizes, prev, pager, next" :total=tableData.length>
      </el-pagination>
    </el-card>

  </div>
</template>

<script>
export default {
  name: 'index',
  data(){
    return {
      stockID:'',
      goodID: '',
      tableData: [],
      currentPage: 1,
      pagesize: 10,
    }
  },

  methods:{
    //搜索
    search() {
      if (this.stockID === ''){
        this.$message.error('请输入仓库ID')
      } else if (this.goodID === ''){
        this.$message.success('搜索'+this.stockID)
        //TODO 发请求 仓库所有商品
      } else {
        this.$message.success('搜索'+this.stockID+'----'+this.goodID)
        //TODO 发请求 仓库单一商品
      }
    },
    //重置
    reset() {
      this.stockID=''
      this.goodID=''
    //TODO 发请求 重置list刷新页面
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
    //TODO 获取所有仓库的所有商品库存量

  }
}
</script>

<style scoped>

</style>
