<template>
  <el-tag :color="getTagColor(type)" effect="dark" type="info">{{ type }}</el-tag>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true
    }
  },
  methods: {
    getTagColor(type) {
      switch (type) {
        case '收款':
          return '#409eff'; // 蓝色
        case '送货':
          return '#f90'; // 橙红色
        case '送货收款':
          return '#17c54a'; // 灰色
        case '退货':
          return '#ea83c8'; // 黄色
        case '换货':
          return '#999999'; // 深灰色
        default:
          return '#909399'; // 默认灰色
      }
    }
  }
};
</script>
