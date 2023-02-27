import request from '@/utils/request.js'

const modules = {
	/**
	 * 模块的增删改查地址
	 * 默认地址: '/{模块名}/{操作}'
	 * 默认操作方式: POST
	 */
	/*dict: {
		find: '',
		list: '',
		search: '',
		create: '',
		update: '',
		remove: ''
	}*/
}

const getPath = (moduleName, path) => {
	if(path.startsWith('/')) {
		path = path.substr(1)
	}
	
	return `/${moduleName}/${path}`
}

/**
 * Content 文章、内容
 */
export default (moduleName) => {
	const currentModule = modules[moduleName];
	
	return {
		get: (path, data) => {
			return request.get(getPath(moduleName, path), data)
		},
		post: (path, data) => {
			return request.post(getPath(moduleName, path), data)
		},
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
		
		find: (data) => {
			if(!currentModule || !currentModule.find) {
				return request.post(`/${moduleName}/find`, data)
			}
			return request.post(currentModule.find, data)
		},
		
		remove: (data) => {
			if(!currentModule || !currentModule.remove) {
				return request.post(`/${moduleName}/remove`, data)
			}
			return request.post(currentModule.remove, data)
		}
	}
}

