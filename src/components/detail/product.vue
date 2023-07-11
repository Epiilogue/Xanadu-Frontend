<template>
  <div>
    <div class="link-type" @click="getProduct(id)">
      {{ id }}
    </div>
    <el-dialog title="商品详情查看" :visible.sync="dialogFormVisible" style="width: 100%;padding-left: 5%">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="35%" style="width: 85%; margin-left: 180px;">
        <el-image v-if="temp.picture" style="width: 100px; height: 100px; margin-right: 180px;" :src="temp.picture"></el-image>
        <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop">
          <span>{{ temp[field.prop] }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>

</template>

<script>
import { getOneProduct } from '@/api/distribution'

export default {
  name: 'product',
  props: ['id'],
  data() {
    return {
      formFields: [
        { label: '货物名称', prop: 'name' },
        { label: '价格', prop: 'price' },
        { label: '成本', prop: 'cost' },
        { label: '供应商ID', prop: 'supplierId' },
        { label: '是否可退货', prop: 'refundAble' },
        { label: '是否可换货', prop: 'changeAble' },
        { label: '安全库存量', prop: 'safeStock' },
        { label: '最大库存量', prop: 'maxCount' },
        { label: '备注', prop: 'comment' },
        { label: '商品大类', prop: 'firstCategray' },
        { label: '商品小类', prop: 'secondCategray' }
      ],
      dialogFormVisible: false,
      temp: {}
    }
  },
  methods: {
    getProduct(id) {
      this.dialogFormVisible = true
      getOneProduct(id).then(res => {
        console.log(res.data)
        this.temp = res.data
        // 退换货格式转换
        this.temp.refundAble=this.temp.refundAble?'可退货':'不可退货'
        this.temp.changeAble=this.temp.changeAble?'可换货':'不可换货'
      })
    }
  }
}
</script>

<style scoped>

</style>
