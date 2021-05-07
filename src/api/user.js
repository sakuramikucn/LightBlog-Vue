import request from './index'

export function getUserByToken(){
    return request({
        url: '/user'
    })
}

export function getUser(id){
    return request({
        url: '/user/'+id
    })
}

export function editUser(param){
    return request({
        url: '/user',
        method: 'PUT',
        data: param
    })
}

export function searchUser(params){
    return request({
        url: '/user/search',
        method: 'POST',
        data: params
    })
}

export function addUser(params){
    return request({
        url: '/user',
        method: 'post',
        data: params
    })
}

export function removeUser(id){
    return request({
        url: '/user/'+id,
        method: 'PUT'
    })
}

export function deleteUser(id){
    return request({
        url: '/user/'+id,
        method: 'DELETE'
    })
}

export function freezUser(id){
    return request({
        url: '/user/freez/'+id,
        method: 'PUT'
    })
}

export function unfreezUser(id){
    return request({
        url: '/user/unfreez/'+id,
        method: 'PUT'
    })
}

export function checkUser(name){
    return request({
        url: '/check/'+name,
        method: 'get'
    })
}

export function restoreUser(id){
    return request({
        url: '/user/restore/'+id,
        method: 'put'
    })
}
