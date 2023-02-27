import router  from '@/router/index.js'
import { combinePath, getRandomString } from '@/utils/common.js'
import types from '@/utils/types.js';

export default {
	install(app) {
		
		// 全局异常处理
		app.config.errorHandler = (err, vm, info) => {
		    console.group('===== Exception!!! =====');
		    console.error(err);
			console.log(info)
		}
		
		app.config.warnHandler = (err, vm, trace) => {
			console.group('===== Warning!!! =====');
			console.warn(err);
			console.log(trace)
		}
		
		app.config.globalProperties.getServerFile = (url) => {
			return `${import.meta.env.VITE_APP_BASE_API}${url}`
		}
		
		app.config.globalProperties.getAssetUrl = (url) => {
			return new URL(`../assets/${url}`, import.meta.url).href
		}
        
        app.config.globalProperties.goto = (path, query) => {
            router.push({ path, query })
        }
        
        app.config.globalProperties.goback = () => {
            router.back();
        }
		
        app.config.globalProperties.time = () => new time()
		
        app.config.globalProperties.getRandomString = getRandomString
        	
        app.config.globalProperties.combinePath = combinePath
        
		app.config.globalProperties.isUndefined = function(value) {
			return types.isUndefined(value);
		}
		app.config.globalProperties.isNull = function(value) {
			return types.isNull(value);
		}
		app.config.globalProperties.isNullOrEmpty = function(value) {
			return types.isNullOrEmpty(value);
		}
        app.config.globalProperties.isBoolean = function(value) {
        	return types.isBoolean(value);
        }
        app.config.globalProperties.isObject = function(value) {
        	return types.isObject(value);
        }
        app.config.globalProperties.isFunction = function(value) {
        	return types.isFunction(value);
        }
        app.config.globalProperties.isRegExp = function(value) {
        	return types.isRegExp(value);
        }
        app.config.globalProperties.isDate = function(value) {
        	return types.isDate(value);
        }
        app.config.globalProperties.isString = function(value) {
        	return types.isString(value);
        }
        app.config.globalProperties.isNumber = function(value) {
        	return types.isNumber(value);
        }
        app.config.globalProperties.isSymbol = function(value) {
        	return types.isSymbol(value);
        }
        app.config.globalProperties.isArray = function(value) {
        	return types.isArray(value);
        }
    }
}