import request from '/@/utils/request.js'

const modules = {
	/**
	 * 模块的增删改查地址
	 * 默认地址: '/{模块名}/{操作}'
	 * 默认操作方式: POST
	 */
	/*dict: {
		get: '',
		list: '',
		search: '',
		create: '',
		update: '',
		remove: ''
	}*/
}

/**
 * Content 文章、内容
 */
export default (moduleName) => {
	const currentModule = modules[moduleName];
	
	return {
		list: (data) => {
			if(!currentModule || currentModule.list) {
				return request.post(`/${moduleName}/list`, data)
			}
			return request.post(currentModule.list, data)
		},
		
		search: (data) => {
			if(!currentModule || !currentModule.search) {
				return request.post(`/${moduleName}/search`, data)
			}
			return request.post(currentModule.search, data)
		},
		
		create: (data) => {
			if(!currentModule || !currentModule.create) {
				return request.post(`/${moduleName}/create`, data)
			}
			return request.post(currentModule.create, data)
		},
		
		update: (data) => {
			if(!currentModule || !currentModule.update) {
				return request.post(`/${moduleName}/update`, data)
			}
			return request.post(currentModule.update, data)
		},
		
		get: (data) => {
			if(!currentModule || !currentModule.get) {
				return request.post(`/${moduleName}/get`, data)
			}
			return request.post(currentModule.get, data)
		},
		
		remove: (data) => {
			if(!currentModule || !currentModule.remove) {
				return request.post(`/${moduleName}/remove`, data)
			}
			return request.post(currentModule.remove, data)
		}
	}
}

