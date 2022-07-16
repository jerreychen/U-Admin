import Layout from '/@/layout/index.vue'

export default [{
	path: '/', 
	name: 'u-admin_root',
	redirect: '/home', 
	component: Layout,
	children: [
		{
		    path: 'home', 
		    name: 'u-admin_home', 
		    component: () => import('/@/pages/index.vue'), 
		    meta: { title: '控制面板' }
		}
	]
}, {
	path: '/user',
	name: 'u-admin_user',
	redirect: '/index',
	component: Layout,
	children: [
		{
		    path: 'index' ,
		    name: 'u-admin_ucenter', 
		    component: () => import('/@/pages/user/index.vue'),
		    meta: { title: '个人中心' }
		}, { 
		    path: 'profile',
		    name: 'u-admin_profile', 
		    component: () => import('/@/pages/user/profile/index.vue'),
		    meta: { title: '修改资料' }
		}, { 
		    path: 'changePwd',
		    name: 'u-admin_change_password', 
		    component: () => import('/@/pages/user/changePwd/index.vue'),
		    meta: { title: '修改密码' }
		},
	]
}, {
	path: '/login',
	name: 'u-admin_login',
	component: () => import('/@/pages/login.vue'),
	meta: { title: '系统登录' }
}, {
	path: '/dashboard',
	name: 'u-admin_dashboard',
	component: () => import('/@/pages/dashboard/index.vue'),
	meta: { title: '数据仪表盘' }
}, {
	path: '/:pathMatch(.*)',  
	component: () => import('/@/pages/error.vue'), 
	meta: { title: '访问失败' }
}]