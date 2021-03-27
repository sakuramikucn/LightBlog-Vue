import request from './index'

export function getCategory(id){
    return request({
        url: '/catogory/'+id,
        method: 'GET'
    })
}