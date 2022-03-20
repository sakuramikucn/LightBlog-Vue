import request from './index'

export default {
    search(params) {
        return request({
            url: '/tag/search',
            method: 'post',
            data: params
        })
    },
    get(id) {
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
            url: '/tag/check?name=' + name,
            method: 'get'
        })
    },
    add: name => {
        return request({
            url: '/tag/'+name,
            method: 'post'
        })
    },
    delete: id => {
        return request({
            url: '/tag/'+id,
            method: 'delete'
        })
    }
}