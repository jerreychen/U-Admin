import storage from './storage.js'
import cache from './cache.js'

const charStr = 'abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789';

/**
 * 随机生成索引
 * @param min 最小值
 * @param max 最大值
 * @param i 当前获取位置
 */
const getRandomIndex = (min, max, i) => {
  let index = Math.floor(Math.random() * (max - min + 1) + min),
    numStart = charStr.length - 10;
  //如果字符串第一位是数字，则递归重新获取
  if (i == 0 && index >= numStart) {
    index = getRandomIndex(min, max, i);
  }
  //返回最终索引值
  return index;
}

/**
 * 随机生成字符串
 * @param len 指定生成字符串长度
 */
export const getRandomString = (len) => {
  let min = 0, max = charStr.length - 1, _str = [];
  //判断是否指定长度，否则默认长度为15
  len = len || 16;
  //循环生成字符串
  for (let i = 0, index; i < len; i++) {
    index = getRandomIndex(min, max, i);
    _str.push( charStr[index] );
  }
  return _str.join('');
}

export const combinePath = function () {
	let path = []
	for(let i = 0; i < arguments.length; i++) {
		path.push(arguments[i] || '')
	}
	return path.filter(p=> {
		return !!p
	}).join('/').replace('//', '/')
}

export const getCachedList = (cacheKey) => {
	return cache.load(cacheKey)
}

const getDeptById = (deptList, deptId, deptNames) => {
	if(deptId === 0) {
		return
	}
	
	let dept = deptList.find(item => {
		return item.id === deptId
	})
	
	if(!dept) {
		return;
	}
	
	deptNames.push(dept.name)
	
	if(dept.parentId > 0) {
		getDeptById(deptList, dept.parentId, deptNames)
	}
}

export const getDeptNames = (deptList, deptId) => {
	const deptNames = []
	getDeptById(deptList, Number(deptId), deptNames)
	return deptNames.reverse().join(' -> ')
}

export const getDict = (groupKey) => {
	return cache.getDict(groupKey)
}

export const getDictValue = (dictList, key) => {
	const dict = dictList.find(item => {
		return item.key === (key + '')
	})
	if(dict) {
		return dict.value
	}
	return ''
}

export const getDictLabel = (dictList, key) => { 
	const dict = dictList.find(item => {
		return item.key === (key + '')
	})
	if(dict) {
		return dict.label
	}
	return ''
}

export const message = (...str) => {
	let title = ''
	let	content = ''
	
	if(str.length == 1) {	// Only one param
		content = str[0]
	}
	else if(str.length >= 2) {		// More then one param
		title = str[0]
		content = str[1]
	}
	
	return {
		notify(type) {
			return ElNotification({
				type: type || 'info', 
				title: `${title}`, 
				message: `${content}`
			})
		},
		
		show(type) {
			return ElMessage({
			    showClose: true,
			    message: `${content}`,
			    type: type || 'info',
			  })
		},
		
		alert(type) {
			return ElMessageBox.alert(content, title, {
			    confirmButtonText: '确定',
				draggable: true
			})
		},
		
		confirm(type) {
			return ElMessageBox.confirm(content, title, {
			    confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: type || 'info',
				draggable: true
			})
		},
		
		prompt(type, pattern) {
			return ElMessageBox.prompt(content, title, {
			    confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputPattern: pattern || /.+/,
				type: type || 'info',
				draggable: true
			})
		}
	}
}
