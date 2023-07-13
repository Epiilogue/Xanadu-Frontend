<template>
  <div>
    <div class="link-type" @click="subwareByID(id)">
      {{ id }}
    </div>
    <el-dialog title="分库详情查看" :visible.sync="dialogFormVisible" style="width: 100%;padding-left: 5%">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="35%" style="width: 85%; margin-left: 180px;">
        <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop">
          <span>{{ temp[field.prop] }}</span>
        </el-form-item>
      </el-form>

    </el-dialog>

  </div>

</template>

<script>
import { subwareByID } from '@/api/ware'

export default {
  name: 'subware',
  props: ['id'],
  data() {
    return {
      dialogFormVisible: false,
      temp: {},
      formFields: [
        { label: '分库房ID', prop: 'id' },
        { label: '库房名称', prop: 'name' },
        { label: '库房地址', prop: 'address' },
        { label: '经度', prop: 'x' },
        { label: '纬度', prop: 'y' },
        { label: '分库城市地址', prop: 'city' }
      ],
    }
  },
  methods: {
    subwareByID(id) {
      this.dialogFormVisible = true
      subwareByID(id).then(res => {
        this.temp = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
