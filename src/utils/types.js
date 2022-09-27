/**
 * 检查数据类型相关函数扩展
 * Copyright (c) Jerrey @ Kuakee Networks
 * EMAIL: jerreychen@qq.com
 * DATE: 2022-05-17
 */
const isUndefined = function(value) {
	return Object.prototype.toString.call(value) === "[object Undefined]";
}

const isNull = function(value) {
	return Object.prototype.toString.call(value) === "[object Null]";
}

const isNullOrUndefined = function(value) {
	return isNull(value) || isUndefined(value)
}

const isBoolean = function(value) {
	return Object.prototype.toString.call(value) === "[object Boolean]";
}

const isObject = function(value) {
	return Object.prototype.toString.call(value) === "[object Object]";
}

const isFunction = function(value) {
	return Object.prototype.toString.call(value) === "[object Function]";
}

const isRegExp = function(value) {
	return Object.prototype.toString.call(value) === "[object RegExp]";
}

const isDate = function(value) {
	return (Object.prototype.toString.call(value) === "[object Date]") && !(isNaN(value.getTime()));
}

const isString = function(value) {
	return Object.prototype.toString.call(value) === "[object String]";
}

const isNumber = function(value) {
	return Object.prototype.toString.call(value) === "[object Number]";
}

const isSymbol = function(value) {
	return Object.prototype.toString.call(value) === "[object Symbol]";
}

const isArray = function(value) {
	return Object.prototype.toString.call(value) === "[object Array]";
}

const isNullOrEmpty = function(value) {
	if(isUndefined(value)) {
		return true;
	}
	if(isNull(value)) {
		return true;
	}
	if(isBoolean(value)) {
		return false;
	}
	if(isNumber(value)) {
		return isNaN(value);
	}
	if(isObject(value)) {
		return Object.keys(value).length === 0;
	}
	if(isArray(value)) {
		return value.length === 0
	}
	return !value;
}

export default {
	isUndefined, isNull, isNullOrUndefined, isNullOrEmpty, isBoolean, isObject, 
	isFunction,  isRegExp, isDate, isString, isNumber, isSymbol, isArray
}

