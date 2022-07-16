import storage from '/@/utils/storage.js'
import { login } from '/@/services/user.js'

const user = {
    namespaced: true,
	
    state: {
        token: storage.session.get('token'),
        displayName: storage.session.get('displayName'),
        avatarUrl: storage.session.get('avatarUrl'),
		remember: storage.session.get('remember'),
        roles: []
    },
    
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token
            storage.session.set('token', token)
        },
		
		SET_REMEMBER(state, remember) {
			state.remember = remember
			storage.session.set('remember', remember)
		},
        
        SET_DISPLAY_NAME(state, displayName) {
            state.displayName = displayName
            storage.session.set('displayName', displayName)
        },
        
        SET_AVATAR(state, avatarUrl) {
            state.avatarUrl = avatarUrl
            storage.session.set('avatarUrl', avatarUrl)
        },
		
        SET_ROLES(state, roles) {
            state.roles = roles
            storage.session.set('roles', roles)
        },
		
		REMOVE_TOKEN(state) {
			state.token = ''
			storage.session.remove('token')
		}
    },
    
    actions: {
        Login({ commit }, data) {
			return login(data).then((res) => {
				if(res.code == 0) {
					return commit('SET_TOKEN', res.data)
				}
			})
        },
        
        Logout({ commit }) {
            return commit('REMOVE_TOKEN')
			
        }
    }
}

export default user