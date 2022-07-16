/* 引入进度条插件 */
import NProgress from 'nprogress'
/* 引用进度条插件样式*/
import 'nprogress/nprogress.css'

import store from '/@/store/index.js'
import router from './index.js'
import storage from '/@/utils/storage.js'
import Layout from '/@/layout/index.vue'

NProgress.configure({ showSpinner: false });

const modules = import.meta.glob('/src/pages/**/*.vue');

const buildRouteConfig = (page) => {
    const { path, name, component, componentFile, title } = page
	
    return {
        path,
        name,
        component: component || modules[`/src/${componentFile}`],
        meta: { title }
    }
}

const buildDynamicRoute = (item) => {
    const { id, name, parentId, sub, type, url, path} = item
	
    // 如果没有子项(非按钮)
    if(!sub || !sub.find(n => { return n.type !== 2 })) {
        return buildRouteConfig({
            path: url, 
            name: id, 
            title: name, 
            componentFile: path
        })
    }
    // 如果有子项(非按钮)
    return {
        path: url,
        name: id, 
		title: name,
        meta: { title: name, noPage: true }, 
        component: Layout,
        children: sub.filter(c=>{
			return c.type !== 2
		}).map(c => {
            return buildRouteConfig({
                path: c.url.startsWith('/') ? c.url.substr(1) : c.url,
                name: c.id, 
                title: c.name, 
                componentFile: c.path
            })
        })
    }
}

// 路由白名单
const whiteList = ['/error', '/login']

// 路由守卫，实现未登录的用户他跳转到login页面
router.beforeEach(async (to, from, next) => {
    // 进度条开始
    NProgress.start()
    
	// 如果已经登录
    const token = storage.session.get('token');
	if(!!token) {
		if(to.path === '/login') {
		    next({ path: '/home' })
		    return
		}
		
		if(store.getters.routeList.length === 0) {
		    // 生成动态路由表
		    const list = await store.dispatch('app/getRouteList')
		    if(list && list.length > 0) {
				list.forEach(item => {
					router.addRoute(buildDynamicRoute(item))
				})
				next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 
				return
			}
		}
		
		next();
		return
	}
	
	// 在白名单中的路由 或者 已经授权 直接进入 
	if(whiteList.indexOf(to.path) >= 0) {
	    next()
	    return
	}
	
	// 否则进入登录页
	next({ path: '/login', query: { redirectTo: to.path } })
})

router.afterEach((to) => {
	/* 路由发生变化修改页面title */
	if (to.meta.title) {
	    document.title = `${to.meta.title} - ${import.meta.env.VITE_APP_TITLE}`
	}
	
    // 进度条结束
    NProgress.done()
})
