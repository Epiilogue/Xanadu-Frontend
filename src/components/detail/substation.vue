<template>
  <div>
    <div class="link-type" @click="getStockOut(id)">
      {{ id }}
    </div>
    <el-dialog title="分站信息详情查看" :visible.sync="dialogFormVisible" style="width: 100%;padding-left: 5%">

      <el-form ref="dataForm" :model="temp" label-position="left" label-width="35%" style="width: 85%; margin-left: 180px;">
        <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop">
          <span>{{ temp[field.prop] }}</span>
        </el-form-item>
      </el-form>

    </el-dialog>

  </div>

</template>

<script>
import { timestampToTime } from '@/utils/ruoyi'
import { fetchSubStationById } from '@/api/sub'

export default {
  name: 'substation',
  props: ['id'],
  data() {
    return {
      dialogFormVisible: false,
      temp: {},
      formFields: [
        { label: '分站ID', prop: 'id' },
        { label: '分站名称', prop: 'name' },
        { label: '分站地址', prop: 'address' },
        { label: '联系电话', prop: 'phone' },
        { label: '分库id', prop: 'subwareId' },
      ]
    }
  },
  methods: {
    timestampToTime() {
      return timestampToTime
    },
    getStockOut(id) {
      this.dialogFormVisible = true
      fetchSubStationById(id).then(res => {
        this.temp = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
