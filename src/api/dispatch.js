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

