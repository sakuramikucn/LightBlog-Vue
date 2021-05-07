import request from './index'

export default {
    query: params => {
        return request({
            url: '/comment/search',
            method: 'POST',
            data: params
        })
    },
    add: params => {
        return request({
            url: '/comment',
            method: 'POST',
            data: params
        })
    },
    remove: id => {
        return request({
            url: '/comment/'+id,
            method: 'PUT'
        })
    },
    delete: id => {
        return request({
            url: '/comment/'+id,
            method: 'delete'
        })
    },
    hide: (id,isHidden) => {
        return request({
            url: '/comment/status/'+id+'/'+isHidden,
            method: 'PUT'
        })
    },
    restore: (id) => {
        return request({
            url: '/comment/restore/'+id,
            method: 'PUT'
        })
    },
}
