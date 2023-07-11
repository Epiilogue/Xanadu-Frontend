<template>
  <div>
    <div class="link-type" @click="getTask(taskId)">
      {{ taskId }}
    </div>
    <el-dialog title="任务详情查看" :visible.sync="dialogVisible" style="width: 70%;padding-left: 5%">
      <el-form ref="dataForm" :model="taskVo" label-position="left" label-width="35%"
               style="width: 85%; margin-left:20%;"
      >
        <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop">
          <el-divider direction="vertical"></el-divider>
          <span>{{ taskVo[field.prop] }}</span>
        </el-form-item>
      </el-form>
      <el-descriptions title="商品信息">
      </el-descriptions>
      <el-table :data="taskVo.products" border fit highlight-current-row>
        <el-table-column prop="id" label="商品ID"></el-table-column>
        <el-table-column prop="productName" label="商品名" width="400"></el-table-column>
        <el-table-column prop="number" label="数量"></el-table-column>
        <el-table-column prop="price" label="商品单价"></el-table-column>
        <el-table-column prop="productCategary" label="商品大类"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getTaskById } from '@/api/dpc-dispatch'

export default {
  name: 'taskvo',
  props: ['taskId'],
  data() {
    return {
      dialogVisible: false,
      formFields: [
        { label: '任务单ID', prop: 'id' },
        { label: '接收人姓名', prop: 'receiverName' },
        { label: '接收人电话', prop: 'phone' },
        { label: '送货地址', prop: 'deliveryAddress' },
        { label: '分站ID', prop: 'subId' },
        { label: '商品总数', prop: 'numbers' },
        { label: '商品总价', prop: 'totalAmount' },
        { label: '要求完成日期', prop: 'deadline' },
        { label: '任务类型', prop: 'taskType' },
        { label: '任务状态', prop: 'taskStatus' },
      ],
      taskVo: {}
    }
  },
  methods: {
    getTask(taskId) {
      this.dialogVisible = true
      getTaskById(taskId).then(res => {
        this.taskVo = res.data
      }).catch(error => {
        // 处理请求异常的逻辑
      })
    }
  }
}
</script>

<style scoped>
.link-type {
  cursor: pointer;
}
</style>
