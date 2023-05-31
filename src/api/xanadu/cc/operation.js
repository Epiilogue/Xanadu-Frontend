import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listOperation(query) {
  return request({
    url: '/xanadu/cc/operation/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getOperation(id) {
  return request({
    url: '/xanadu/cc/operation/' + id,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addOperation(data) {
  return request({
    url: '/xanadu/cc/operation',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateOperation(data) {
  return request({
    url: '/xanadu/cc/operation',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delOperation(id) {
  return request({
    url: '/xanadu/cc/operation/' + id,
    method: 'delete'
  })
}
