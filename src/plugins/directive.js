import store from '/@/store/index.js'
import message from '/@/utils/message.js'

const checkPermission = (el, binding, vnode, callback) => {
	const { value } = binding
	const className = el.getAttribute('class') 
	const permissions = store.getters && store.getters.permissions
	// 如果 permissions 不是数组，或者含有 *.*.* 那就是有全部权限
	if(!Array.isArray(permissions) || permissions.indexOf('*.*.*') >= 0) {
		return
	}
	
	if (Array.isArray(value) && value.length > 0) {
		const hasPermission = value.some(v => {
			return permissions.indexOf(v) >= 0
		})
		
		if(!hasPermission) {
			callback && callback.call()
		}
	}
}

export default {
	
	install(app) {
		
		// 用于防止多次点击保存效果，仅用于button
		app.directive('preventReClick', (el, binding) => {
			const preventReClickFun = (elValue, bindingValue) => {
				if (!elValue.disabled) {
					elValue.disabled = true
					setTimeout(() => {
						elValue.disabled = false
					}, bindingValue.value || 500)
				}
			}
			
			el.addEventListener('click', () => preventReClickFun(el, binding))
			
			binding.dir.unmounted = () => {
				el.removeEventListener('click', () => preventReClickFun(el, binding))
			}
		});
		
		// 如果无权限，隐藏
		app.directive('permi', {
			mounted: (el, binding, vnode) => checkPermission(el, binding, vnode, () => {
				el.parentNode && el.parentNode.removeChild(el);
			})
		})
		// 如果无权限，置灰
		app.directive('hasPermi', {
			mounted: (el, binding, vnode) => checkPermission(el, binding, vnode, () => {
				el.disabled = true
				el.setAttribute('class', el.getAttribute('class') + ' is-disabled')
				el.setAttribute('aria-disabled', true)
			})
		})
	}
	
}