import request from '@/utils/request'
import axios from 'axios'
import * as http from 'http'

/* const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: 'http://localhost:8004',
  // 超时
  timeout: 10000
}) */
//获取所有缺货记录
export function fetchLackRecordList(query) {
  return request({
    url: '/getAllLackRecord',
    method: 'get',
    //params: { pageNum, pageSize },
    //params: query,
    baseURL: 'http://localhost:8004/dbc/lackRecord'
  })
}
//生成采购单
export function generatePurchaseRecord(data){
  return request({
    url: '/generatePurchaseOrder',
    method: 'post',
    baseURL: 'http://localhost:8004/dbc/purchaseRecord',
    data
  })
}
//查询所有退货
export function getRefundList(){
  return request({
    url: '/list',
    method:'get',
    baseURL:'http://localhost:8004/dbc/refund'
  })
}

//
/* export function getRefundList(){
  return request({
    url: '/searchForReturn',
    method:'get',
    baseURL:'http://localhost:8004/dbc/refund'
  })
} */

export function LackRecordInspect(id,isCheck){
  return request({
    url: `getLackRecord/${id}/${true}`,
    method: 'get',
    baseURL: 'http://localhost:8004/dbc/lackRecord'
  })
}

//获取商品列表
export function fetchList(query) {
  return request({
    url: '/listAll',
    method: 'get',
    //params: { pageNum, pageSize },
    //params: query,
    baseURL: 'http://localhost:8004/dbc/product'
  })
}
  export function fetchPage(id) {
    return request({
      url: '/vue-element-admin/article/detail',
      method: 'get',
      params: { id }
    })
  }

  export function fetchArticle(id) {
    return request({
      url: '/vue-element-admin/article/detail',
      method: 'get',
      params: { id }
    })
  }
//删除商品
  export function deleteProduct(id) {
    return request({
      url: `delete/${id}`,
      method: 'get',
      baseURL: 'http://localhost:8004/dbc/product',
    })
  }


//创建商品
  export function createArticle(data) {
    return request({
      url: '/add',
      method: 'post',
      baseURL: 'http://localhost:8004/dbc/product',
      data
    })
  }
//更新商品
  export function updateProduct(data) {
    return request({
      url: '/update',
      method: 'post',
      baseURL: 'http://localhost:8004/dbc/product',
      data
    })
  }
  export function getOneProduct(id){
    return request({
      url: `get/${id}`,
      method: 'get',
      baseURL: 'http://localhost:8004/dbc/product',
    })
  }
