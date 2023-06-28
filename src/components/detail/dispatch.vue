<template>
  <div>
    <div class="link-type" @click="getDispatch(id)">
      {{ id }}
    </div>
    <el-dialog title="调拨单详情查看" :visible.sync="dialogFormVisible" style="width: 100%;padding-left: 5%">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="35%" style="width: 85%; margin-left:20%;">
        <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop">
          <el-divider direction="vertical"></el-divider>
          <span>{{ temp[field.prop] }}</span>
        </el-form-item>

      </el-form>

    </el-dialog>

  </div>

</template>

<script>
import { getOneProduct } from '@/api/distribution'
import { getCustomer } from '@/api/cc-customer'

export default {
  name: 'customer',
  props: ['id'],
  data() {
    return {
      dialogFormVisible: false,

      formFields: [
        { label: '分库编号', prop: 'subwareId' },
        { label: '任务单编号', prop: 'taskOrderId' },
        { label: '商品编号', prop: 'productId' },
        { label: '商品名称', prop: 'productName' },
        { label: '商品分类', prop: 'productCategory' },
        { label: '调拨单状态', prop: 'transferStatus' },
        { label: '分站编号', prop: 'substationId' },
        { label: '商品数量', prop: 'productQuantity' },
        { label: '计划出库时间', prop: 'plannedOutboundTime' }
      ],
      temp: {} // Initialize an empty object to hold the form data
    };
  },

  methods: {
    getDispatch(id) {
      this.dialogFormVisible = true
      getCustomer(id).then(res => {
        this.temp = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
