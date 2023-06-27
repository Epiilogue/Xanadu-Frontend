<template>
  <div>
    <div class="link-type" @click="getStockOut(id)">
      {{ id }}
    </div>
    <el-dialog title="缺货记录详情查看" :visible.sync="dialogFormVisible" style="width: 100%;padding-left: 5%">

        <el-form ref="dataForm" :model="temp" label-position="left" label-width="35%" style="width: 85%; margin-left: 180px;">
          <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop">
            <span>{{ temp[field.prop] }}</span>
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
      temp: {},
      formFields: [
        { label: '缺货记录ID', prop: 'id' },
        { label: '产品ID', prop: 'productId' },
        { label: '订单ID', prop: 'orderId' },
        { label: '创建客服', prop: 'createBy' },
        { label: '缺货数量', prop: 'needNumbers' },
        { label: '退货单状态', prop: 'status' },
        { label: '创建时间', prop: 'createTime' },
      ]
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
