import request from '@/utils/request'

// 获取客户列表
export function getCustomerList(query) {
    return request({
      url: `/cc/customer/list/${query.pageNum}/${query.pageSize}`,
      method: 'get',
      // params: query.customerId
    })
  }

// 获取客户信息
export function getCustomer(customerId) {
  return request({
    url: `/cc/customer/query/${customerId}`,
    method: 'get',
    // params: query.customerId
  })
}