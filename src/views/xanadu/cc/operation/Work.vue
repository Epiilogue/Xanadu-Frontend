<template>
  <!-- 工作量表格 -->
  <el-card style="margin: 10px 0" v-if="true">
    <el-table :key="0" :row-key="(row) => row.id" :data="list" ref="table" border fit highlight-current-row
              style="width: 100%" :v-loading="listLoading"
    >
      <el-table-column label="操作员编号" prop="productId" width="100" align="center">
        <template slot-scope="{row}">
          <user :id="row.userId"/>
        </template>
      </el-table-column>

      <el-table-column label="商品编号" prop="productId" width="100" align="center">
        <template slot-scope="{row}">
          <product :id="row.productId"></product>
        </template>
      </el-table-column>
      <el-table-column label="商品类型" prop="productType" width="100" align="center">
      </el-table-column>
      <el-table-column label="商品名称" prop="productName" width="400" align="center">
      </el-table-column>
      <el-table-column label="订单类型" align="center">
        <el-table-column label="新订" align="center">
          <el-table-column prop="newCount" label="订单笔数" width="100" align="center">
          </el-table-column>
          <el-table-column prop="newNumber" label="商品总数" width="100" align="center">
          </el-table-column>
          <el-table-column prop="newAmount" label="交易金额" width="100" align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column label="退订" align="center">
          <el-table-column prop="cancelCount" label="订单笔数" width="100" align="center">
          </el-table-column>
          <el-table-column prop="cancelNumber" label="商品总数" width="100" align="center">
          </el-table-column>
          <el-table-column prop="cancelAmount" label="交易金额" width="100" align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column label="换货" align="center">
          <el-table-column prop="exchangeCount" label="订单笔数" width="100" align="center">
          </el-table-column>
          <el-table-column prop="exchangeNumber" label="商品总数" width="100" align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column label="退货" align="center">
          <el-table-column prop="returnCount" label="订单笔数" width="100" align="center">
          </el-table-column>
          <el-table-column prop="returnNumber" label="商品总数" width="100" align="center">
          </el-table-column>
          <el-table-column prop="returnAmount" label="交易金额" width="100" align="center">
          </el-table-column>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination style="margin: 10px 0" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page.sync="currentPage" :page-sizes="[5, 7, 10, 15]" :page-size="10"
                   layout="sizes, prev, pager, next"
                   :total=total
    >
    </el-pagination>
  </el-card>
</template>

<script>

import product from '@/components/detail/product'

export default {
  name: 'WorkList',
  props: ['list', 'total'],
  components: { product },
  data() {
    return {
      // 工作量分页
      currentPage: 1,
      pageSize: 10,

      listLoading: false
    }
  },
  methods: {

    //分页
    handleSizeChange(newSize) {
      this.pagesize = newSize
    },
    // 分页组件监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.currentPage = newPage
    }
  }
}

</script>
