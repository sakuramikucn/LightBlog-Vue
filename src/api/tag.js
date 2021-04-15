import request from './index'

export default {
    search(params) {
        return request({
            url: '/tag/search',
            method: 'GET',
            params: params
        })
    },
    getTag(id) {
        return request({
            url: '/tag/' + id,
            method: 'GET'
        })
    },
    update(params) {
        return request({
            url: '/tag',
            method: 'put',
            data: params
        })
    },
    check: name => {
        return request({
            url: '/tag/check/' + name,
            method: 'get'
        })
    },
    add: name => {
        return request({
            url: '/tag/'+name,
            method: 'post'
        })
    }
}