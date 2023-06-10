<template>
  <div class="app-container">
    <div style="margin: 0px 0px 5px">
      <el-button type="primary" plain @click="handleReturnPd()">
        提交商品订单
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      :row-key="(row) => row.id"
      :data="list"
      ref="table"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @select="selectOne"
    >
      <el-table-column
        type="selection"
        width="120"
        align="center"
        fixed
        reserve-selection
      >
      </el-table-column>
      <el-table-column
        v-if="newOrder"
        label="ID"
        prop="id"
        align="center"
        width="100"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="newOrder"
        label="商品名称"
        width="100"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="newOrder"
        label="商品图片"
        width="100"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.picture }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!newOrder"
        label="ID"
        prop="id"
        align="center"
        width="100"
      >
        <template slot-scope="{ row }">
          <span>{{ row.productId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!newOrder"
        label="商品名称"
        width="100"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.productName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="价格" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品大类" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.categary }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="newOrder"
        label="一级分类ID"
        width="200"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.firstCategray }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="newOrder"
        label="二级分类ID"
        width="200"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.secondCategray }}</span>
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
      <el-table-column v-if="newOrder" label="备注" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.comment }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!newOrder"
        label="原购买数量"
        width="100"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="`${this.opType}数量`"
        min-width="200"
        align="center"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <el-input-number
            v-model="row.opNumber"
            :min="0"
            :max="row.number ? row.number : maxNum"
            :disabled="row.disabled === undefined ? true : row.disabled"
            width="80"
            size="small"
            @change="changeNum(row)"
          ></el-input-number>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0 && this.newOrder"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getProductList, getOrder } from "@/api/order";
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
      total: 0,
      listLoading: true,
      tableKey: 0,

      // 查询条件
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        orderId: undefined,
        orderType: undefined,
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
    this.listQuery.orderType =
      this.$cache.local.getJSON("operateOrder").orderType; // 订单类型
    this.newOrder = this.opType === "新订"; //是否新订
    if (!this.newOrder) {
      this.listQuery.orderId = this.$route.query.orderId;
      this.getListOfOrder();
    } else {
      // 新订
      this.getList();
    }
  },
  methods: {
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
    // 分页所有商品
    getList() {
      this.listLoading = true;
      // 加载商品列表
      getProductList(this.listQuery).then((res) => {
        let list = res.data.records;
        // 已选商品回显
        let count = 0;
        this.selectedProduct.filter((selectPro, index, arr) => {
          // 当前页全部回显
          if (count == list.length) {
            return;
          }
          list.filter((pro, index, arr) => {
            if (pro.id === selectPro.id) {
              arr.splice(index, 1, selectPro);
              count = count + 1;
            }
          });
        });
        // 设置表格信息
        this.list = list;
        this.total = res.data.total;
      });
    },

    // 订单中的商品
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
        this.total = list.length;
      });
    },

    // 提交商品订单
    handleReturnPd() {
      if (!this.currselectedPro) {
        this.$store.commit("SET_PROCHANGED", this.selectedProduct);
        this.$tab.closePage();
        this.$router.back();
        return;
      }
      // 保存最后修改的商品
      let row = { id: this.currselectedPro.id + 1 };
      this.changeNum(row);

      // 修改商品属性名
      this.selectedProduct = this.selectedProduct.map((g) => {
        return {
          productId: this.newOrder ? g.id : g.productId,
          productName: this.newOrder ? g.name : g.productName,
          productCategary: g.categary,
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
