<template>
  <div>
    <el-dialog
      title="商品批量选择"
      width="1000px"
      :close-on-click-modal="false"
      :append-to-body="true"
      v-dialogDrag
      class="userDialog"
      :visible.sync="visible"
    >
      <el-container style="height: 500px">
        <el-container>
          <el-header style="text-align: left; font-size: 12px; height: 30px">
            <el-form
              size="small"
              :inline="true"
              ref="searchForm"
              :model="searchForm"
              @keyup.enter.native="refreshList()"
              @submit.native.prevent
            >
              <el-form-item prop="supplierName">
                <el-input
                  size="small"
                  v-model="searchForm.supplierName"
                  placeholder="商品名称"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="refreshList()"
                  size="small"
                  icon="el-icon-search"
                >查询</el-button>
                <el-button
                  @click="resetSearch()"
                  size="small"
                  icon="el-icon-refresh-right"
                >重置</el-button>
              </el-form-item>
            </el-form>
          </el-header>
          <el-main>
            <el-table
              :data="dataList"
              v-loading="loading"
              size="small"
              border
              ref="supplierTable"
              @select="handleSelectionChange"
              height="calc(100% - 40px)"
              style="width: 100%"
            >
              <el-table-column
                type="selection"
                header-align="center"
                align="center"
                width="50"
              >
              </el-table-column>
              <el-table-column
                type="index"
                header-align="center"
                align="left"
                sortable="custom"
                min-width="90"
                label="商品序号"
              >
              </el-table-column>
              <el-table-column
                prop="Name"
                header-align="center"
                align="left"
                sortable="custom"
                min-width="90"
                label="商品名称"
              >
              </el-table-column>
              <el-table-column
                prop="ImgURL"
                header-align="center"
                align="left"
                sortable="custom"
                min-width="110"
                label="图片路径"
              >
              </el-table-column>
              <el-table-column
                prop="Price"
                header-align="center"
                align="center"
                sortable="custom"
                min-width="110"
                label="价格"
              >
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="sizeChangeHandle"
              @current-change="currentChangeHandle"
              :current-page="pageNo"
              :page-sizes="[5, 10, 50, 100]"
              :page-size="pageSize"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
            >
            </el-pagination>
          </el-main>
        </el-container>
      </el-container>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          @click="visible = false"
          icon="el-icon-circle-close"
        >关闭</el-button
        >
        <el-button
          size="small"
          type="primary"
          icon="el-icon-circle-check"
          @click="doSubmit()"
        >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getAllProduct } from '@/api/dbc-product'
import { keyword } from 'chalk'

export default {
  name:"ProductPop",
  data() {
    return {
      searchForm: {
        supplierNo: '',
        supplierName: ''
      },
      dataListAllSelections: [], // 所有选中的数据包含跨页数据
      idKey: "id", // 标识列表数据中每一行的唯一键的名称(需要按自己的数据改一下)
      dataList: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      orders: [],
      loading: false,
      visible: false,
    };
  },
  props: {
    keyword:'',
    selectData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 是否启用单选
    single: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    init() {
      this.visible = true;
      this.$nextTick(() => {
        this.dataListAllSelections = JSON.parse(JSON.stringify(this.selectData));
        this.resetSearch();
      });
    },
    // 获取后台数据，如果searchForm中有值，拿到全部数据后做个过滤，然后按照分页参数分页
    refreshList() {
      this.loading = true;
      console.log(this.keyword)
      getAllProduct(this.keyword).then((res) => {
        this.dataList = res.data;
        this.total = res.data.length;
        this.loading = false;
      }).then(
        ()=>{
          if (this.searchForm.supplierName!==' ') {
            this.dataList = this.dataList.filter((item) => {
              return item.Name.indexOf(this.searchForm.supplierName) > -1;
            });
          }
          this.total = this.dataList.length;
          //按照分页条件分页
          this.dataList = this.dataList.slice(
            (this.pageNo - 1) * this.pageSize,
            this.pageNo * this.pageSize
          );
          this.$nextTick(() => {
            this.setSelectRow();
          });
        }
      );
    },
    // 排序
    resetSearch() {
      this.$refs.searchForm.resetFields();
      this.refreshList();
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageNo = 1;
      this.refreshList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageNo = val;
      this.refreshList();
    },
    // 选中数据
    handleSelectionChange(selection, row) {
      console.log(row)
      if (this.single && selection.length > 1) {
        this.$refs.supplierTable.clearSelection();
        this.$refs.supplierTable.toggleRowSelection(row);
      }
      this.dataListAllSelections = this.single ? [row] : selection
    },
    // 设置选中的方法
    setSelectRow() {
      this.$refs.supplierTable.clearSelection();
      if (!this.dataListAllSelections || this.dataListAllSelections.length <= 0) {
        return;
      }
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataListAllSelections.some(item => item[this.idKey] == this.dataList[i][this.idKey])) {
          this.$refs.supplierTable.toggleRowSelection(this.dataList[i], true);
        }
      }
    },
    doSubmit() {
      this.visible = false;
      this.$emit("doSubmit", this.dataListAllSelections);
    },
  },
};
</script>
<style lang="scss">
.userDialog {
  .el-dialog__body {
    padding: 10px 0px 0px 10px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
  .el-main {
    padding: 20px 20px 5px 20px;
    .el-pagination {
      margin-top: 5px;
    }
  }
}
</style>
