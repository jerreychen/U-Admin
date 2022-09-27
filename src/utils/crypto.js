import Crypto from 'crypto-js'

export const useMD5 = () => {

	const md5_encrypt = (str) => {
		return Crypto.MD5(str).toString();
	}

	return {
		encrypt: (pwd, times) => {
			times = times || 1;	// 默认加密次数
			
			for(let i = 0; i < times; i++) {
				pwd = md5_encrypt(pwd);
			}
			
			return pwd;
		}
	}
}

const defaultAESKey = '1234567890'

export const useAES = (key) => {
	key = key || defaultAESKey
	
	return {
		encrypt: (str) => {
			let keyStr = CryptoJS.enc.Utf8.parse(key)
			let sourceStr = CryptoJS.enc.Utf8.parse(str)
			let encrypted = CryptoJS.AES.encrypt(sourceStr, keyStr, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7
			})
			return encrypted.toString()
		},
		
		decrypt: (encStr) => {
			let keyStr = CryptoJS.enc.Utf8.parse(key)
			let decrypted = CryptoJS.AES.decrypt(encStr, keyStr, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7
			})
			return CryptoJS.enc.Utf8.stringify(decrypted).toString()
		}
	}
}