import request from '@/utils/request'

// 获取供应商列表
export function getSupList(query) {
    return request({
      url: `/dbc/supplier/list/${query.pageNum}/${query.pageSize}`,
      method: 'get',
    })
  }

// 新增供应商
export function createSup(data) {
    return request({
      url: `/dbc/supplier/create`,
      method: 'post',
      data
    })
  }