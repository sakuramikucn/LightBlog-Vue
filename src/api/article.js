/**
 * 文章相关接口请求
 */
import request from './index'

export function getArticle(id){
    return request({
        url: '/article/'+id,
        method: 'GET'
    })
}

/**
 * 搜索文章
 * @param param 
 * @returns 
 */
export function searchArticle(param) {

    return request({
        url: '/article/search',
        method: 'GET',
        params: param
    })
}