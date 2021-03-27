import request from './index'

export function getTag(id){
    return request({
        url: 'tag/'+id,
        method: 'GET'
    })
}