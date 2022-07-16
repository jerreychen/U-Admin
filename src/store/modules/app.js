import storage from '/@/utils/storage.js'
import { getMenuList } from '/@/services/menu.js'

const app = {
    namespaced: true,
	
    state: {
        sidebar: storage.local.get('sidebar') === 'true',
        themeName: 'default',
        routeList: []
    },
    
    mutations: {
        TOGGLE_SIDEBAR(state) {
            state.sidebar = !state.sidebar
            // 缓存到本地
            storage.local.set('sidebar', state.sidebar)
        },
        
        SET_THEME(state, theme) {
            state.theme = theme
            // 缓存到本地
            storage.local.set('theme', state.theme)
        },
        
        SET_ROUTE_LIST(state, routeList) {
            state.routeList = routeList
        }
    },
    
    actions: {
        toggleSidebar({ commit }) {
            commit('TOGGLE_SIDEBAR')
        },
        
        setTheme({ commit }, theme) {
            commit('SET_THEME', theme)
        },
        
        getRouteList({ commit }) { 
			return getMenuList().then(res => {
				if(res.code == 0) {
					commit('SET_ROUTE_LIST', res.data)
				}
				
				return Promise.resolve(res.data)
			}) 
        }
    }
}

export default app