import store from '@/store/index.js'
import storage from '@/utils/storage.js'
import { login, getInfo, logout } from '@/services/user.js'

const user = {
    namespaced: true,
	
    state: {
        token: storage.session.get('token'),
		userId: storage.session.get('user_id'),
		userData: storage.session.getObject('user_data'),
        displayName: storage.session.get('displayName'),
        avatarUrl: storage.session.get('avatarUrl'),
        roles: storage.session.getObject('roles', []),
		permissions: storage.session.getObject('permissions', ['*'])
    },
    
    mutations: {
        SET_TOKEN(state, data) {
			const { token, user_id } = data;
			
            state.token = token;
            storage.session.set('token', token);
			
			state.userId = user_id;
			storage.session.set('user_id', user_id);
        },
		
		SET_REMEMBER(state, data) {
			const { username, passwd, remember } = data
			state.userData = { username, passwd, remember}
			storage.session.setObject('user_data', state.userData)
		},
        
        SET_USER_INFO(state, data) {
			const { displayName, avatarUrl, roles, permissions } = data || {}
			if(displayName) {
				state.displayName = displayName
				storage.session.set('displayName', displayName)
			}
			if(avatarUrl) {
				state.avatarUrl = avatarUrl
				storage.session.set('avatarUrl', avatarUrl)
			}
			if(roles) {
				state.roles = roles
				storage.session.setObject('roles', roles)
			}
			if(permissions) {
				state.permissions = permissions
				storage.session.setObject('permissions', permissions)
			}
        },
		
		REMOVE_TOKEN(state) {
			state.token = '';
			state.userId = '';
			state.menuList = '';
			storage.session.clear();
		}
    },
    
    actions: {
        async Login({ commit }, data) {
			// 记住账号密码
			if(data.remember) {
				commit('SET_REMEMBER', data)
			}
			
			const loginRes = await login(data);
			if(loginRes.code === 200) {
				commit('SET_TOKEN', loginRes.data)
				
				const { user_id } = loginRes.data;
				// 刷新菜单
				store.dispatch('app/refreshMenu')
				// 获取用户
				const userInfoRes = await getInfo({ user_id }); 
				
				// 设置用户资料缓存
				if(userInfoRes.code === 200) {
					commit('SET_USER_INFO', userInfoRes.data)
				}
			}
			
			return loginRes;
        },

        Logout({ commit }) {
			return logout().then(res => {
				if(res.code === 200) {
					return commit('REMOVE_TOKEN')
				}
			})
        }
    }
}

export default user