import Cookies from 'js-cookie'

const STORAGE_TYPE = {
	local: 'local',
	session: 'session'
}

/* sessionStorage / localStorage utils */
const getStorageObject = (type, key, defaultObjVal) => {
	const val = (type === STORAGE_TYPE.local) ? localStorage.getItem(key) : sessionStorage.getItem(key)
	return val && JSON.parse(val) || defaultObjVal
}
const getStorage = (type, key, defaultVal) => {
	const val = (type === STORAGE_TYPE.local) ? localStorage.getItem(key) : sessionStorage.getItem(key) 
	return val || defaultVal; 
}
const setStorageObject = (type, key, objValue) => {
	const val = JSON.stringify(objValue)
	return (type === STORAGE_TYPE.local) ? localStorage.setItem(key, val) : sessionStorage.setItem(key, val)
}
const setStorage = (type, key, objVal) => {
    return (type === STORAGE_TYPE.local) ? localStorage.setItem(key, objVal) : sessionStorage.setItem(key, objVal)
}
const removeStorage = (type, key) => {
    return (type === STORAGE_TYPE.local) ? localStorage.removeItem(key) : sessionStorage.removeItem(key)
}
const clearStorage = (type) => {
    return (type === STORAGE_TYPE.local) ? localStorage.clear() : sessionStorage.clear()
}

const storage = {
    session: {
        get: (key, defaultValue) => {
            return getStorage(STORAGE_TYPE.session, key, defaultValue)
        },
		getObject: (key, defaultObjValue) => {
			return getStorageObject(STORAGE_TYPE.session, key, defaultObjValue)
		},
        set: (key, objValue) => {
            return setStorage(STORAGE_TYPE.session, key, objValue)
        },
		setObject: (key, objValue) => {
			return setStorageObject(STORAGE_TYPE.session, key, objValue)
		},
        remove: (key) => {
            return removeStorage(STORAGE_TYPE.session, key)
        },
        clear: () => {
            return clearStorage(STORAGE_TYPE.session)
        }
    },
    
    local: {
        get: (key, defaultValue) => {
            return getStorage(STORAGE_TYPE.local, key, defaultValue)
        },
		getObject: (key, defaultObjValue) => {
			return getStorageObject(STORAGE_TYPE.local, key, defaultObjValue)
		},
        set: (key, objValue) => {
            return setStorage(STORAGE_TYPE.local, key, objValue)
        },
		setObject: (key, objValue) => {
			return setStorageObject(STORAGE_TYPE.local, key, objValue)
		},
        remove: (key) => {
            return removeStorage(STORAGE_TYPE.local, key)
        },
        clear: () => {
            return clearStorage(STORAGE_TYPE.local)
        }
    },
	
	cookie: {
		get: (key, defaultValue) => {
			return Cookies.get(key) || defaultValue
		},
		set: (key, value, expires) => {
			expires = expires || 1 // 默认值 1 天
			return Cookies.set(key, value, { expires })
		},
		getObject: (key, defaultObjValue) => {
			const strObjValue = Cookies.get(key) 
			if(!strObjValue) {
				return defaultValue
			}
			return JSON.parse(strObjValue)
		},
		setObject: (key, objValue, expires) => { 
			const strObjValue = JSON.stringify(objValue)
			expires = expires || 1 // 默认值 1 天
			return Cookies.set(key, strObjValue, { expires })
		},
		remove: (key) => {
			return Cookies.remove(key)
		},
		clear: () => {
			const cookies = Cookies.get()
			Object.keys(cookies).forEach(c => {
				Cookies.remove(key)
			})
			return true
		}
	}
}

export default storage