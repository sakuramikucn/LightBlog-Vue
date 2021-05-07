/** 
 * 封装 Axios
 */
import axios from 'axios'
// import qs from 'qs'
import {
    ElMessage
} from 'element-plus'
import {
    removeUser
} from 'utils/common'

const request = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
    // timeout: 10000,
})

request.interceptors.request.use(
    (config) => {
        // 设置请求Token
        const token = getToken()
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
            const refresh = response.headers['token-refresh']
            if (refresh === 'true') {
                const token = response.headers['authorization']
                if (token) {
                    console.log('移除旧Token', getToken())
                    localStorage.removeItem('token')
                    setToken(token)
                    console.log('更新Token', getToken())
                }
            }
            console.log('interceptors.response ==> ', new Date, response)
            return res
        } else {
            if (res.code === 2002) {
                ElMessage.error(res.msg)
                removeUser()
                setTimeout(() => {
                    location.href = '/login'
                }, 1000);
            } else if (res.code === 1002) {
                ElMessage.error("请求参数错误")
            } else {
                ElMessage.error(res.msg)
            }

            return Promise.reject(new Error(res.msg || 'Error'))
        }
    },
    (error) => {
        console.log(error)
        if (error.message === 'timeout of 10000ms exceeded') {
            ElMessage.error('请求超时')
        } else if (error.message === 'Network Error') {
            ElMessage.error('网络错误')
        } else {
            ElMessage.error(error.message)
        }

        return Promise.reject(error)
    }
)

function getToken() {
    return localStorage.getItem('token')
}

function setToken(token) {
    localStorage.setItem('token', token)
}

export default request