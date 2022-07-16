import storage from './storage.js' 
import { E_CACHE_KEY } from '/@/utils/enums.js'

const getCachedList = async (cacheKey) => {
	const cachedList = storage.local.getObject(cacheKey)
	if(cachedList) {
		return cachedList
	}
	
	let res;
	let dataList = []
	switch(cacheKey) {
		//
	}
	
	if(!dataList || dataList.length === 0) {
		return []
	}
	
	storage.local.setObject(cacheKey, dataList)
	return dataList
}

export default {
	load: getCachedList,
	
	getDict: async (groupKey) => {
		if(storage.local.getObject(groupKey)) {
			return storage.local.getObject(groupKey)
		}
		
		const res = await listDict({ key: groupKey, size: 9999 })
		if(res.code === 0) {
			storage.local.setObject(groupKey, res.data.list)
			return res.data.list
		}
		
		return []
	},
	
	reload: (cacheKey) => {
		storage.local.remove(cacheKey)
		return getCachedList(cacheKey)
	}
}