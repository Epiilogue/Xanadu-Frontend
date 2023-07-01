import request from '@/utils/request'

// 获取所有的待操作商品列表
export function fetchList() {
  return request({
    url: '/list',
    method: 'get',
    baseURL: 'http://localhost:8019/sub/pendingProduct',
  })
}
// 分库退货出库
export function refund(id,number) {
  return request({
    url: `/refund/${id}/${number}`,
    method: 'post',
    baseURL: 'http://localhost:8019/sub/pendingProduct',
  })
}

// 分库重新入库
export function restore(id,number) {
  return request({
    url: `/restore/${id}/${number}`,
    method: 'post',
    baseURL: 'http://localhost:8019/sub/pendingProduct',
  })
}

// 删除记录
export function deleteRecord(id){
  return request({
    url: `delete/${id}`,
    method: 'delete',
    baseURL: 'http://localhost:8019/sub/pendingProduct',
  })
}