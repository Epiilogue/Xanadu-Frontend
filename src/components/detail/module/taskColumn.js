//表格列
let tableColumns = [
    {
        prop: "id",
        label: "任务单编号",
        show: false
    },
    {
        prop: "customerId",
        label: "客户编号",
        show: false
    },
    {
        prop: "receiverName",
        label: "收件人姓名",
        show: true
    },
    {
        prop: "phone",
        label: "收件人电话",
        show: true
    },
    {
        prop: "deliveryAddress",
        label: "送货地址",
        show: true
    },
    {
        prop: "orderId",
        label: "订单编号",
        show: false
    },
    {
        prop: "subId",
        label: "分站编号",
        show: true
    },
    {
        prop: "numbers",
        label: "商品总数",
        show: true
    },
    {
        prop: "totalAmount",
        label: "商品总价",
        show: true
    },
    {
        prop: "deadline",
        label: "要求完成日期",
        show: false //表格列是否展示
    },
    {
        prop: "taskType",
        label: "任务类型",
        show: true
    },
    {
        prop: "taskStatus",
        label: "任务状态",
        show: true
    },
    {
        prop: "courierId",
        label: "快递员编号",
        show: true
    },
    {
        prop: "createTime",
        label: "任务生成日期",
        show: false
    },
    {
        prop: "receiptId",
        label: "回执编号",
        show: true
    },
    // {
    //     prop: "products",
    //     label: "所有任务的商品列表",
    //     show: true
    // },
    // {
    //     prop: "productsJson",
    //     label: "正在处理的任务的商品列表",
    //     show: true
    // },
]
// 要隐藏的列
const self=['deadline','createTime','id','customerId','orderId']
const all = ['courierId', 'receiptId']+self
const assign = ['courierId', 'receiptId', 'taskStatus']+self
const assigned = ['receiptId']+self
// 设置表格列的显示与隐藏
/**
 * 可分配的任务，商品列表存在products里
 *
 * 分配任务后，显示快递员编号和任务生成日期，商品列表存在json里
 *
 * 录入回执后，显示回执编号
 */
function getColumn(opType) {
    let hide = []
    switch (opType) {
        case '分配任务':
            hide = assign
            break
        case '取货':
        case '发票领用':
        case '打印签收单':
        case '回执录入':
            hide = assigned
            break
        default:
            hide = all
            break
    }
    tableColumns.forEach(column => {
        // 如果选中，则设置列显示
        if (hide.includes(column.prop)) {
            column.show = false;
        } else {
            // 如果未选中，则设置列隐藏
            column.show = true;
        }
    })
    return tableColumns
}

// 任务类型和任务状态下拉框
let taskStatusOption = ['已调度', '可分配', '已分配', '已领货', '已完成', '失败', '部分完成']
let taskTypeOption = ['收款', '送货', '送货收款', '退货', '换货']
function getOption(opType) {
    let status = []
    let type = []
    switch (opType) {
        case '分配任务':
            status = ['可分配']
            type = taskTypeOption
            break
        case '取货':
            status = ['已分配']
            type = ['送货', '送货收款', '换货']
            break
        case '发票领用':
            status = ['已分配', '已领货']
            type = ['收款', '送货收款']
            break
        case '打印签收单':
        case '回执录入':
            status = ['已分配', '已领货']
            type = taskTypeOption
            break
        default:
            status = taskStatusOption
            type = taskTypeOption
            break
    }
    return { status, type }
}



export { getColumn, getOption,tableColumns }
