import request from '@/utils/request'

// 快递员
//查询可分配的快递员
export function getCourierUserList() {
    return request({
        url: '/getCourierUserList',
        method: 'get',
        baseURL: 'http://localhost:8019/sub/substation',
    })
}
// 查询分站快递员
export function getSubCourierList(substationId) {
    return request({
        url: `/getCourierList/${substationId}`,
        method: 'get',
        baseURL: 'http://localhost:8019/sub/substation',
    })
}
// 批量分配快递员
export function addCouriers(substationId, ids) {
    return request({
        url: `/addCourier/${substationId}`,
        method: 'post',
        data: ids,
        baseURL: 'http://localhost:8019/sub/substation',
    })
}

// 删除分站快递员
export function deleteCourier(substationId, courierId) {
    return request({
        url: `/deleteCourier/${substationId}/${courierId}`,
        method: 'post',
        baseURL: 'http://localhost:8019/sub/substation',
    })
}


// 分站长————超级管理员可分配
//查询可分配的分站长
export function getSubstationUserList() {
    return request({
        url: '/getSubstationUserList',
        method: 'get',
        baseURL: 'http://localhost:8019/sub/substation',
    })
}
// 查询对应分站的分站长
export function getSubstationManager(substationId) {
    return request({
        url: `/getSubstationManager/${substationId}`,
        method: 'get',
        baseURL: 'http://localhost:8019/sub/substation',
    })
}