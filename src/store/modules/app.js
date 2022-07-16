import storage from '/@/utils/storage.js'
import { RouterLink } from 'vue-router'
import { getMenuTree } from '/@/services/app.js';

// 更新 session 缓存中的 menuList 
const refreshMenuList = () => {
	return getMenuTree().then(res => {
		return res.data || []
	})
}

const app = {
    namespaced: true,
	
    state: {
		errorCount: 0,
		routeInited: false,
        sidebar: storage.local.get('sidebar') === 'true',
        themeName: 'default',
		menuList: storage.session.getObject('menuList', [])
    },
    
    mutations: {
        TOGGLE_SIDEBAR(state) {
            state.sidebar = !state.sidebar
            storage.local.set('sidebar', state.sidebar)
        },
        
        SET_THEME(state, theme) {
            state.theme = theme
            storage.local.set('theme', state.theme)
        },
        
		SET_ERROR_INCREMENT(state) {
			state.errorCount++
		},
		
		CLEAR_ERROR(state) {
			state.errorCount = 0
		},
		
		SET_MENU_LIST(state, dataList) {
			state.menuList = dataList
			storage.session.setObject('menuList', dataList);
		},
		
		SET_ROUTE_INITED(state, inited) {
			state.routeInited = inited
		}
    },
    
    actions: {
		errorIncrement({ commit }) {
			commit('SET_ERROR_INCREMENT')
		},
		
		errorClear({ commit }) {
			commit('CLEAR_ERROR')
		},
		
        toggleSidebar({ commit }) {
            commit('TOGGLE_SIDEBAR')
        },
        
        setTheme({ commit }, theme) {
            commit('SET_THEME', theme)
        },
		
		initRoute({ commit }) {
			commit('SET_ROUTE_INITED', true)
		},
		
		refreshCache({ commit }) {
			// 清除所有 local 缓存
			storage.local.clear()
			return refreshMenuList().then(dataList => {
				commit('SET_ROUTE_INITED', false)
				commit('SET_MENU_LIST', dataList)
			})
		},
		
		refreshMenu({ commit }) {
			return refreshMenuList().then(dataList => {
				commit('SET_ROUTE_INITED', false)
				commit('SET_MENU_LIST', dataList)
			})
		}
    }
}

export default app