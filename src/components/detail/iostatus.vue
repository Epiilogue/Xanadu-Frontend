<template>
  <el-tag :color="getTagColor(status)" effect="dark" type="info">{{ status }}</el-tag>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      required: true
    }
  },
  methods: {
    getTagColor(type) {
      switch (type) {
        case '未提交':
          return '#E6A23C'; // 橙色
        case '已提交':
          return '#67C23A'; // 绿色
        case '未入库':
          return '#909399'; // 灰色
        case '已入库':
          return '#409EFF'; // 蓝色
        case '未出库':
          return '#909399'; // 灰色
        case '已出库':
          return '#67C23A'; // 绿色
        case '分库已入库':
          return '#67C23A'; // 绿色
        case '中心仓库已入库':
          return '#67C23A'; // 绿色
        default:
          return '#909399'; // 默认灰色
      }
    }
  }
};
</script>
