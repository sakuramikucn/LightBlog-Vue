import request from './index'

export default {
    search: params => {
        return request({
            url: '/right/search',
            method: 'GET',
            params: params
        })
    },
    add: params => {
        return request({
            url: '/right',
            method: 'post',
            data: params
        })
    },
    update: params => {
        return request({
            url: '/right',
            method: 'put',
            data: params
        })
    },
    delete: id => {
        return request({
            url: '/right/'+id,
            method: 'delete'
        })
    },
    check: name => {
        return request({
            url: '/right/check?name='+name,
            method: 'get'
        })
    }
}