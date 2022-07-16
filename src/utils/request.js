import axios from 'axios';
import store from '/@/store/index.js'
import router from '/@/router/index.js'
import message from '/@/utils/message.js'

const instance = axios.create({
	withCredentials: true,
    // 注意！！！
    // 这里是全局统一加上了 '/dev-api' 前缀，
    // 也就是说所有接口都会加上'/dev-api'前缀在，
    // 页面里面写接口的时候就不要加 '/dev-api'了
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 30000
})

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
	const token = store.getters.token 
	if(token) {
		config.headers['USER-TOKEN'] = token
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
	
	//账号被他人登录，被迫下线，未登录，跳转到登录页面 
	// 403 未登录， 405 被踢下线
	if(data.code === 403 || data.code === 405) {
		// 如果请求失败，新增失败次数
		store.dispatch('app/errorIncrement')
		// 如果次数 === 1 的时候执行，这样就不会一直弹窗
		if(store.getters.errorCount === 1) {
			const msg_title = data.code === 405 ? '异地登录提示' : '登录提示'
			const msg_conent = data.code === 405 ? '您的账号被他人登录，被迫下线！' : '登录已过期，请重新登录'
			message(msg_title, msg_conent).alert('warning').then(() => {
				store.dispatch('user/Logout').then(res=> {
					router.push('/login')
				})
			}).catch(() => {
				store.dispatch('user/Logout').then(res=> {
					router.push('/login')
				})
			})
		}
		return { code: data.code, msg: data.msg };
	}
	// 清除错误次数
	store.dispatch('app/errorClear')
	
	if(data.code !== 200) {
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

const get = (path, params, options) => {
	return request('get', path, params, options)
}
const post = (path, data, options) => {
	return request('post', path, data, options)
}
const put = (path, data, options) => {
	return request('put', path, data, options)
}
const remove = (path, data, options) => {
	return request('delete', path, data, options)
}
const patch = (path, data, options) => {
	return request('patch', path, data, options)
}

export default {
	get, post, put, remove, patch
}
