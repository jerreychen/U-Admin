import { get, post } from '/@/utils/request.js'

// 用户登录
export const login = (data) => {
    const { username, passwd, code } = data
    return post('/user/pcLogin', {
        username,
        password: passwd,
        verification: code
    })
}
