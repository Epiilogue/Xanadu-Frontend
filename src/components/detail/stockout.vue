<template>
  <div>
    <div class="link-type" @click="getStockOut(id)">
      {{ id }}
    </div>
    <el-dialog title="缺货记录详情查看" :visible.sync="dialogFormVisible" style="width: 100%;padding-left: 5%">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="35%"
               style="width: 75%; margin-left:160px;"
      >
        <el-form-item label="缺货记录ID" prop="id">
          <span>{{ temp.id }}</span>
        </el-form-item>
        <el-form-item label="产品ID" prop="productId">
          <span>{{ temp.productId }}</span>
        </el-form-item>
        <el-form-item label="订单ID" prop="orderId">
          <span>{{ temp.orderId }}</span>

        </el-form-item>
        <el-form-item label="创建客服" prop="createBy">
          <span>{{ temp.createBy }}</span>
        </el-form-item>
        <el-form-item label="缺货数量" prop="needNumbers">
          <span>{{ temp.needNumbers }}</span>
        </el-form-item>
        <el-form-item label="退货单状态" prop="status">
          <span>{{ temp.status}}</span>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <span>{{ timestampToTime()(temp.createTime) }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>

</template>

<script>
import { getOneProduct } from '@/api/distribution'
import { timestampToTime } from '@/utils/ruoyi'
import { getOneStockOut } from '@/api/customer'

export default {
  name: 'stockOut',
  props: ['id'],
  data() {
    return {
      dialogFormVisible: false,
      temp: {
        id: undefined,
        name: '',
        createBy:'',
        needNumbers:'',
        productId:'',
        orderId:'',
        status:'',
        price: '',
        cost: '',
        supplierId: '',
        firstCategray: '',
        secondCategray: '',
        refundAble: false,
        changeAble: false,
        comment: '',
        safeStock: '',
        maxCount: '',
        createTime: '',
        updateTime: new Date(),
        picture: '',
        deleted: false
        //status: 'published'
      }
    }
  },
  methods: {
    timestampToTime() {
      return timestampToTime
    },
    getStockOut(id) {
      this.dialogFormVisible = true
      getOneStockOut(id).then(res => {
        this.temp = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
