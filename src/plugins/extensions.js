import router  from '/@/router/index.js'
import { combinePath, getRandomString } from '/@/utils/common.js'

export default {
	install(app) {
		app.config.globalProperties.getServerFile = (url) => {
			return `${import.meta.env.VITE_APP_BASE_API}${url}`
		}
		
		app.config.globalProperties.getAssetUrl = (url) => {
			return new URL(`../assets/${url}`, import.meta.url).href
		}
        
        app.config.globalProperties.goto = (path) => {
            router.push({ path })
        }
        
        app.config.globalProperties.goback = () => {
            router.back();
        }
		
        app.config.globalProperties.time = () => new time()
		
        app.config.globalProperties.getRandomString = getRandomString
        	
        app.config.globalProperties.combinePath = combinePath
        
        /**
         * 检查数据类型相关函数扩展
         * Copyright (c) Jerrey @ Kuakee Networks
         * EMAIL: jerreychen@qq.com
         * DATE: 2022-05-17
         */
        app.config.globalProperties.isObject = function(value) {
        	return Object.prototype.toString.call(value) === "[object Object]";
        }
        app.config.globalProperties.isFunction = function(value) {
        	return Object.prototype.toString.call(value) === "[object Function]";
        }
        app.config.globalProperties.isRegExp = function(v) {
        	return Object.prototype.toString.call(v) === "[object RegExp]";
        }
        app.config.globalProperties.isDate = function(v) {
        	return (Object.prototype.toString.call(v) === "[object Date]") && !(isNaN(v.getTime()));
        }
        app.config.globalProperties.isString = function(value) {
        	return Object.prototype.toString.call(value) === "[object String]";
        }
        app.config.globalProperties.isNumber = function(v) {
        	return Object.prototype.toString.call(v) === "[object Number]";
        }
    }
}