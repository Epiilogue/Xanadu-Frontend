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
    url: '/dbc/purchaseRecord/generatePurchaseOrder',
    method: 'post',
    data
  })
}
//查询所有退货
export function getRefundList(){
  return request({
    url: '/dbc/refund/list',
    method:'get',
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
    url: `/dbc/lackRecordgetLackRecord/${id}/${true}`,
    method: 'get',
  })
}

//获取商品列表
export function fetchList(query) {
  return request({
    url: '/dbc/product/listAll',
    method: 'get',
    //params: { pageNum, pageSize },
    //params: query,
    //baseURL: 'http://localhost:8089/dbc/product'
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
      url: `/dbc/productdelete/${id}`,
      method: 'get',
    })
  }


//创建商品
  export function createArticle(data) {
    return request({
      url: '/dbc/product/add',
      method: 'post',
      data
    })
  }
//更新商品
  export function updateProduct(data) {
    return request({
      url: '/dbc/product/update',
      method: 'post',
      data
    })
  }
  export function getOneProduct(id){
    return request({
      url: `/dbc/productget/${id}`,
      method: 'get',
    })
  }
