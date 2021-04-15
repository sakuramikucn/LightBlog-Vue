import request from './index'

export function login(param) {
    return request({
        url: '/login',
        method: 'POST',
        data: param
    })
}

export function logout(){
    return request({
        url: '/logout'
    })
}

export function getViews(id) {
    return request({
        url: '/views/'+id,
        method: 'GET'
    })
}

export function incrementViews(id){
    return request({
        url: '/views/increment/'+id,
        method: 'POST'
    })
}