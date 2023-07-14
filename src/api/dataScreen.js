import request from '@/utils/request'
import axios from 'axios'

//top5
/*TODO
*  */
export function listTop(number) {
  return request({
    url: '/listTopProduct/'+number,
    method: 'get',
    baseURL: 'http://localhost:8019',
    params: {
      startTime: '1997-10-10',
      endTime: '2030-10-10',
      number:number
    }
  })
}

//分站配送信息
export function SubDeliveryInfo(){
  return request({
    url:'/getSubstationDeliveryInfo',
    method:'get',
    baseURL:'http://localhost:8019'
  })
}

//满意度
export function SubSatisfaction(){
  return request({
    url:'/getCustomerSatisfactionAnalysis',
    method:'get',
    baseURL:'http://localhost:8019',
    params: {
      startTime: '2023-7-1',
      endTime: '2023-7-31',
    }
  })
}

//各分库出库量
export function PickOutList(){
  return request({
    url:'/ware/subOutput/analysis',
    method:'get'
  })
}

//各订单数量统计
export function MonthlyOrders(){
  return request({
    url:'/cc/order/getMonthlyOrdersByType',
    method: 'get',
  })
}

//仓库分布
export function listAllStations(){
  return request({
    url: '/ware/centerware/listAllStations',
    method: 'get',
  })
}
