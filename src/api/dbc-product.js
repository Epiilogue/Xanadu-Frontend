import request from '@/utils/request'

// 获取商品信息
export function getProduct(id) {
    return request({
      url: `/dbc/product/get/${id}`,
      method: 'get',
    })
  }

export function getAllProduct(keyword) {
  return request({
    url: `/dbc/product/crawler/${keyword}`,
    method: 'get',
  })
}
