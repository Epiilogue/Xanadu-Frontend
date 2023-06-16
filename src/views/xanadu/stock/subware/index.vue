<template>
  <div>
    <el-card style="height: 80px">
      <el-form :inline="true" class="form">
        <el-form-item label="仓库ID:">
          <el-input type="text" placeholder="请输入你要搜索的仓库ID" v-model="stockID" clearable @clear="reset"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="default" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button type="primary" size="default" icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin: 10px 0">
      <el-button type="primary" size="default" @click="dialogFormVisible = true">添加仓库</el-button>
      <el-button type="primary" size="default" icon="el-icon-refresh-right" @click="refreshform">刷  新</el-button>
      <el-table ref="multipleTable" style="margin-top: 10px" border stripe :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)">
        <el-table-column label="#" type="index" align="center"></el-table-column>
        <el-table-column label="仓库ID" align="center" width="100" prop="id"></el-table-column>
        <el-table-column label="仓库名称" align="center" width="150" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="仓库地址" align="center" width="150" prop="address" show-overflow-tooltip></el-table-column>
        <el-table-column label="仓库城市地址" align="center" width="150" prop="city" show-overflow-tooltip></el-table-column>
        <el-table-column label="仓库经度" align="center" width="150" prop="x" show-overflow-tooltip></el-table-column>
        <el-table-column label="仓库纬度" align="center" width="150" prop="y" show-overflow-tooltip></el-table-column>
        <el-table-column label="仓库管理员" align="center" width="150" prop="master" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="default" icon="el-icon-edit" @click="editStock(scope.row)" >编辑</el-button>
            <el-button type="primary" size="default" icon="el-icon-delete" style="background-color: red; border: red" @click="deleteStock(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin: 10px 0" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
                     :page-sizes="[5, 7, 10, 15]" :page-size="10" layout="sizes, prev, pager, next" :total=tableData.length>
      </el-pagination>
    </el-card>

    <!--子页面添加仓库-->
    <el-dialog title="添加仓库" v-if="dialogFormVisible" :visible.sync="dialogFormVisible1">
      <mapview @showMapView="showMapView"></mapview>
    </el-dialog>

    <!--子页面编辑仓库-->
    <el-dialog title="编辑仓库" v-if="dialogFormVisible1" :visible.sync="dialogFormVisible1">
      <updateView :inputID="editID"
                  :inputAddress="editaddress"
                  :inputName="editName"
                  :inputMaster="editMaster"
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

import { subwareByID,subwareAll ,subwareDetele} from '@/api/ware'

export default {
  components:{
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

      dialogFormVisible: false,
      dialogFormVisible1:false,
      tableData: [],
      currentPage: 1,
      pagesize: 10,
    }
  },

  methods: {
    //搜索
    search() {
      if (this.stockID === ''){
        this.$message.error('请输入仓库ID')
      } else {
        subwareByID(this.stockID).then(res=>{
          var list=[]
          list.push(res.data)
          this.tableData=list
          console.log(this.tableData)
        })
      }
    },
    //重置
    reset() {
      this.stockID=""
      subwareAll().then(res=>{
        this.tableData = res.data;
      })
    },
    //编辑仓库
    editStock(row) {
      this.editID = row.id
      subwareByID(this.editID).then(res=>{
        this.editaddress = res.data.address
        this.editName = res.data.name
        this.editMaster = res.data.master
        this.editCity = res.data.city
        this.editX = res.data.x
        this.editY = res.data.y
        this.dialogFormVisible1 = true
      })
    },
    //删除仓库
    deleteStock(row) {
      console.log(row.id)
      subwareDetele(row.id).then(res=>{
        console.log(res)
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
    //刷新表单
    refreshform(){
      subwareAll().then(res=>{
        this.tableData = res.data;
      })
    },
    showMapView(data){
      this.dialogFormVisible = data
    },
    showUpdateView(data){
      this.dialogFormVisible1 = data
    }
  },
  mounted() {
    subwareAll().then(res=>{
      this.tableData = res.data;
    })
  }
}

</script>

<style scoped>
.form{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dialog-footer{
  display: flex;
  justify-content: center;
}
</style>
