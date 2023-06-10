import request from '@/utils/request'

// 获取订单列表
export function fetchList(query) {
  return request({
    url: `/cc/order/list`+(query.customerId?`/${query.customerId}`:''),
    method: 'get',
    // params: query.customerId
  })
}

// 获取订单信息
export function getOrder(query) {
  return request({
    url: `/cc/order/detail`+`/${query.orderId}`+`/${query.orderType}`,
    method: 'get',
    // params: query.customerId
  })
}

// 获取商品列表
export function getProductList(query) {
  return request({
    url: `/dbc/product/list/${query.pageNum}/${query.pageSize}`,
    method: 'get',
    // params: query.customerId
  })
}

// 新订
export function createNewOrder(data) {
  return request({
    url: '/cc/newOrder/create',
    method: 'post',
    data
  })
}

// 撤销
export function withdrawOrder(orderId) {
  return request({
    url: `/cc/newOrder/cancel/${orderId}`,
    method: 'get',
  })
}

// 退订
export function unSubscribe(data) {
  return request({
    url: '/cc/newOrder/unsubscribe',
    method: 'post',
    data
  })
}

// 退货
export function Return(data) {
  return request({
    url: `/cc/refund/refund`,
    method: 'post',
    data
  })
}

// 换货
export function change(data) {
  return request({
    url: `/cc/refund/exchange`,
    method: 'post',
    data
  })
}
