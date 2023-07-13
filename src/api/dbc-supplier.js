import request from '@/utils/request'

// 获取供应商列表
export function getSupList(query) {
    return request({
      url: `/dbc/supplier/list/${query.pageNum}/${query.pageSize}`,
      method: 'get',
    })
  }

export function getAllSupList() {
  return request({
    url: `/dbc/supplier/listAll`,
    method: 'get',
  })
}

export function getSupplier(query) {
  return request({
    url: `/dbc/supplier/get/${query}`,
    method: 'get',
  })
}

// 根据姓名、地址查找供应商
export function querySupList(query) {
  return request({
    url: `/dbc/supplier/query/${query.pageNum}/${query.pageSize}`,
    method: 'get',
    params:query,
  })
}

// 新增供应商
export function createSup(data) {
    return request({
      url: `/dbc/supplier/add`,
      method: 'post',
      data
    })
  }

// 更新供应商
export function updateSup(data) {
  return request({
    url: `/dbc/supplier/update/`,
    method: 'post',
    data
  })
}

// 删除供应商
export function deleteSup(id) {
  return request({
    url: `/dbc/supplier/delete/${id}`,
    method: 'delete',
  })
}

//查询退货安排
export function refurnList(supplierId,productId,startTime,endTime){
  return request({
    url: '/dbc/refund/searchForReturn',
    method: 'get',
    params: {
      supplierId:supplierId,
      productId:productId,
      startTime: startTime,
      endTime: endTime,
    }
  })
}

//生成退货单
export function returnOrder(number,data){
  return request({
    url:'/dbc/refund/generateReturnOrder/'+number,
    method:'post',
    data
  })
}

//获取所有记录
export function historyList(){
  return request({
    url:'/dbc/refund/list',
    method:'get'
  })
}
