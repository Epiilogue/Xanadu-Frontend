<template>
  <div>
    <div class="link-type" @click="getSupplier(id)">
      {{ id }}
    </div>
    <el-dialog title="供应商详情查看" :visible.sync="dialogFormVisible" style="width: 100%;padding-left: 5%">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="35%" style="width: 85%; margin-left:20%;">
        <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop">
          <span>{{ temp[field.prop] }}</span>
        </el-form-item>
      </el-form>


    </el-dialog>

  </div>

</template>

<script>
import { getOneProduct } from '@/api/distribution'
import { getCustomer } from '@/api/cc-customer'
import { getSupplier } from '@/api/dbc-supplier'

export default {
  name: 'supplier',
  props: ['id'],
  data() {
    return {
      dialogFormVisible: false,
      formFields: [
        { label: '供应商名称', prop: 'name' },
        { label: '地址', prop: 'address' },
        { label: '联系人', prop: 'contactPerson' },
        { label: '联系电话', prop: 'phone' },
        { label: '开户行', prop: 'bankAccount' },
        { label: '备注', prop: 'remarks' }
      ],
      temp: {} // Initialize an empty object to hold the form data
    };
  },
  methods: {
    getSupplier(id) {
      this.dialogFormVisible = true
      getSupplier(id).then(res => {
        this.temp = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
