import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listStockout(query) {
  return request({
    url: '/xanadu/cc/stockout/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getStockout(id) {
  return request({
    url: '/xanadu/cc/stockout/' + id,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addStockout(data) {
  return request({
    url: '/xanadu/cc/stockout',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateStockout(data) {
  return request({
    url: '/xanadu/cc/stockout',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delStockout(id) {
  return request({
    url: '/xanadu/cc/stockout/' + id,
    method: 'delete'
  })
}
