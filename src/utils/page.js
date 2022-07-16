export default {
	getUri: (url) => {
		url = url || document.location.href;

		// 创建临时元素 
		let a = document.createElement('a');
		// 将 url 赋值给 a 元素的 href 属性
		a.href = url;

		return {
			base: url.substr(0, url.indexOf('?')),
			hash: (a.hash || '').substr(1),
			host: a.hostname,
			path: (a.pathname || '').replace(/^([^\/])/, '/$1'),
			port: parseInt(a.port || 80),
			protocol: a.protocol.replace(':', ''),
			queryString: (a.search || '').substr(1),

			/***
			 * 如果 key 为空，返回 querystring 的 key-value 数组；
			 * 如果 key 不为空，返回 key 对应的值 或者 defaultVal；
			 * @param {String} [key=null]
			 * @param {String} [defaultVal=null] 
			 * @returns {*} 返回单个key的值（String)，或者所有的 QueryString 参数 (Object)
			 */
			params: function(key, defaultVal) {
				let result = {},
					segs = this.queryString.split('&');

				for (let i = 0; i < segs.length; i++) {
					if (!segs[i]) {
						continue;
					}
					let keyValuePair = segs[i].split('=');
					result[keyValuePair[0]] = keyValuePair[1];
				}

				if (!key) {
					return result;
				}

				return result[key] || defaultVal
			}
		}
	},

	importCss: (url, elemId) => {
		return new Promise(resolve => {
			elemId = elemId || ('css_' + Math.random().toString().substr(2, 10));
			let cssElem = document.getElementById(elemId)
			if (!cssElem) {
				cssElem = document.createElement('link');
				cssElem.id = elemId;

				cssElem.rel = "stylesheet";
				cssElem.type = 'text/css';
				cssElem.href = url;
				document.head.appendChild(cssElem);
			}

			if (cssElem.readyState) {
				//IE
				cssElem.onreadystatechange = function() {
					if (cssElem.readyState !== 'loaded' && cssElem.readyState !== 'complete') {
						return;
					}

					cssElem.onreadystatechange = null;
					resolve();
				};
			} else {
				//其他浏览器
				cssElem.onload = function() {
					resolve();
				};
			}
		})
	},

	importScript: (url, elemId, crossorigin) => {
		return new Promise(resolve => {
			elemId = elemId || ('script_' + Math.random().toString().substr(2, 10));
			let jsElem = document.getElementById(elemId)
			if (!jsElem) {
				jsElem = document.createElement('script');
				jsElem.id = elemId;

				if (crossorigin) {
					jsElem.setAttribute('crossorigin', 'true');
				}

				jsElem.type = 'text/javascript';
				jsElem.src = url;
				document.body.appendChild(jsElem);
			}

			if (jsElem.readyState) {
				//IE
				jsElem.onreadystatechange = function() {
					if (jsElem.readyState !== 'loaded' && jsElem.readyState !== 'complete') {
						return;
					}

					jsElem.onreadystatechange = null;
					resolve();
				};
			} else {
				//其他浏览器
				jsElem.onload = function() {
					resolve();
				};
			}
		})
	}
}
