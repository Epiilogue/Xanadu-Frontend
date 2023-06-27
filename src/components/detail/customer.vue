<template>
  <div>
    <div class="link-type" @click="getCustomer(id)">
      {{ id }}
    </div>
    <el-dialog title="客户详情查看" :visible.sync="dialogFormVisible" style="width: 100%;padding-left: 5%">
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
        { label: '客户名称', prop: 'name' },
        { label: '身份证号', prop: 'identityCard' },
        { label: '收货地址', prop: 'address' },
        { label: '联系电话', prop: 'telephone' },
        { label: '工作单位', prop: 'organization' },
        { label: '邮政编码', prop: 'postcode' }
      ],
      temp: {} // Initialize an empty object to hold the form data
    };
  },

  methods: {
    getCustomer(id) {
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
