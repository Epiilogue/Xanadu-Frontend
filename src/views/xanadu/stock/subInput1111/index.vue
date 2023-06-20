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
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>

        <!--出入库选择-->
        <el-tooltip content="出入库选选择" placement="top">
          <el-dropdown size="small" split-button type="primary" @command="handleCommand" style="margin-left: 10px">{{ this.type }}
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="出库单">出库单</el-dropdown-item>
              <el-dropdown-item command="入库单">入库单</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-tooltip>

        <el-form-item style="margin-left: 10px">
          <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button type="primary" size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!--表格-->
    <el-card style="margin: 10px 0">
      <el-table v-show="this.type === '出库单' " ref="multipleTable" style="margin-top: 10px" border stripe :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)">
        <el-table-column label="#" type="index" align="center"></el-table-column>
        <el-table-column label="出库单号" align="center"  prop="id" show-overflow-tooltip></el-table-column>
        <el-table-column label="仓库ID" align="center" prop="subware_id" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品ID" align="center" prop="product_id" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品名称" align="center"  prop="product_name" show-overflow-tooltip></el-table-column>
        <el-table-column label="出库数量" align="center"  prop="output_num" show-overflow-tooltip></el-table-column>
        <el-table-column label="出库类型" align="center" prop="output_type" show-overflow-tooltip></el-table-column>
        <el-table-column label="出库时间" align="center" prop="output_time" show-overflow-tooltip></el-table-column>
      </el-table>

      <el-table v-show="this.type === '入库单' " ref="multipleTable" style="margin-top: 10px" border stripe :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)">
        <el-table-column label="#" type="index" align="center"></el-table-column>
        <el-table-column label="入库单" align="center"  prop="id" show-overflow-tooltip></el-table-column>
        <el-table-column label="仓库ID" align="center" prop="subware_id" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品ID" align="center" prop="product_id" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品名称" align="center"  prop="product_name" show-overflow-tooltip></el-table-column>
        <el-table-column label="入库数量" align="center"  prop="input_num" show-overflow-tooltip></el-table-column>
        <el-table-column label="入库类型" align="center" prop="input_type" show-overflow-tooltip></el-table-column>
        <el-table-column label="入库时间" align="center" prop="input_time" show-overflow-tooltip></el-table-column>
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
    return{
      goodID: '',
      tableData: [],
      currentPage: 1,
      pagesize: 10,
      datevalue:'',
      type:"出库单",

    }
  },
  methods:{
    //搜索
    search() {
      if (this.goodID === ''){
        this.$message.success('搜索'+this.goodID)
        //TODO 发请求 仓库所有商品
      } else {
        this.$message.success('搜索'+'       '+this.goodID +'      '+this.datevalue)
        //TODO 发请求 仓库单一商品
      }
    },
    //重置
    reset() {
      this.goodID=''
      this.datevalue=''
      //TODO 发请求 重置list刷新页面
    },
    //出入库选择
    handleCommand(command) {
      this.type = command
      //TODO
    },



    //分页
    handleSizeChange(newSize) {
      this.pagesize = newSize
    },
    // 分页组件监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.currentPage = newPage
    },
  }
}
</script>

<style scoped>

</style>
