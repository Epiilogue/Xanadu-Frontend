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
    url: '/listAll',
    method: 'get',
    baseURL: 'http://localhost:8019/sub/substation',
  })
}
//查询当前用户管理的分站
export function fetchSubStation(userId) {
  return request({
    url: `/infoByUser/${userId}`,
    method: 'get',
    baseURL: 'http://localhost:8019/sub/substation',
  })
}

//查询当前用户管理的分站
export function fetchSubStationById(subId) {
  return request({
    url: `/infoById/${subId}`,
    method: 'get',
    baseURL: 'http://localhost:8019/sub/substation',
  })
}
// 通过id查询分站信息

//添加分站
export function AddSubstation(data){
  return request({
    url: '/add',
    method: 'post',
    baseURL: 'http://localhost:8019/sub/substation',
    data
  })
}
//修改分站信息
export function updateSubstation(data){
  return request({
    url: '/update',
    method:'post',
    baseURL: 'http://localhost:8019/sub/substation',
    data
  })
}
// 删除分站
export function deleteSubstation(id){
  return request({
    url: `delete/${id}`,
    method: 'post',
    baseURL: 'http://localhost:8019/sub/substation',
  })
}
// 获取未分配管理权的分站长和超级管理员
export function getSubstationUserList() {
  return request({
    url: '/getSubstationUserList',
    method: 'get',
    baseURL: 'http://localhost:8019/sub/substation',
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
