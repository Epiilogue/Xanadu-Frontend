import request from '@/utils/request'
import axios from 'axios'
import * as http from 'http'

const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: 'http://localhost:8005',
  // 超时
  timeout: 10000
})

//分库
export function addSubware(data) {
  return request({
    url: '/add',
    method: 'post',
    baseURL: 'http://localhost:8005/ware/subware',
    data
  })
}

export function subwareByID(id) {
  return request({
    url: '/get/'+id,
    method: 'get',
    baseURL: 'http://localhost:8005/ware/subware'
  })
}

export function subwareAll(id) {
  return request({
    url: 'listAll',
    method: 'get',
    baseURL: 'http://localhost:8005/ware/subware'
  })
}

export function subwareEdit(data) {
  return request({
    url:'/update',
    method:'post',
    baseURL: 'http://localhost:8005/ware/subware',
    data
  })
}

export function subwareDetele(id) {
  return request({
    url:'/delete/'+id,
    method :'get',
    baseURL: 'http://localhost:8005/ware/subware'
  })
}
export function centerware(id) {
  return request({
    url: 'info',
    method: 'get',
    baseURL: 'http://localhost:8015/ware/centerware'
  })
}

export function centerwareupdate(data) {
  return request({
    url: '/edit',
    method: 'post',
    baseURL: 'http://localhost:8015/ware/centerware',
    data
  })
}
