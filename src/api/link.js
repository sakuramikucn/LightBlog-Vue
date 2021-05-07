import request from './index'

export default{
    search: params => {
        return request({
            url: '/link/search',
            method: 'post',
            data: params
        })
    },
    add: params => {
        return request({
            url: '/link',
            method: 'post',
            data: params
        })
    },
    update: params => {
        return request({
            url: '/link',
            method: 'put',
            data: params
        })
    },
    delete: id => {
        return request({
            url: '/link/'+id,
            method: 'delete'
        })
    }
}