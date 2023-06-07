import store from '@/store/index.js';
import { toRaw } from '@vue/reactivity';

const buildMenuRecursive = (menu) => {
	const { 
		children, icon, id, link_type, menu_type, path, title, url, query
	} = menu;
	
	return {
		id, 
		icon, 
		link_type, 
		menu_type, 
		path, 
		title,
		url,
		query,
		children: (children || []).filter(item => {
			// menu_type: 0 -folder, 1 -link, 2 -button
			return !item.hidden && item.menu_type !== 2;
		}).map(item => {
			return buildMenuRecursive(item);
		})
	};
}

export default () => {
	const menuList = toRaw(store.getters.menuList || []);
	const builtMenuList = [];

	menuList.forEach(item => {
		if(item.hidden || item.type === 2) {
			return;
		}
		
		builtMenuList.push(buildMenuRecursive(item));
	})
	
	return builtMenuList;
};