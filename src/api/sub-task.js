import request from '@/utils/request'

// 查询调度中心的分站任务
export function getTaskList(subId) {
    return request({
      url: `/sub/task/list/${subId}`,
      method: 'get',
    })
  }

// 查询分站所有任务
export function listHanding(subId) {
  return request({
    url: `/sub/task/listHanding/${subId}`,
    method: 'get',
  })
}
  
// 获取分站快递员
export function listCouriers(subId) {
  return request({
    url: `/sub/task/listCouriers/${subId}`,
    method: 'get',
  })
}

// 分配任务
export function assign(subId,courierId,data) {
  return request({
    url: `/sub/task/assign/${subId}/${courierId}`,
    method: 'post',
    data:data
  })
}

// 取货
export function takeProducts(taskId) {
  return request({
    url: `/sub/task/takeProducts/${taskId}`,
    method: 'get',
  })
}