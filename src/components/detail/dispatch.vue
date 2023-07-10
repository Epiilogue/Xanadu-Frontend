<template>
  <div>
    <div class="link-type" @click="getDispatch(id)">
      {{ id }}
    </div>
    <el-dialog title="调拨单详情查看" :visible.sync="dialogFormVisible" style="width: 100%;padding-left: 5%">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="35%" style="width: 85%; margin-left:20%;">
        <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop" :disabled="field.editAble">
          <el-divider direction="vertical"></el-divider>
          <span>{{ temp[field.prop] }}</span>
        </el-form-item>

      </el-form>

    </el-dialog>

  </div>

</template>

<script>
import { getDispatch } from '@/api/dpc-dispatch'

export default {
  name: 'customer',
  props: ['id'],
  data() {
    return {
      dialogFormVisible: false,

      formFields: [
        { label: '分库编号', prop: 'subwareId',editAble:false},
        { label: '任务单编号', prop: 'taskId',editAble:false },
        { label: '商品编号', prop: 'productId',editAble:false },
        { label: '商品名称', prop: 'productName',editAble:false },
        { label: '商品分类', prop: 'productCategory',editAble:false },
        { label: '调拨单状态', prop: 'status',editAble:false },
        { label: '分站编号', prop: 'substationId',editAble:true },
        { label: '商品数量', prop: 'productNum',editAble:true },
        { label: '计划出库时间', prop: 'planTime',editAble:true }
      ],
      temp: {} // Initialize an empty object to hold the form data
    };
  },

  methods: {
    getDispatch(id) {
      this.dialogFormVisible = true
      getDispatch(id).then(res => {
        this.temp = res.data
        // 日期格式转换
        this.temp.planTime = this.$moment(new Date(this.temp.planTime)).format("YYYY-MM-DD")
      })
    }
  }
}
</script>

<style scoped>

</style>
