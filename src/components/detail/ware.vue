<template>
  <div>
    <div class="link-type" @click="subwareByID(id)">
      {{ id }}
    </div>
    <el-dialog title="分库详情查看" :visible.sync="dialogFormVisible" style="width: 100%;padding-left: 5%">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="35%"
               style="width: 75%; margin-left:160px;"
      >
        <el-form-item label="分库ID" prop="id">
          <span>{{ temp.id }}</span>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <span>{{ temp.name }}</span>
        </el-form-item>
        <el-form-item label="管理员" prop="master">
          <span>{{ temp.master }}</span>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <span>{{ temp.address }}</span>
        </el-form-item>
        <el-form-item label="仓库经度" prop="x">
          <span>{{ temp.x }}</span>
        </el-form-item>
        <el-form-item label="仓库纬度" prop="y">
          <span>{{ temp.y }}</span>
        </el-form-item>

        <el-form-item label="所在城市" prop="city">
          <span>{{ temp.city }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>

</template>

<script>
import { getOneProduct } from '@/api/distribution'
import { subwareByID } from '@/api/ware'

export default {
  name: 'ware',
  props: ['id'],
  data() {
    return {
      dialogFormVisible: false,
      temp: {
        id: undefined,
        name: '',
        city:'',
        address:'',
        x:"",
        y:"",
        master:'',
      }
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
