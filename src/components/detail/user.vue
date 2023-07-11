<template>
  <div>
    <div class="link-type" @click="getUser(id)">
      {{ id }}
    </div>
    <el-dialog title="用户详情查看" :visible.sync="dialogFormVisible" style="width: 100%;padding-left: 5%">
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
import { getUser } from '@/api/system/user'

export default {
  name: 'user',
  props: ['id'],
  data() {
    return {
      dialogFormVisible: false,
      formFields: [
        { label: '用户编号', prop: 'userId' },
        { label: '用户名称', prop: 'userName' },
        { label: '用户昵称', prop: 'nickName' },
        { label: '职务', prop: 'remark' },
        { label: '手机号码', prop: 'phonenumber' },
        { label: '邮箱号码', prop: 'email' },
      ],
      temp: {} // Initialize an empty object to hold the form data
    };
  },

  methods: {
    getUser(id) {
      this.dialogFormVisible = true
      getUser(id).then(res => {
        this.temp = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
