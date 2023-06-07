import { createStore } from 'vuex'

import app from './modules/app.js'
import user from './modules/user.js'

const store = createStore({
    modules: {
        app,
        user
    },
    
    getters: {
        token: state => state.user.token,
		userId: state => state.user.userId,
		userData: state => state.user.userData,
		
        displayName: state => state.user.displayName,
        avatarUrl: state => state.user.avatarUrl,
		roles: state => state.user.roles,
		permissions: state => state.user.permissions,

		routeInited: state => state.app.routeInited,
		errorCount: state => state.app.errorCount,
        theme: state => state.app.theme,
        sidebar: state => state.app.sidebar,
		menuList: state => state.app.menuList
    }
})

export default store
