<template>
  <div>
    <el-input :size="size" :disabled="inpDisabled" style="line-hight:40px" v-model="id"
              class="input-with-select"
    >
      <el-button slot="append" :disabled="btnDisabled" @click="showUserSelect" icon="el-icon-search"></el-button>
    </el-input>
    <!-- 供应商列表 -->
    <ProductPop
      ref="ProductSelect"
      @doSubmit="selectionsToInput"
      :keyword="keyword"
      :selectData="selectData"
      :single="single"
    />
  </div>
</template>
<script>
import { getSupplier } from '@/api/dbc-supplier'
import ProductPop from '@/components/Pop/Product/ProductPop.vue'

export default {
  name:"ProductSelect",
  data() {
    return {
      tempInfo:'',
      selectData: [],
      SupplierService: null,
      id: '',
    }
  },
  props: {
    size: {
      type: String,
      default: 'small'
    },
    keyword:'',
    value: {
      default: ''
    },
    btnDisabled: {
      type: Boolean,
      default: false
    },
    inpDisabled: {
      type: Boolean,
      default: true
    },
    single: {  // 是否启用单选
      type: Boolean,
      default: false
    }
  },
  components: {
    ProductPop,
  },
  watch: {
    value: {
      handler(newVal) {
        this.selectData = []
        if (newVal) {
          console.log(this.keyword)
          console.log(newVal)
          this.selectData.push(newVal)
        }
      },
      immediate: true,
      deep: false
    },
    selectData: {
      handler(newVal) {
        console.log(newVal)
        this.tempInfo = newVal
      },
      immediate: true,
      deep: false
    }
  },

  methods: {
    // 设置选中
    selectionsToInput(selections) {
      this.selectData = selections
      this.$emit('getInfo', this.selectData)
    },
    // 显示列表
    showUserSelect(value) {
      this.$refs.ProductSelect.init()
    }
  }
}
</script>
<style>
.el-form-item__content .el-input-group {
  vertical-align: middle;
}

.el-tag + .el-tag {
  margin-left: 5px;
  margin-bottom: 5px;
}
</style>
