
export const getMenuList = () => {
    return new Promise(resolve => {
        
        const routeList = [
            {
                id: '1', 
                name: '用户管理', 
                iconName: 'User', 
				type: 0,
                url: '/system/user',
                sub: [
                    { id: '1-2', name: '系统用户', type: 1, url: 'index', path: 'pages/system/user/index.vue' },
                    { id: '1-0', name: '角色管理', type: 1, url: 'role', path: 'pages/system/user/role/index.vue' }
                ], 
            }
        ]
            
        setTimeout(() => {
            resolve({ code: 0, data: routeList })
        }, 500)
    })
}