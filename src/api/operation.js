import request from '@/utils/request'

// 查询分页操作记录
export function getOperation(query) {
    return request({
      url: `/cc/operation/list/${query.pageNum}/${query.pageSize}`,
      method: 'get',
      params:query,
    })
}

// 查询操作员工作量
export function getWork(query) {
    return request({
      url: `/cc/operation/listOperationResult/${query.userId}`,
      method: 'post',
      params:query,
    })
}