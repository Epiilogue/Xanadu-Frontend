import request from '@/utils/request'
import axios from 'axios'
import * as http from 'http'

/* const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: 'http://localhost:8004',
  // 超时
  timeout: 10000
}) */
export function fetchList(query) {
  return request({
    url: '/listAll',
    method: 'get',
    //params: { pageNum, pageSize },
    //params: query,
    baseURL: 'http://localhost:8004/dbc/product'
  })
}

/* export function policy() {
  return request({
    url:'oss/policy',
    method:'get',
    baseURL: 'http://localhost:8004/dbc/'

  })
} */
  /* export function fetchList(query) {
    return request({
      url: `/list/${query.pageNum}/${query.pageSize}`,
      method: 'get',
      //params: { pageNum, pageSize },
      //params: query,
      baseURL: 'http://localhost:8004/dbc/product'
    })
  } */
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

  export function deleteProduct(id) {
    return request({
      url: `delete/${id}`,
      method: 'get',
      baseURL: 'http://localhost:8004/dbc/product',
    })
  }

  export function createArticle(data) {
    return request({
      url: '/add',
      method: 'post',
      baseURL: 'http://localhost:8004/dbc/product',
      data
    })
  }

  export function updateArticle(data) {
    return request({
      url: '/update',
      method: 'post',
      baseURL: 'http://localhost:8004/dbc/product',
      data
    })
  }
