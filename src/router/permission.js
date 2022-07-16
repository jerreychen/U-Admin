/* 引入进度条插件 */
import NProgress from 'nprogress'
/* 引用进度条插件样式*/
import 'nprogress/nprogress.css'

import storage from '/@/utils/storage.js'
import store from '/@/store/index.js'
import router from './index.js'
import useDynamicRoutes from './routes.js'

NProgress.configure({ showSpinner: false });

// 路由白名单
const whiteList = ['/error', '/login']

// 路由守卫，实现未登录的用户他跳转到login页面
router.beforeEach((to, from, next) => {
    // 进度条开始
    NProgress.start()
	
	// 如果已经登录
    const token = storage.session.get('token');
	if(!!token) {
		if(to.path === '/login') {
		    next({ path: '/home' })
		    return
		}
		
		if(!store.getters.routeInited) {
			store.dispatch('app/initRoute')
			const routeList = useDynamicRoutes()
			routeList.forEach(item => {
				router.addRoute(item);
			})
			next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 
			return 
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
    // 进度条结束
    NProgress.done()
	
	/* 路由发生变化修改页面title */
	if (to.meta.title) {
	    document.title = `${to.meta.title} - ${import.meta.env.VITE_APP_TITLE}`
	}
})
