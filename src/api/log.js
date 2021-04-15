import request from './index'

export default {
    search: params => {
        return request({
            url: '/log/search',
            method: 'post',
            data: params
        })
    }
}