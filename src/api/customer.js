import request from '@/utils/request'

//获取所有缺货信息
export function fetchStockOut(query) {
  return request({
    url: '/cc/stockout/listAll',
    method: 'get',
    //params: { pageNum, pageSize },
    //params: query,
    //baseURL: 'http://localhost:8089/cc/stockout'
  })
}
export function getOneStockOut(id) {
  return request({
    url: `/cc/stockout/get/${id}`,
    method: 'get',
    //params: { pageNum, pageSize },
    //params: query,
    //baseURL: 'http://localhost:8089/cc/stockout'
  })
}
//增加缺货量
export function updateStockOut(data) {
  return request({
    url: '/cc/stockout/edit',
    method: 'put',
    data
  })
}
//提交缺货
export function commitStockOut(id) {
  return request({
    url: `/cc/stockout/commit/${id}`,
    method: 'put',
  })
}

//到货
export function arrivalStockOut(id) {
  return request({
    url: `/cc/stockout/arrival/${id}`,
    method: 'put',
  })
}
