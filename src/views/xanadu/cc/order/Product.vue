<template>
  <div class="app-container">
    <div style="margin: 0px 0px 5px">
      <!-- 商品查询 -->
      <el-form :inline="true" style="margin: 0px;">
        <el-form-item label="商品名称">
          <el-input v-model="listQuery.name" placeholder="商品名称" style="width: 200px; margin-right: 5px"
            class="filter-item" clearable @clear="handleFilter" />
        </el-form-item>
        <el-form-item label="一级分类">
          <el-input v-model="listQuery.firstName" placeholder="一级分类" style="width: 200px; margin-right: 5px"
            class="filter-item" clearable @clear="handleFilter" />
        </el-form-item>
        <el-form-item>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" plain
            @click="handleFilter">查询</el-button>
          <el-button type="primary" @click="handleReturnPd()">提交商品订单</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :row-key="(row) => row.id" :data="pageList" ref="table" border fit
      highlight-current-row style="width: 100%" @select="selectOne">
      <el-table-column type="selection" width="120" align="center" fixed reserve-selection>
      </el-table-column>
      <el-table-column v-if="newOrder" label="ID" prop="id" align="center" width="100">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="newOrder" label="商品名称" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="newOrder" label="商品图片" width="100" align="center">
        <template slot-scope="{ row }">
          <img :src="row.picture" width="40" height="40" class="head_pic" />
        </template>
      </el-table-column>

      <el-table-column v-if="!newOrder" label="ID" prop="id" align="center" width="100">
        <template slot-scope="{ row }">
          <span>{{ row.productId }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!newOrder" label="商品名称" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="能否退货" class-name="status-col" width="100">
        <template slot-scope="{ row }">
          <el-tag :type="row.refundAble ? 'success' : 'danger'">
            {{ row.refundAble ? "可退货" : "不可退货" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="能否换货" class-name="status-col" width="100">
        <template slot-scope="{ row }">
          <el-tag :type="row.changeAble ? 'success' : 'danger'">
            {{ row.changeAble ? "可换货" : "不可换货" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="newOrder" label="一级分类" width="200" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.firstName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="newOrder" label="二级分类" width="200" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.secondName }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="newOrder" label="备注" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.comment }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!newOrder" label="原购买数量" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="`${this.opType}数量`" min-width="200" align="center" fixed="right">
        <template slot-scope="{ row }">
          <el-input-number v-model="row.opNumber" :min="0" :max="row.number ? row.number : maxNum"
            :disabled="row.disabled === undefined ? true : row.disabled" width="80" size="small"
            @change="changeNum(row)"></el-input-number>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="1" :page-sizes="[1, 2, 5, 7]" :page-size="5" layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>

import { getProductList, getOrder } from "@/api/cc-order";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "ProductList",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      // 表格信息
      list: [],
      queryList: [],
      pageList: [],
      total: 0,
      listLoading: true,
      tableKey: 0,
      // 分页
      currentPage: 1,//默认显示第一页
      pageSize: 5,//默认每页显示5条

      // 查询条件
      listQuery: {
        orderId: undefined,
        orderType: undefined,

        name: '',
        firstName: '',
      },

      opType: undefined,

      // 选购信息
      selectedProduct: [], //可以做缓存
      currselectedPro: undefined, //当前设置选购数量的行

      opNumber: 0, // 当前选购的商品的数量
      maxNum: 10000, // 商品最大可购买数量

      refundOptions: ["不可退货", "可退货"],
      changeOptions: ["不可换货", "可换货"],

      newOrder: true, //是否新订
    };
  },
  created() {
    this.opType = this.$route.query.opType; // 操作类型
    this.newOrder = this.opType === "新订"; //是否新订
    this.listQuery.orderType = this.$route.query.orderType
    if (!this.newOrder) {
      this.listQuery.orderId = this.$route.query.orderId
      this.getListOfOrder();
    } else {
      // 新订
      this.getList();
    }
  },
  methods: {
    // 所有商品:新订
    getList() {
      this.listLoading = true;
      // 加载商品列表
      getProductList().then((res) => {
        let list = res.data;
        // 设置表格信息
        this.list = list;
        this.queryList = list
        this.total = res.data.length;
        this.getPageList()
        this.listLoading = false;
      }).catch(this.listLoading = false);
    },

    // 订单中的商品：退换货 退订
    getListOfOrder() {
      this.listLoading = true;
      // 加载商品列表
      getOrder(this.listQuery).then((res) => {
        if (res.data === null) {
          this.$router.back();
        }
        let list = res.productList;
        // 设置表格信息
        this.list = list;
        this.queryList = list;
        this.total = list.length;
        this.getPageList()
        this.listLoading = false
      }).catch(this.listLoading = false);
    },

    // 查询
    handleFilter() {
      this.listLoading = true;
      this.queryList = this.list.filter((product) => {
        // 查询条件 商品名称 一级分类编号
        let query = this.listQuery
        if (query.firstName !== '' && product.firstName !== query.firstName) {
          return false
        }
        if (query.name !== '') {
          if((this.newOrder && product.name.indexOf(query.name) === -1) || product.productName.indexOf(query.name)===-1) return false
        }
        return true
      });
      this.listLoading = false;
      if (this.queryList.length === 0) {
        this.$message({
          type: 'error',
          message: '没有符合条件的商品',
          durarion: 1000,
        });
      } else {
        this.total=this.queryList.length
        this.$message({
          type: 'success',
          message: '查询成功',
          durarion: 1000,
        });
      }
      this.getPageList()
    },
    // 分页
    handleSizeChange(newSize){
      this.pageSize = newSize
      this.getPageList()
    },
    handleCurrentChange(newPage){
      this.currentPage = newPage
      this.getPageList()
    },
    // 回显
    getPageList() {
      // 当前页已选商品回显
      let count = 0;
      let page=this.queryList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      this.selectedProduct.filter((selectPro, index, arr) => {
        // 当前页全部回显
        if (count == this.pageSize) {
          return;
        }
        page.filter((pro, index, arr) => {
          if (pro.id === selectPro.id) {
            arr.splice(index, 1, selectPro);
            count = count + 1;
          }
        });
      });
      this.pageList = page
    },

    // 选中的行启用计数器
    selectOne(rows, row) {
      let selected = rows.length && rows.indexOf(row) !== -1;
      // 可退换货
      let op = this.opType;
      let opAble = op === "退货" ? row.refundAble : row.changeAble;
      if (op === "退订") opAble = true;
      if ((this.newOrder || opAble) && selected) {
        // 单选
        row.disabled = false;
      } else {
        // 取消单选
        row.disabled = true;
      }
    },

    // 选购数量改变
    changeNum(row) {
      // 保存上一商品
      if (
        this.currselectedPro !== undefined &&
        this.currselectedPro.id !== row.id
      ) {
        let flag = false;
        let zero = this.currselectedPro.opNumber === 0;
        // 保存过则修改
        this.selectedProduct.filter((selectPro, index, arr) => {
          if (this.currselectedPro.id === selectPro.id) {
            // 商品数量为0删除
            if (zero) {
              arr.splice(index, 1);
              return;
            }
            arr.splice(index, 1, this.currselectedPro);
            flag = true;
            return;
          }
        });
        // 未保存过且数量不为0则新增
        if (!flag && !zero) {
          this.selectedProduct.push(this.currselectedPro);
        }
      }
      // 暂存当前商品
      this.currselectedPro = row;
    },

    // 提交商品订单
    handleReturnPd() {
      if (this.currselectedPro) {
        // 保存最后修改的商品
        let row = { id: this.currselectedPro.id + 1 };
        this.changeNum(row);
      }

      // 修改商品属性名
      this.selectedProduct = this.selectedProduct.map((g) => {
        return {
          productId: this.newOrder ? g.id : g.productId,
          productName: this.newOrder ? g.name : g.productName,
          productCategary: g.firstName,
          price: g.price,
          number: this.newOrder ? g.opNumber : g.number,
          refundAble: g.refundAble,
          changeAble: g.changeAble,
          opNumber: g.opNumber,
        };
      });
      console.log(this.selectedProduct);
      // 保存商品列表
      this.$store.commit("SET_PROCHANGED", this.selectedProduct);
      // 回退到表单页
      this.$tab.closePage();
      this.$router.back();
    },
  },
};
</script>
