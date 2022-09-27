import types from '@/utils/types.js';

// 原生数据类型扩展
export default {
	install(app) {
		
		/**
		 * 字符串格式化相关函数扩展
		 * Copyright (c) Jerrey @ Kuakee Networks
		 * EMAIL: jerreychen@qq.com
		 * DATE: 2016-02-17
		 */
		String.prototype.isEmpty = function() {
			return this.replace(/(\s*$)/g,"") =="";
		}
		String.prototype.toNumber = function() {
			let n = Number(this) || 0;
			if(arguments.length === 0) {
				return n
			}
			switch(arguments[0]) {
				case 'x': return n.toString(16);
				case 'o': return n.toString(8);
				case 'b': return n.toString(2);
				default: return n;
			}
		}
		String.prototype.splits = function() {
			if(arguments.length === 0) {
				return this.split('');
			}
			
			let args = []
			for(let i = 0; i < arguments.length; i++) {
				args.push('\\' + arguments[i])
			}
			let needle = new RegExp('(' + args.join('|') + ')', 'g');
			return this.replace(needle, arguments[0]).split(arguments[0])
		}
		String.prototype.toDate = function(format) {
			if(!format) {
				let dt = new Date(this);
				if(!types.isDate(dt)) {
					dt = new Date(this.replace(/-/g, '/'))
				}
				return dt;
			}
			
			if(this.length !== format.length) {
				return null;
			}
			
			let year = this.substr(format.indexOf('yyyy'), 4);
			let month = this.substr(format.indexOf('mm'), 2);
			let date = this.substr(format.indexOf('dd'), 2);
			return new Date(year, Number(month) - 1, date);
		}
		String.prototype.trimRightChars = function(chars) {
			if(!chars) {
				return this.trimRight();
			}
			
			let charIndex = 0;
			let rvStrArr = this.split('').reverse()
			rvStrArr.forEach((ch, index) => {
				if(chars.indexOf(ch) < 0) {
					charIndex = index;
					return false;
				}
			})
			
			return rvStrArr.slice(charIndex).reverse().join('')
		}
		String.prototype.trimLeftChars = function(chars) {
			if(!chars) {
				return this.trimLeft();
			}
			
			
			let charIndex = 0;
			let strArr = this.split('')
			strArr.forEach((ch, index) => {
				if(chars.indexOf(ch) < 0) {
					charIndex = index;
					return false;
				}
			})
			
			return rvStr.slice(charIndex).join('')
		}
		String.prototype.capitalize = function() {
			if(this.isEmpty()) {
				return '';
			}
			
			return this[0].toUpperCase() + this.slice(1)
		}
		/**
		 * @param {Object|Array}  Arguments 
		 */
		String.prototype.format = function() {
			if (arguments.length == 0) {
				return this;
			}

			let result = this;
			// 如果参数只有一个，并且是数组或者对象
			if (arguments.length == 1 && (types.isArray(arguments[0]) || types.isObject(arguments[0]))) { 
				let data = arguments[0];
				if(Array.isArray(data)) {
					for (let i = 0; i < data.length; i++) {
						result = result.replace(new RegExp("\\{" + i + "\\}", "g"), data[i]);
					}
				}
				else {
					for (let key in data) { 
						result = result.replace(new RegExp("\\{" + key + "\\}", "g"), data[key] ?? key);
					}
				}
			}
			else {
				for (let i = 0; i < arguments.length; i++) {
					result = result.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
				}
			}

			return result;
		}
		
		/**
		 * 数字操作与处理相关函数扩展
		 * Copyright (c) Jerrey @ Kuakee Networks
		 * EMAIL: jerreychen@qq.com
		 * DATE: 2016-02-17
		 */
		Number.prototype.toFixed = function(n) {
			if(n <= 0){
				return Math.round(this).toString();
			}
			let times = Math.pow(10, n);
			let num = Math.round(this * times) / times;
			let result = num.toString();
			/* 整形数 */
			if(result.indexOf('.') < 0) {
				return [result, '0'.repeat(n)].join('.');
			}
			/* 浮点数 小数点位数不够 */
			let ln = result.substr(result.indexOf('.')+1).length;
			if(ln < n) {
				return [result, '0'.padEnd(n - ln, '0')].join('.');
			}
			return result;
		}
		Number.prototype.toPercent = function(n) {
			n = n || 0;
			return (this * 100).toFixed(n) + '%';
		}
		Number.prototype.toPermille = function(n) {
			n = n || 0;
			return (this * 1000).toFixed(n) + '‰';
		}
		/**
		 * 千分显示
		 */
		Number.prototype.toThousands = function() {
			// 根据小数点进行分割，下标0位整数部分，下标1为小数部分
		    let arrNum = this.toString().split('.');
			
		    let numStr = arrNum[0],
                result = '';
				 
		    while (numStr.length > 3) {
		        result = ',' + numStr.slice(-3) + result;
                numStr = numStr.slice(0, numStr.length - 3);
		    }

			if(arrNum[1]) {
				return [numStr + result, arrNum[1] ||''].join('.');
			}
			return numStr + result
		}
		/**
		 * 数字转中文，最大值限制 Number.MAX_SAFE_INTEGER
		 * @param {Boolean} isTraditional 是否繁体，默认：false
		 */
		Number.prototype.toChinese = function(isTraditional) {
			// 最大值限制
			let num = Math.min(this, Number.MAX_SAFE_INTEGER)
			
			let chGroup = !!isTraditional ? ['億', '萬'] : ['亿', '万']
			let chn = !!isTraditional ? ['', '拾', '佰', '仟'] : ['', '十', '百', '千']
			let numStr = !!isTraditional ? '零壹贰叁肆伍陆柒捌玖' : '〇一二三四五六七八九'
			
			// 分拆小数点
			let arrStr = num.toString().split('.');
			
			// 小数点前
			let arrTemp = []
			let dStr = arrStr[0].split('').map(n => {
				return numStr[parseInt(n)]
			})
			let dStrLen = dStr.length;
			dStr.forEach((n, i) => {
				let gi = (dStrLen - i - 1) / 4;
				let ci = (dStrLen - i - 1) % 4;
				arrTemp.push(n, (n === '零') ? '' : chn[ci], gi === 0 ? '' : (chGroup[gi % 2] || ''))
			})
			 
			// 如果有多个零相邻，替换剩一个；如果零后面跟着万、亿单位去掉；末尾零去掉
			tmpStr = arrTemp.join('').replace(/[零]{2,}/g, '零').replace(/零([万亿萬億])/g, '$1')
			if(tmpStr[tmpStr.length - 1] === '零') {
				tmpStr = tmpStr.slice(0, tmpStr.length - 1)
			}
			
			// 小数点后
			let lStr = arrStr[1] && arrStr[1].split('').map(n => {
				return numStr[parseInt(n)]
			}).join('') || '';
			
			if(!lStr) {
				return tmpStr
			}
			return [tmpStr, lStr].join(!!isTraditional ? '點' : '点')
		}
		/**
		 * @param {String} strFormat  只能由符号'#','0','.'三个组成: #和0可表示数字，0时位数不足补零
		 */
		Number.prototype.format = function(strFormat) {
			let m = strFormat.match(/[#0]+(\.[#0]+)?/)
			// 格式不正确
			if(!m) {
				return this.toString()
			}
			
			let arrNumStr = this.toString().split('.')
			let it = arrNumStr[0]
			let fr = arrNumStr[1] || ''
			
			let arrFormat = m[0].split('.')
			let itFormat = arrFormat[0]
			let frFormat = arrFormat[1] || ''
		
			it = (it.length > itFormat.length) 
				? it.substr(it.length - itFormat.length)
				: it.padStart(itFormat.length, '0');
			
			let itStr = itFormat.replace(/[#0]/g, (str, index) => {
				if(it[index] === '0') {
					return itFormat.substr(0, index + 1).indexOf('0') >= 0 ? '0' : ''
				}
				return it[index]
			})
			
			if(frFormat) {
				fr = fr.length > frFormat.length
					? fr.substr(0, frFormat.length)
					: fr.padEnd(frFormat.length, '0');
					
				let frStr = frFormat.replace(/[#0]/g, (str, index) => {
					if(fr[index] === '0') {
						return frFormat.substr(index).indexOf('0') >= 0 ? '0' : ''
					}
					return fr[index]
				})
				
				return [itStr, frStr].join('.')
			}
			
			return itStr
		}
		/**
		 * 数字是否在区间范围内
		 * @param {Number} minValue  最小值
		 * @param {Number} maxValue  最大值
		 * @param {Object} options 是否包含最小或者最大 { min: false, max: false }
		 */
		Number.prototype.between = function(minValue, maxValue, options) {
			const { min = false, max = false } = options || {}
			if(min && max) {
				return this >= minValue && this <= maxValue
			}
			
			if(min) {
				return this >= minValue && this < maxValue
			}
			
			if(max) {
				return this > minValue && this <= maxValue
			}
			
			return this > minValue && this < maxValue
		}
		
		/**
		 * 日期操作与处理相关函数扩展
		 * Copyright (c) Jerrey @ Kuakee Networks
		 * EMAIL: jerreychen@qq.com
		 * DATE: 2016-02-17
		 */
		Date.prototype.getMonthStart = function() {
			return new Date(this.getFullYear(), this.getMonth(), 1);
		}
		Date.prototype.getMonthEnd = function() {
			return new Date(this.getFullYear(), this.getMonth() + 1, 1).addDays(-1);
		}
		Date.prototype.addSeconds = function(secs) {
			secs = parseInt(secs) || 0;
			return new Date(this.getTime() + secs * 1000);
		}
		Date.prototype.addMinutes = function(mins) {
			mins = parseInt(mins) || 0;
			return this.addSeconds(mins * 60);
		}
		Date.prototype.addHours = function(hours) {
			hours = parseInt(hours) || 0;
			return this.addMinutes(hours * 60);
		}
		Date.prototype.addDays = function(days) {
			days = parseInt(days) || 0;
			return this.addHours(days * 24);
		}
		Date.prototype.addMonths = function(mons) {
			return new Date(this.getFullYear(), this.getMonth() + mons + 1, this.getDate())
		}
		Date.prototype.addYears = function(years) {
			years = parseInt(years) || 0;
			return this.addMonths(years * 12);
		}
		/**
		 * 日期相减，返回值单位（秒）
		 * @param {Date} date
		 */
		Date.prototype.sub = function(date) {
			if(!types.isDate(date)) {
				return 0;
			}
			
			return (this.getTime() - date.getTime()) / 1000;
		}
		Date.prototype.isLeapYear = function() {
			return ((this.getFullYear() % 4 == 0)
				&& ((this.getFullYear() % 100 != 0) || (this.getFullYear() % 400 == 0)));
		}
		/**
		 * 时间是否在区间内？
		 * @param {Date} startDate
		 * @param {Date} endDate
		 * @param {Object} options 是否包含最小或者最大 { min: false, max: false }
		 */
		Date.prototype.between = function(startDate, endDate, options) {
			if(!(types.isDate(startDate) && types.isDate(endDate))) {
				return false
			}
			
			return this.getTime().between(startDate.getTime(), endDate.getTime(), options)
		}
		
		/**
		 * 时间已过？
		 */
		Date.prototype.isPassed = function() {
			return this.getTime() < Date.now()
		}
		
		/**
		 * 日期显示美化函数
		 */
		Date.prototype.beautify = function() {
			let ts = Math.round(this.getTime() / 1000); // 日期的时间戳（秒）
			let dts = Math.round((new Date()).getTime() / 1000); // 当前时间戳（秒）

			let stamp = dts - ts;
			if (stamp < 0) {
				return this.format('Y年M月D日 H:I');
			} // 当期日前之后，显示格式化

			if (stamp < 60) {
				return '刚刚';
			}

			let mins = Math.floor(stamp / 60);
			if (mins < 60) {
				return mins + '分钟前';
			}

			let hrs = Math.floor(stamp / 3600);
			if (hrs < 24) {
				return hrs + '小时前';
			}
			if (hrs < 48) { 
				return '昨天';
			}
			if( hrs < 72) { 
				return '前天';
			}

			let days = Math.floor(stamp / 86400);
			if(days < 30) { 
				return days + '天前';
			}
			if(days < 60) { 
				return '一个月前';
			}

			return this.format('Y年M月D日 H:I');
		}
		/**
		 * 日期格式化函数
		 * @param {String} strFormat : Y, M/m/N/n, D/d, H/h/O/o, I/i, S/s, W/w/Z/z (年，月，日，时，分，秒，星期)
		 */
		Date.prototype.format = function(strFormat) {
		  strFormat = strFormat || 'Y-M-D H:I:S';

		  let weekDays = ['日', '一', '二', '三', '四', '五', '六'];
		  let weekDaysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		  let months = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
		  let monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

		  let sp = function(n, p) {
			n = n.toString()
			return p ? (n[1] ? n : `0${n}`) : n;
		  }

		  let result;
		  let rgx = /\b(Y|y|M|m|P|p|D|d|H|h|I|i|S|s|W|w|N|n|O|o|T|t|Z|z)\b/;
		  while(result = rgx.exec(strFormat)) {
			let ptn = result[0];
			switch(ptn) {
			  case 'Y': case 'y':
				strFormat = strFormat.replace(ptn, this.getFullYear());
				break;
			  case 'M': case 'm':
				strFormat = strFormat.replace(ptn, sp(this.getMonth() + 1, ptn == 'M'));
				break;
			  case 'P': case 'p':
				strFormat = strFormat.replace(ptn, months[this.getMonth()]);
				break;
			  case 'N': case 'n':
				let mon = (ptn == 'N') ? monthsEn[this.getMonth()] : monthsEn[this.getMonth()].substr(0, 3) + '.';
				strFormat = strFormat.replace(ptn, mon);
				break;
			  case 'D': case 'd':
				strFormat = strFormat.replace(ptn, sp(this.getDate(), ptn == 'D'));
				break;
			  case 'H': case 'h':
				strFormat = strFormat.replace(ptn, sp(this.getHours(), ptn == 'H'));
				break;
			  case 'O': case 'o':
				strFormat = strFormat.replace(ptn, sp(this.getHours() % 12, ptn == 'O'));
				break;
			  case 'I': case 'i':
				strFormat = strFormat.replace(ptn, sp(this.getMinutes(), ptn == 'I'));
				break;
			  case 'S': case 's':
				strFormat = strFormat.replace(ptn, sp(this.getSeconds(), ptn == 'S'));
				break;
			  case 'Z': case 'z':
				strFormat = strFormat.replace(ptn, weekDays[this.getDay()]);
				break;
			  case 'W': case 'w':
				let idx = this.getDay();
				let weekday_en = (ptn == 'W') ? weekDaysEn[idx] : weekDaysEn[idx].substr(0, (idx == 1 || idx == 3) ? 4 : 3);
				strFormat = strFormat.replace(ptn, weekday_en);
				break;
			  case 'T': case 't':
				let sfx = this.getHours() > 12 ? 'pm' : 'am';
				let suffix = (ptn == 'T') ? sfx.toUpperCase() : sfx.toLowerCase();
				strFormat = strFormat.replace(ptn, suffix);
				break;
			}
		  }
		  return strFormat;
		}
		
		/**
		 * 数组的操作与处理相关函数扩展
		 * Copyright (c) Jerrey @ Kuakee Networks
		 * EMAIL: jerreychen@qq.com
		 * DATE: 2016-02-17
		 */
		Array.prototype.removeAt = function(index) {
			return this.splice(index, 1)
		}
        Array.prototype.empty = function() {
            this.length = 0
        }
		Array.prototype.unique = function() {
		  return Array.from(new Set(this))
		}
		Array.prototype.insert = function(item, index) {
			this.splice(index || 0, 0, item)
		}
		Array.prototype.findByKeyValue = function(key, val) {
			return this.find(item => {
				return item[key] && item[key] === val
			})
		}
	}
}