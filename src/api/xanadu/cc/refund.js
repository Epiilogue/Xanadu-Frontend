import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listRefund(query) {
  return request({
    url: '/xanadu/cc/refund/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getRefund(id) {
  return request({
    url: '/xanadu/cc/refund/' + id,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addRefund(data) {
  return request({
    url: '/xanadu/cc/refund',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateRefund(data) {
  return request({
    url: '/xanadu/cc/refund',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delRefund(id) {
  return request({
    url: '/xanadu/cc/refund/' + id,
    method: 'delete'
  })
}
