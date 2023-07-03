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
    url: '/ware/subware/get/'+id,
    method: 'get',
  })
}

export function subwareAll() {
  return request({
    url: '/ware/subwarelistAll',
    method: 'get',
  })
}

export function subwareEdit(data) {
  return request({
    url:'ware/subware/update',
    method:'post',
    data
  })
}

export function subwareDetele(id) {
  return request({
    url: 'ware/subware/delete/'+id,
    method :'get',
  })
}

// 中心仓库 库存量
export function cenlist(){
  return request({
    url: '/ware/centerStorageRecord/list',
    method :'get',
  })
}

export function cenGoodById(id){
  return request({
    url: '/ware/centerStorageRecord/getCount/'+id,
    method:'get',
  })
}

// 中心仓库 库存分页
export function centerStorageList(query) {
  return request({
      url: `/ware/centerStorageRecord/list/${query.pageNum}/${query.pageSize}`,
      method: 'get',
  })
}

//中心仓库 出库单
//调拨出库
export function cenDispatchOut(){
  return request({
    url: '/ware/centerOutput/getDispatchOutput',
    method:'get',
  })
}

export function cenConfirmOut(id,number){
  return request({
    url: '/ware/centerOutput/confirm/'+id+'/'+number,
    method:'put',
  })
}
//退货出库
export function cenRuturnOut(){
  return request({
    url: '/ware/centerOutput/getReturnOutput',
    method:'get',
    baseURL: 'http://localhost:8015'
  })
}
//中心仓库 入库单
//入库列表
export function cenInputList(type){
  return request({
    url: '/ware/centerInput/list/'+type,
    method:'get',
  })
}

//入库
export function cenInput(id,number){
  return request({
    url: '/ware/centerInput/confirm/'+id+'/'+number,
    method:'put',
  })
}

//分库库存量


//分库出库
//获取所有列表
export function subInputList(type){
  return request({
    url: '/ware/subOutput/list/'+type,
    method:'get',
  })
}

//确认出库
export function subConfirmOut(id, number){
  return request({
    url: '/ware/subOutput/confirm/'+id+'/'+number,
    method:'put',
  })
}

//删除退货记录
export function deleteReturnRecord(id){
  return request({
    url:'/ware/subOutput/delete/'+id,
    method:'delete',
  })
}

//分库入库
//分库调拨入库列表
export function subDispatchIn(subwareid){
  return request({
    url:'/ware/subInput/listDispatch/'+subwareid,
    method:'get',
  })
}
//分库退货入库列表
export function subRefundIn(subwareid){
  return request({
    url:'/ware/subInput/listRefund/'+subwareid,
    method:'get',
  })
}

//分库确认调拨入库
export function subConfirmDispatchIn(id){
  return request({
    url:'ware/subInput/confirmDispatch/'+id,
    method:'post',
  })
}

// 获取分库分页列表
export function subWareList(query) {
  return request({
      url: `/ware/subware/list/${query.pageNum}/${query.pageSize}`,
      method: 'get',
      params:query,
  })
}
export function subList(){
  return request({
    url: '/ware/subStorageRecordlist',
    method: 'get',
  })
}
