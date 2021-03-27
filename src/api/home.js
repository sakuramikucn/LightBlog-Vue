import request from './index'

export function login(param) {
    return request({
        url: '/login',
        method: 'POST',
        data: param
    })
}