//订单表格列
let tableColumns = [
  {
    prop: 'id',
    label: '订单编号',
    show: false
  },
  {
    prop: 'customerId',
    label: '客户编号',
    show: false
  },
  {
    prop: 'numbers',
    label: '商品数量',
    show: true
  },
  {
    prop: 'totalAmount',
    label: '商品总价',
    show: true
  },
  {
    prop: 'deadline',
    label: '要求完成日期',
    show: false //表格列是否展示
  },
  {
    prop: 'createTime',
    label: '订单创建时间',
    show: false
  },
  {
    prop: 'status',
    label: '订单状态',
    show: false
  }
]
// 新订额外列
const newOrder = ['newType', 'telephone', 'receiverName', 'deliveryAddress', 'deliveryTime', 'invoiceNeed', 'substationId', 'comment']
let newColumns = [
  {
    prop: 'newType',
    label: '新订类型',
    show: true
  },
  {
    prop: 'telephone',
    label: '联系电话',
    show: true
  },
  {
    prop: 'receiverName',
    label: '收货人姓名',
    show: true
  },
  {
    prop: 'deliveryAddress',
    label: '收货地址',
    show: true
  },
  {
    prop: 'deliveryTime',
    label: '预计送货日期',
    show: false
  },
  {
    prop: 'invoiceNeed',
    label: '是否需要发票',
    show: false
  },
  {
    prop: 'substationId',
    label: '分站编号',
    show: true
  },
  {
    prop: 'comment',
    label: '备注',
    show: true
  }
]
// 退换货、退订额外列
const refund = ['orderId', 'substationId', 'reason']
let refundColumns = [
  {
    prop: 'orderId',
    label: '原订单编号',
    show: true
  },
  {
    prop: 'substationId',
    label: '分站编号',
    show: true
  },
  {
    prop: 'reason',
    label: '原因',
    show: true
  }
]
// 订单商品列
let productColumns = [
  {
    prop: 'productId',
    label: '商品编号',
    show: true
  },
  {
    prop: 'productName',
    label: '商品名称',
    show: true
  },
  {
    prop: 'productCategary',
    label: '商品种类',
    show: false
  },
  {
    prop: 'price',
    label: '单价',
    show: true
  },
  {
    prop: 'number',
    label: '商品数量',
    show: true
  },
  {
    prop: 'islack',
    label: '是否缺货',
    show: false
  },
  {
    prop: 'refundAble',
    label: '能否退货',
    show: false
  },
  {
    prop: 'changeAble',
    label: '能否换货',
    show: false
  }
]

function getColumn(opType) {
  switch (opType) {
    case '新订':
      return { order: tableColumns, detail: newColumns, product: productColumns }
    case '退订':
    case '退货':
    case '换货':
      return { order: tableColumns, detail: refundColumns, product: productColumns }
    default:
      return { order: tableColumns, product: productColumns }
  }
}

export { getColumn, tableColumns }
