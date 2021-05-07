import router from "@/router"

/**
 * 组织评论
 * @param comments 原始数据
 */
export const handleComents = (comments) => {
    console.log(comments, typeof comments)
    const childs = comments.filter(c => c.parentId !== null)
    const indexs = comments.filter(c => c.parentId === null)

    // 封装成父子评论对象
    const items = indexs.sort((c1, c2) => c1.createTime.getTime() - c2.createTime.getTime())
        .map(val => {
            const item = {
                index: null,
                childs: []
            }
            item.index = val
            item.childs = findComment(Array.of(val.id), childs, item.childs)
            return item
        })
    return items
}
/**
 * 合并子评论
 * @param id 根
 * @param comments 
 * @param all 
 * @returns []
 */
const findComment = (ids, comments, all) => {

    // 评论都分类完了
    if (ids.length == 0) {
        return all
    }

    const arr = comments.concat()
    const subs = []

    for (let j = 0; j < ids.length; j++) {
        const id = ids[j]

        // 找出当前id的子评论
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i]
            if (item.parentId === id) {
                // 合并
                all.push(item)
                // 记录一下刚刚的子评论，再找他的子评论
                subs.push(item.id)
                // 从遍历列表中删除
                comments.splice(i, 1)
            }
        }
    }
    // 再找
    return findComment(subs, comments, all)
}

/**
 * 格式化为 yyyy-MM-dd HH:mm:ss
 * @param {*} date 
 * @returns 
 */
export const formatDateTime = (date) => {
    const time = new Date(date)
    const ymd = formatDate(date)
    const hours = time.getHours() > 9 ? time.getHours() : '0'+time.getHours()
    const minutes = (time.getMinutes() + 1) > 9 ? (time.getMinutes() + 1) : '0'+(time.getMinutes() + 1)
    const seconds = time.getSeconds() > 9 ? time.getSeconds() : '0' + time.getSeconds()
    return ymd + ' ' + hours + ':' + minutes + ':' + seconds
}

/**
 * 格式化为 yyyy-MM-dd
 * @param {*} date 
 * @returns 
 */
export const formatDate = (date) => {
    const time = new Date(date)
    const year = time.getFullYear()
    const month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)
    const days = time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
    return year + '-' + month + '-' + days
}

export const go = path => {
    router.push(path)
}

export const getUser = () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
}

export const setUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user))
}

export const removeUser = () => {
    localStorage.removeItem('user')
}

export const setItem = (key, val) => {
    localStorage.setItem(key, JSON.stringify(val))
}

export const getItem = (key) => {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
}