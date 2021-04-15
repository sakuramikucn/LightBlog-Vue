import request from './index'

export function queryComments(params){
    return request({
        url: '/comment/search',
        method: 'POST',
        data: params
    })
}

export function addComment(params){
    return request({
        url: 'comment',
        method: 'POST',
        data: params
    })
}