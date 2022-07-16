import request from '/@/utils/request.js'
import { cryptoPwd } from '/@/utils/crypto.js';

// 用户登录
export const login = (data) => {
    const { username, passwd, code } = data
    return request.post('/user/login', {
        username,
        password: cryptoPwd( passwd ),
        code
    })
}

export const logout = () => {
	return request.post('/user/logout');
}

export const getInfo = (data) => {
	return request.get('/user/get', data)
}

export const getDeptTree = (data) => {
	return request.post('/dept/tree', data)
}

export const listCustomer = (data) => {
	return request.post('/user/listCustomer', data)
}
