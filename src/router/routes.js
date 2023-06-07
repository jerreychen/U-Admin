import store from '@/store/index.js';
import { toRaw } from '@vue/reactivity';
import Layout from '@/layout/index.vue';
import Empty from '@/layout/empty.vue';

// 取到 /pages 目录下的所有的 .vue 文件
const modules = import.meta.glob('/src/pages/**/*.vue');

// 把所有按钮过滤掉
const filterMenu = (menu) => {
	const { menu_type } = menu
	return menu_type !== 2
}

// 组合 RouteItem
// menu_type: 0 -folder, 1 -link, 2 -button
const buildRouteItem = (menu) => {
	const { 
		id, path, title, url
	} = menu;
	// 如果 '/' 开头 要去掉 '/'
	const filePath = path.startsWith('/') ? path.substr(1) : path
	
	return {
		name: id,
		path: url,
		meta: { title },
		component: modules[`/src/${filePath}`]
	}
}

// 对当前 menu 进行 递归组合
const buildRouteItemRecursively = (menu) => {
	const {
		children, id, menu_type, title, url
	} = menu;
	
	// 如果菜单项是链接 
	if(menu_type === 1) {
		return buildRouteItem(menu);
	}

	// 如果非链接，（过滤 按钮）
	return {
		name: id,
		path: url,
		meta: { title, noPage: true },
		component: Empty,
		children: children.filter(filterMenu).map(item => {
			return buildRouteItemRecursively(item)
		})
	}
}

export default () => {
	const menuList = toRaw(store.getters.menuList) || [];
 
	// menu_type: 0 -folder, 1 -link, 2 -button
	// 过滤 按钮
	return menuList.filter(filterMenu).map(item =>{
		const { children = [], url, id, menu_type, title } = item;
		
		const path = url.startsWith('/') ? url : `/${url}`
		
		// 当前菜单项是链接
		if(menu_type === 1) {
			return {
				path,
				name: id,
				meta: { title },
				component: Layout,
				children: [
					buildRouteItem(item)
				]
			}
		}
		
		// 当前菜单项不是链接（菜单组）
		// 列出 子菜单是 link，作为子菜单项目
		return {
			path,
			name: id,
			meta: { title, noPage: true },
			component: Layout,
			children: children.filter(filterMenu).map(subItem => {
				return buildRouteItemRecursively(subItem)
			})
		}
	})
}