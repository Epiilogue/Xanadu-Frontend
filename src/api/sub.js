import request from '@/utils/request'
import axios from 'axios'
import * as http from 'http'

/* const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: 'http://localhost:8004',
  // 超时
  timeout: 10000
}) */
//查询所有分站
export function fetchAllSubStation() {
  return request({
    url: '/list',
    method: 'get',
    baseURL: 'http://localhost:8019/sub/substation',
  })
}
//生成采购单
export function AddSubstation(data){
  return request({
    url: '/add',
    method: 'post',
    baseURL: 'http://localhost:8019/sub/substation',
    data
  })
}
//查询所有退货
export function updateSubstation(data){
  return request({
    url: '/update',
    method:'post',
    baseURL: 'http://localhost:8019/sub/substation',
    data
  })
}

export function deleteSubstation(id){
  return request({
    url: `delete/${id}`,
    method: 'delete',
    baseURL: 'http://localhost:8019/sub/substation',
  })
}

export function fetchPage2(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}
//生成每日报表
export function generateSubstationStatistics(){
  return request({
    url: '/sub/substation/generateSubstationStatistics',
    method:'get',
  })
}

export function dailyReportsByDate(date){
  return request({
    url: '/sub/substation/dailyReportsByDate/',
    method:'get',
    params:{'date' :date}
  })
}

export function updateDailyReportStatus(id){
  return request({
    url: `/sub/substation/updateDailyReportStatus/${id}`,
    method:'get',
  })
}
