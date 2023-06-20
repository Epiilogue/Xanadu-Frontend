import request from '@/utils/request'

//获取所有缺货信息
export function fetchStockOut(query) {
  return request({
    url: '/listAll',
    method: 'get',
    //params: { pageNum, pageSize },
    //params: query,
    baseURL: 'http://localhost:8003/cc/stockout'
  })
}
export function getOneStockOut(id) {
  return request({
    url: `/get/${id}`,
    method: 'get',
    //params: { pageNum, pageSize },
    //params: query,
    baseURL: 'http://localhost:8003/cc/stockout'
  })
}
//增加缺货量
export function updateStockOut(data) {
  return request({
    url: '/edit',
    method: 'put',
    baseURL: 'http://localhost:8003/cc/stockout',
    data
  })
}
//提交缺货
export function commitStockOut(id) {
  return request({
    url: `/commit/${id}`,
    method: 'put',
    baseURL: 'http://localhost:8003/cc/stockout',
  })
}

//到货
export function arrivalStockOut(id) {
  return request({
    url: `/arrival/${id}`,
    method: 'put',
    baseURL: 'http://localhost:8003/cc/stockout',
  })
}
