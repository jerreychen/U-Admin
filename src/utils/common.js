import { onMounted, onUnmounted } from 'vue'
import storage from './storage.js'

export function useEventListener(target, event, callback) {
  // 如果你想的话，
  // 也可以用字符串形式的 CSS 选择器来寻找目标 DOM 元素
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}

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

export const getDictLabel = (dictList, key) => { 
	const dict = dictList.find(item => {
		return item.key === (key + '')
	})
	if(dict) {
		return dict.label
	}
	return ''
}

export const getObjectProp = (props, key, defaultValue) => {
	if(props) {
		return props[key] ?? defaultValue
	}
	return defaultValue
}

export const saveFile = (fileNameEncode, fileBlob, fileType) => {
	// 解码
	const fileName = decodeURIComponent(fileNameEncode)
	// 设置type类型
	const blob = new Blob([fileBlob], {
	  type: fileType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; application/octet-stream'
	})
	const fileUrl = window.URL.createObjectURL(blob)
	
	const a = document.createElement('a')
	a.href = fileUrl
	a.setAttribute('download', fileName)
	a.style.display = 'none'
	a.click()
	a.remove() 
}

export const getDeptNameRecursively = (deptList, deptId, depts) => {
	if(!depts) {
		depts = [];
	}
	
	const deptItem = deptList.find(dept => {
		return dept['id'] === deptId
	})
	
	if(!deptItem) {
		return depts;
	}
	
	depts.unshift(deptItem.title);
	
	if(deptItem.parent_id === 0) {
		return depts;
	}
	
	return getDeptNameRecursively(deptList, deptItem.parent_id, depts);
}

export const getMenuUrlRecursively = (menuList, menuId, menus) => {
	if(!menus) {
		menus = [];
	}
	const menuItem = menuList.find(menu => {
		return menu['id'] === menuId
	})
	
	if(!menuItem) {
		return menus;
	}
	
	menus.unshift(menuItem.url);
	
	if(menuItem.parent_id === 0) {
		return menus;
	}

	return getMenuUrlRecursively(menuList, menuItem.parent_id, menus);
}

export const getDeptNamesByTree = (deptTree, deptId) => {
	
}

export const getMenuUrlByTree = (menuTree, menuId, urls) => {
	if(!urls) {
		urls = [];
	}
	
	if(!menuTree) {
		menuTree = []
	}
	
	if(!Array.isArray(menuTree)) {
		menuTree = [menuTree]
	}
	
	for(let i=0; i< menuTree.length; i++) {
		let item = menuTree[i]
		let tmpUrls = [...urls]
		// 如果有地址
		if(item.url) {
			tmpUrls.push(item.url);
		}
		
		if(item.id == menuId ) {
			return tmpUrls;
		}
		
		let result = getMenuUrlByTree(item.children, menuId, tmpUrls);
		if(result) {
			return result;
		}
	}
}