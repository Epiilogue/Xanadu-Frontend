import request from '@/utils/request'

//查询商品收款情况
export function getPaymentByCategoryAndTime(query) {
    return request({
        url: `/getPaymentByCategoryAndTime/${query.subId}`,
        method: 'get',
        baseURL: 'http://localhost:8019/sub/finance',
        params:query
    })
}