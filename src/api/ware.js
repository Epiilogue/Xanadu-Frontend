import request from '@/utils/request'
import axios from 'axios'
import * as http from 'http'

const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: 'http://localhost:8015',
  // 超时
  timeout: 10000
})

//分库
export function addSubware(data) {
  return request({
    url: '/add',
    method: 'post',
    baseURL: 'http://localhost:8015/ware/subware',
    data
  })
}

export function subwareByID(id) {
  return request({
    url: '/get/'+id,
    method: 'get',
    baseURL: 'http://localhost:8015/ware/subware'
  })
}

export function subwareAll() {
  return request({
    url: 'listAll',
    method: 'get',
    baseURL: 'http://localhost:8015/ware/subware'
  })
}

export function subwareEdit(data) {
  return request({
    url:'/update',
    method:'post',
    baseURL: 'http://localhost:8015/ware/subware',
    data
  })
}

export function subwareDetele(id) {
  return request({
    url: '/delete/'+id,
    method :'get',
    baseURL: 'http://localhost:8015/ware/subware'
  })
}

// 中心仓库 库存量
export function cenlist(){
  return request({
    url: '/list',
    method :'get',
    baseURL: 'http://localhost:8015/ware/centerStorageRecord'
  })
}

export function cenGoodById(id){
  return request({
    url: '/getCount/'+id,
    method:'get',
    baseURL: 'http://localhost:8015/ware/centerStorageRecord'
  })
}


//中心仓库 出库单
  //调拨出库
export function cenDispatchOut(){
  return request({
    url: '/getDispatchOutput',
    method:'get',
    baseURL: 'http://localhost:8015/ware/centerOutput'
  })
}

export function cenConfirmOut(id,number){
  return request({
    url: '/confirm/'+id+'/'+number,
    method:'put',
    baseURL: 'http://localhost:8015/ware/centerOutput'
  })
}
  //退货出库
export function cenRuturnOut(){
  return request({
    url: '/getReturnOutput',
    method:'get',
    baseURL: 'http://localhost:8015/ware/centerOutput'
  })
}
//中心仓库 入库单
  //入库列表
export function cenInputList(type){
  return request({
    url: '/list/'+type,
    method:'get',
    baseURL:'http://localhost:8015/ware/centerInput'
  })
}

  //入库
export function cenInput(id,number){
  return request({
    url: '/confirm/'+id+'/'+number,
    method:'put',
    baseURL: 'http://localhost:8015/ware/centerInput'
  })
}


