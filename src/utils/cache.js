import storage from './storage.js'
import Enums from '/@/utils/enums.js'
import useService from '/@/services/index.js';

const getCachedList = async (cacheKey) => {
	const cachedList = storage.local.getObject(cacheKey)
	if(cachedList) {
		return cachedList
	}
	
	let res;
	let dataList = []
	switch(cacheKey) {
		
	}
	
	if(!dataList || dataList.length === 0) {
		return []
	}
	
	storage.local.setObject(cacheKey, dataList)
	return dataList
}

const getDict =  async (groupKey) => {
	if(storage.local.getObject(groupKey)) {
		return storage.local.getObject(groupKey)
	}
	
	const res = await useService('dict').list({ name: groupKey })
	if(res.code === 200) {
		storage.local.setObject(groupKey, res.data)
		return res.data
	}
	
	return []
}

export default {
	data: (cacheKey) => {
		return {
			load: () => {
				return getCachedList(cacheKey);
			},
			
			reload: () => {
				storage.local.remove(cacheKey)
				return getCachedList(cacheKey)
			}
		}
	},
	
	dict: (groupKey) => {
		return {
			load: () => {
				return getDict(groupKey);
			},
			reload: () => {
				storage.local.remove(groupKey);
				return getDict(groupKey)
			}
		}
	}
}