/** 
 * 封装 Axios
 */
import axios from 'axios'
import qs from 'qs'
import {
    ElMessage
} from 'element-plus'

const request = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000,
    transformRequest: (data) => {
        return qs.stringify(data)
    }
})

request.interceptors.request.use(
    (config) => {
        // 设置请求Token
        const token = getToken()
        console.log('token {}', token)
        if ('' !== token && null !== token) {
            config.headers['Authorization'] = token;
        }
        return config
    },
    (error) => {
        console.log('请求异常：' + error.message)
        return Promise.reject(error)
    },
)

request.interceptors.response.use(
    (response) => {
        const res = response.data
        if (response.status === 200 && res.code === 0) {
            console.log(response)
            return res
        } else {
            ElMessage.error(res.msg)
            return Promise.reject(new Error(res.msg || 'Error'))
        }
    },
    (error) => {
        console.log(error)
        ElMessage.error(error.message)
        return Promise.reject(error)
    }
)

function getToken() {
    return localStorage.getItem('token')
}

export default request