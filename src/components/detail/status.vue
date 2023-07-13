<template>
  <el-tag :color="getTagColor(status)"  effect="dark" type="info">{{ status }}</el-tag>
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
    getTagColor(status) {
      switch (status) {
        case '无效':
          return '#f56c6c'; // 红色
        case '可分配':
          return '#67c23a'; // 绿色
        case '缺货':
          return '#f56c6c'; // 橙色
        case '已完成':
          return '#909399'; // 灰色
        case '已调度':
          return '#e6a23c'; // 绿色
        case '中心库房出库':
          return '#909399'; // 灰色
        case '配送站到货':
          return '#e6a23c'; // 橙色
        case '已分配':
          return '#67c23a'; // 绿色
        case '已领货':
          return '#67c23a'; // 绿色
        case '已完成':
          return '#909399'; // 灰色
        case '失败':
          return '#f56c6c'; // 红色
        case '部分完成':
          return '#e6a23c'; // 橙色
        default:
          return '#909399'; // 默认灰色
      }
    }
  }
};
</script>
