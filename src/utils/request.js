import axios from 'axios';
import store from '/@/store/index.js'
import router from '/@/router/index.js'
import { message } from '/@/utils/common.js'

const instance = axios.create({
	withCredentials: true,
    // 注意！！！
    // 这里是全局统一加上了 '/dev-api' 前缀，
    // 也就是说所有接口都会加上'/dev-api'前缀在，
    // 页面里面写接口的时候就不要加 '/dev-api'了
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 3000
})

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
	const token = store.getters.token 
	if(token) {
		config.headers['PC-TOKEN'] = token
	}
	
    // 在发送请求之前做些什么
    return config;
}, function (err) {
    // 对请求错误做些什么
	message('错误提示', `${err.message || '未知异常！'}`).notify('error')
	return Promise.resolve(err)
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
	const { status, data } = response
	if(status !== 200) {
		message('错误提示', '服务器响应错误！').notify('error')
		return { code: 9999 }
	}

	if(data.code == -20 || data.code == -10) {
		store.dispatch('user/Logout').then(res=> {
			router.push('/login')
		})
		return { code: data.code, msg: data.msg };
	}
	
	if(data.code !== 0) {
		message('错误提示', data.msg || '接口数据返回异常！').notify('error')
	}
	
	return data
}, function (err) {
    // 对响应错误做点什么
	message('错误提示', err.message || '未知异常！').notify('error')
	return Promise.resolve(err)
});

const request = (method, url, data, options) => {
	const { headers } = options || {}
	
	const axiosOpts = { method, url, data }
	// 如果是get，参数是params 
	if(method === 'get') {
		axiosOpts['params'] = data
	}
	
	if(headers) {
		axiosOpts['headers'] = headers
	}
	
	return instance.request(axiosOpts)
}

export const get = (path, params, options) => {
	return request('get', path, params, options)
}

export const post = (path, data, options) => {
	return request('post', path, data, options)
}

export const put = (path, data, options) => {
	return request('put', path, data, options)
}

export const remove = (path, data, options) => {
	return request('delete', path, data, options)
}
