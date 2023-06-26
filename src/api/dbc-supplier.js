import request from '@/utils/request'

// 获取供应商列表
export function getSupList(query) {
    return request({
      url: `/dbc/supplier/list/${query.pageNum}/${query.pageSize}`,
      method: 'get',
    })
  }

// 根据姓名、地址查找供应商
export function querySupList(query) {
  return request({
    url: `/dbc/supplier/query/${query.pageNum}/${query.pageSize}`,
    method: 'get',
    params:query,
  })
}

// 新增供应商
export function createSup(data) {
    return request({
      url: `/dbc/supplier/add`,
      method: 'post',
      data
    })
  }

// 更新供应商
export function updateSup(data) {
  return request({
    url: `/dbc/supplier/update/`,
    method: 'post',
    data
  })
}

// 删除供应商
export function deleteSup(id) {
  return request({
    url: `/dbc/supplier/delete/${id}`,
    method: 'delete',
  })
}