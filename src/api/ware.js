import request from '@/utils/request'

// 获取中心仓库所有商品库存
export function centerStorageList(query) {
    return request({
        url: `/ware/centerStorageRecord/list/${query.pageNum}/${query.pageSize}`,
        method: 'get',
    })
}

// 获取中心仓库单个商品库存
export function getCenterStorage(productId) {
    return request({
        url: `/ware/centerStorageRecord/getCount/${productId}`,
        method: 'get',
    })
}

// 获取分库分页列表
export function subList(query) {
    return request({
        url: `/ware/subware/list/${query.pageNum}/${query.pageSize}`,
        method: 'get',
        params:query,
    })
}
