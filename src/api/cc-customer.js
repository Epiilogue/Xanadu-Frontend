import request from '@/utils/request'




// 获取客户列表:分页
export function getCustomerList(query) {
    return request({
      url: `/cc/customer/query/${query.pageNum}/${query.pageSize}`,
      method: 'get',
      params: {
        name: query.name,
        telephone:query.telephone,
        identityCard:query.identityCard
    }
    })
  }

// 获取客户信息
export function getCustomer(customerId) {
  return request({
    url: `/cc/customer/query/${customerId}`,
    method: 'get',
  })
}

// 新增客户
export function createCustomer(customer) {
  return request({
    url: `/cc/customer/create`,
    method: 'post',
    data:customer,
  })
}

// 编辑客户
export function updateCustomer(customer) {
  return request({
    url: `/cc/customer/update`,
    method: 'post',
    data:customer,
  })
}

// 删除客户
export function deleteCustomer(customerId) {
  return request({
    url: `/cc/customer//delete/${customerId}`,
    method: 'get',
  })
}
