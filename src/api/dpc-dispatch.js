import request from '@/utils/request'

// 订单调度
export function dispatchOrder(query) {
    return request({
        url: `/dpc/dispatch/dispatchOrder/${query.id}/${query.substationId}`,
        method: 'put',
        params: {
            outDate: query.outDate,
        }
    })
}

// 检查订单状态
export function checkAllArrival(id) {
    return request({
        url: `/dpc/dispatch/check/${id}`,
        method: 'get',
    })
}

// 商品调度
export function dispatchProduct(query) {
    return request({
        url: `/dpc/dispatch/dispatchProduct`,
        method: 'put',
        params: {
            subwareId:query.subwareId,
            requireDate: query.requireDate,
        },
        data:query.product,
    })
}

// 根据id获取调度单
export function getDispatch(id) {
    return request({
        url: `/dpc/dispatch/get/${id}`,
        method: 'get',
    })
}

// 删除调度单
export function deleteDispatch(id) {
    return request({
        url: `/dpc/dispatch/deleteDispatch/${id}`,
        method: 'delete',
    })
}

// 编辑调度单
export function editDispatch(data) {
    return request({
        url: `/dpc/dispatch/editDispatch`,
        method: 'post',
        data
    })
}

// 调度单列表
export function getDispatchList() {
    return request({
        url: `/dpc/dispatch/list`,
        method: 'get',
    })
}

// 任务单列表
export function getTaskList() {
    return request({
        url: `/dpc/task/list`,
        method: 'get',
    })
}


// 任务单列表
export function getTaskById(id) {
  return request({
    url: `/dpc/task/getTask/${id}`,
    method: 'get',
  })
}





