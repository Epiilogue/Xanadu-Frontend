<template>
  <div>
    <el-input placeholder="请选择" :size="size" :disabled="inpDisabled" style="line-hight:40px" v-model="id"
              class="input-with-select"
    >
      <el-button slot="append" :disabled="btnDisabled" @click="showUserSelect" icon="el-icon-search"></el-button>
    </el-input>
    <SubwarePop
      ref="SubwareSelect"
      @doSubmit="selectionsToInput"
      :selectData="selectData"
      :single="single"
    />
  </div>
</template>
<script>
import SubwarePop from './SubwarePop'
import { subwareByID } from '@/api/ware'

export default {
  data() {
    return {
      selectData: [],
      SupplierService: null,
      id: ''
    }
  },
  props: {
    size: {
      type: String,
      default: 'small'
    },
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
      default: true
    }
  },
  components: {
    SubwarePop
  },
  watch: {
    value: {
      handler(newVal) {
        this.selectData = []
        if (newVal) {
          newVal.split(',').forEach((id) => { // 回显拿数据
            subwareByID(id).then((res) => {
              this.selectData.push(res.data)
            })
          })
        }
      },
      immediate: true,
      deep: false
    },
    selectData: {
      handler(newVal) {
        this.id = newVal.map(Supplier => Supplier.id).join(',')
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
    showUserSelect() {
      this.$refs.SubwareSelect.init()
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
