import store from '/@/store/index.js';
import router from '/@/router/index.js';
import { toRaw } from '@vue/reactivity';
import Layout from '/@/layout/index.vue';
import Empty from '/@/layout/empty.vue';

const modules = import.meta.glob('/src/pages/**/*.vue');

const filterMenu = (menu) => {
	const { menu_type } = menu
	return menu_type !== 2
}

// menu_type: 0 -folder, 1 -link, 2 -button
const buildRouteItem = (menu) => {
	const { 
		id, link_type, path, title, url
	} = menu;
	 
	return {
		name: id,
		path: url,
		meta: { title },
		component: modules[`/src/${path.startsWith('/') ? path.substr(1) : path}`]
	}
}

const addRouteItemRecursively = (menu) => {
	const {
		children, id, link_type, menu_type, path, title, url
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
			return addRouteItemRecursively(item)
		})
	}
}

export default () => {
	const menuList = toRaw(store.getters.menuList) || [];
 
	// menu_type: 0 -folder, 1 -link, 2 -button
	// 过滤 按钮
	return menuList.filter(filterMenu).map(item =>{
		const { children = [], url, id, menu_type, title } = item;
		// 当前菜单项是链接
		if(menu_type === 1) {
			return {
				path: url.startsWith('/') ? url : `/${url}`,
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
			path: url.startsWith('/') ? url : `/${url}`,
			name: id,
			meta: { title, noPage: true },
			component: Layout,
			children: children.filter(filterMenu).map(subItem => {
				return addRouteItemRecursively(subItem)
			})
		}
	})
}