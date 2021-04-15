import request from './index'

export default {
    search: params => { 
        return request({
            url: '/role/search',
            method: 'post',
            data: params
        })
    },

    add: params => {
        return request({
            url: '/role',
            method: 'post',
            data: params
        })
    },

    update: params => {
        return request({
            url: '/role',
            method: 'put',
            data: params
        })
    },

    delete: id => {
        return request({
            url: '/role/'+id,
            method: 'delete'
        })
    },
    check: name => {
        return request({
            url: '/role/check?name='+name,
            method: 'get'
        })
    }
}