import { createStore } from 'vuex'
import storage from '/@/utils/storage.js'

import app from './modules/app.js'
import user from './modules/user.js'

const store = createStore({
    modules: {
        app,
        user
    },
    
    getters: {
        token: state => state.user.token,
		permissions: state => { return ['u.*.*'] },
        displayName: state => state.user.displayName,
        avatarUrl: state => state.user.avatarUrl,
        theme: state => state.app.theme,
        sidebar: state => state.app.sidebar,
        routeList: state => state.app.routeList
    }
})

export default store
