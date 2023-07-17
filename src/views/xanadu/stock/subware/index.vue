<template>
  <div>
    <el-card style="height: 80px" v-show="this.user == 'admin'">
      <el-form :inline="true" >
        <el-form-item label="仓库ID:">
          <el-input type="text" placeholder="请输入你要搜索的仓库ID" v-model="stockID" clearable @clear="reset"></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 10px">
          <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button type="primary" size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin: 10px 0">
      <el-button type="primary" size="default" @click="dialogFormVisible = true" v-show="this.user == 'admin'">添加仓库</el-button>
      <el-button type="primary" size="default" icon="el-icon-refresh-right" @click="reset">刷  新</el-button>
      <!--出入库查询-->
      <el-switch v-model="inout" active-text="出库查询" inactive-text="入库查询" style="margin-left: 1000px"></el-switch>

      <el-table ref="multipleTable" style="margin-top: 10px" border stripe :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)">
        <el-table-column label="#" type="index" align="center"></el-table-column>
        <el-table-column label="ID" align="center" width="50" prop="id" show-overflow-tooltip>
          <template slot-scope="{row}">
            <subware :id="row.id"></subware>
          </template>
        </el-table-column>
        <el-table-column label="仓库名称" align="center" width="100" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="仓库地址" align="center" width="100" prop="address" show-overflow-tooltip></el-table-column>
        <el-table-column label="仓库城市地址" align="center" width="100" prop="city" show-overflow-tooltip></el-table-column>
        <el-table-column label="仓库经度" align="center" width="100" prop="x" show-overflow-tooltip></el-table-column>
        <el-table-column label="仓库纬度" align="center" width="100" prop="y" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="default" icon="el-icon-edit" @click="editStock(scope.row)" >编辑</el-button>
            <el-button type="primary" size="default" icon="el-icon-delete" style="background-color: red; border: red" @click="open(scope.row)">删除</el-button>
            <el-button type="primary" size="default" icon="el-icon-files" style="background-color: green; border: green" @click="goto(scope.row)">库存量查询</el-button>
            <el-button type="primary" v-show="inout" size="default" icon="el-icon-printer" style="background-color: orange; border: orange" @click="goto1(scope.row)">领货出库</el-button>
            <el-button type="primary" v-show="inout" size="default" icon="el-icon-printer" style="background-color: orange; border: orange" @click="goto2(scope.row)">退货出库</el-button>
            <el-button type="primary" v-show="!inout" size="default" icon="el-icon-printer" style="background-color: orange; border: orange" @click="goto3(scope.row)">调拨入库</el-button>
            <el-button type="primary" v-show="!inout" size="default" icon="el-icon-printer" style="background-color: orange; border: orange" @click="goto4(scope.row)">入库记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin: 10px 0" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
                     :page-sizes="[5, 7, 10, 15]" :page-size="10" layout="sizes, prev, pager, next" :total=tableData.length v-show="this.user == 'admin'">
      </el-pagination>
    </el-card>

    <!--子页面添加仓库-->
    <el-dialog title="添加仓库" v-if="dialogFormVisible" :visible.sync="dialogFormVisible">
      <mapview @showMapView="showMapView"></mapview>
    </el-dialog>

    <!--子页面编辑仓库-->
    <el-dialog title="编辑仓库" v-if="dialogFormVisible1" :visible.sync="dialogFormVisible1">
      <updateView :inputID="editID"
                  :inputAddress="editaddress"
                  :inputName="editName"
                  :inputCity="editCity"
                  :inputX="editX"
                  :inputY="editY"
                  @showUpdateView="showUpdateView"></updateView>
    </el-dialog>
  </div>
</template>

<script>

import mapview from './mapView.vue'
import updateView from './updateView'

import { subwareByID,subwareAll ,subwareDetele } from '@/api/ware'
import Subware from '@/components/detail/subware.vue'

export default {
  components:{
    Subware,
    mapview:mapview,
    updateView:updateView
  },
  name: 'index',
  data(){
    return {
      stockID: '',
      editID:'',
      editName:'',
      editaddress:'',
      editMaster:'',
      editCity:'',
      editX:'',
      editY:'',
      tableData: [],
      currentPage: 1,
      pagesize: 10,
      dialogFormVisible: false,
      dialogFormVisible1:false,
      inout: true,
      subwareId:'',
      user:''
    }
  },
  watch:{
    dialogFormVisible:{
      handler(){
        this.reset()
      }
    },
    dialogFormVisible1:{
      handler() {
        this.reset()
      }
    }
  },
  methods: {
    //跳转库存量
    goto(row){
      this.$router.push(({
        path:'/stock/subwareStorage1',
        query:{stockId:row.id}
      }))
    },
    //跳转领货出库
    goto1(row){
      this.$router.push(({
        path:'/stock/subOutput/subOutput1',
        query:{stockId:row.id}
      }))
    },
    //跳转退货出库
    goto2(row){
      this.$router.push(({
        path:'/stock/subOutput/subOutput2',
        query:{stockId:row.id}
      }))
    },
    //跳转调拨入库
    goto3(row){
      this.$router.push(({
        path:'/stock/subInput/subInput1',
        query:{stockId:row.id}
      }))
    },
    //跳转退货入库
    goto4(row){
      this.$router.push(({
        path:'/stock/subInput/subInput2',
        query:{stockId:row.id}
      }))
    },

    //搜索
    search() {
      if (this.stockID === ''){
        this.$message.error('请输入仓库ID')
      } else {
        var flag = true
        var numReg = /^[0-9]+$/
        var numTe = new RegExp(numReg)
        flag = numTe.test(this.stockID)
        if (!flag){
          this.$message({
            type: 'error',
            message: '输入信息不合法'
          });
        } else {
          subwareByID(this.stockID).then(res=>{
            var list=[]
            list.push(res.data)
            this.tableData=list
          })
        }
      }
    },

    //重置
    reset() {
      this.stockID=""
      this.tableData = []
      subwareAll().then(res=>{
        if (this.user == 'admin'){
          this.tableData = res.data;
        } else {
          for (let i = 0;i < res.data.length;i++){
            if (res.data[i].id == this.subwareId)
              this.tableData.push(res.data[i])
          }
        }
      })
    },

    //编辑仓库
    editStock(row) {
      this.editID = row.id
      subwareByID(this.editID).then(res=>{
        this.editaddress = res.data.address
        this.editName = res.data.name
        this.editCity = res.data.city
        this.editX = res.data.x
        this.editY = res.data.y
        this.dialogFormVisible1 = true
      })
    },

    open(row){
      this.$confirm('此操作将永久删除该仓库，若该仓库存在订单则无法删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteStock(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    //删除仓库
    deleteStock(row) {
      subwareDetele(row.id).then(res=>{
        console.log(res)
        if (res.msg === '删除分库成功'){
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
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
    showMapView(data){
      this.dialogFormVisible = data
    },
    showUpdateView(data){
      this.dialogFormVisible1 = data
    }
  },
  mounted() {
    this.user = this.$cookies.get('username')
    this.user = this.$store.getters.name
    this.subwareId = this.$cache.session.get('subwareProcessing')
    subwareAll().then(res=>{
      if (this.user == 'admin'){
        this.tableData = res.data;
      }else {
        for (let i = 0;i < res.data.length;i++){
          if (res.data[i].id == this.subwareId)
            this.tableData.push(res.data[i])
        }
      }
    })
  }
}

</script>

<style scoped>

</style>
