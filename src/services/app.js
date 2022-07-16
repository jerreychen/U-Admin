import request from '/@/utils/request.js'

export const getCaptcha = () => {
	return request.get('/index/getCaptcha')
}

/**
 * Menu 菜单
 */
export const getMenuTree = () => {
    return request.post('/menu/tree')
}
export const updateVisible = (data) => {
	return request.post('/menu/updateVisible', data)
}

/**
 * Dict 字典
 */
export const getDictTree = () => {
	return request.post('/dict/tree');
}
export const getDictGroupList = () => {
	return request.post('/dict/listGroup');
}

export const getDistrictList = (data) => {
	return request.post('/district/pageList', data);
}

export const getDeptTree = (data) => {
	return request.post('/dept/tree', data)
}

/**
 * Notice 通知、公告
 */
export const checkUnreadNotify = (data) => {
	return request.post('', data)
}
export const listNotify = (data) => {
	return request.get('', data)
} 
export const readAllNotify = (data) => {
	return request.post('', data)
} 
export const readNotify = (data) => {
	return request.post('', data)
}
