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
        case '新订':
          return '#409eff'; // 蓝色
        case '退货':
          return '#f90'; // 橙红色
        case '退订':
          return '#909399'; // 灰色
        case '换货':
          return '#ff9900'; // 黄色
        case '撤销':
          return '#999999'; // 深灰色
        default:
          return '#909399'; // 默认灰色
      }
    }
  }
};
</script>
