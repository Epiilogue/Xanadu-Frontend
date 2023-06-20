<template>
  <div>
    <div class="link-type" @click="getProduct(id)">
      {{ id }}
    </div>
    <el-dialog title="商品详情查看" :visible.sync="dialogFormVisible" style="width: 100%;padding-left: 5%">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="35%"
               style="width: 75%; margin-left:160px;"
      >
        <el-image
          style="width: 100px; height: 100px;margin-right: 150px"
          :src="temp.picture"
        ></el-image>
        <el-form-item label="货物名称" prop="name">
          <span>{{ temp.name }}</span>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <span>{{ temp.price }}</span>
        </el-form-item>
        <el-form-item label="成本" prop="cost">
          <span>{{ temp.cost }}</span>

        </el-form-item>
        <el-form-item label="供应商ID" prop="upplierId">
          <span>{{ temp.supplierId }}</span>
        </el-form-item>

        <el-form-item label="是否可退货" prop="refundAble">
          <span>{{ temp.refundAble }}</span>
        </el-form-item>
        <el-form-item label="是否可换货" prop="changeAble">
          <span>{{ temp.changeAble }}</span>
        </el-form-item>

        <el-form-item label="安全库存量" prop="safeStock">
          <span>{{ temp.safeStock }}</span>
        </el-form-item>

        <el-form-item label="最大库存量" prop="maxCount">
          <span>{{ temp.maxCount }}</span>
        </el-form-item>

        <el-form-item label="备注" prop="comment">
          <span>{{ temp.comment }}</span>
        </el-form-item>
        <el-form-item label="商品大类" prop="category">
          <span>{{ temp.firstCategray }}</span>
        </el-form-item>
        <el-form-item label="商品小类" prop="category">
          <span>{{ temp.secondCategray }}</span>
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
      dialogFormVisible: false,
      temp: {
        id: undefined,
        name: '',
        price: '',
        cost: '',
        supplierId: '',
        firstCategray: '',
        secondCategray: '',
        refundAble: false,
        changeAble: false,
        comment: '',
        safeStock: '',
        maxCount: '',
        createTime: new Date(),
        updateTime: new Date(),
        picture: '',
        deleted: false
        //status: 'published'
      }
    }
  },
  methods: {
    getProduct(id) {
      this.dialogFormVisible = true
      getOneProduct(id).then(res => {
        this.temp = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
