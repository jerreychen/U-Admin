import Crypto from 'crypto-js'

const md5_encrypt = (str) => {
	return Crypto.MD5(str).toString();
}

const defaultAESKey = '1234567890'

const aes_encrypt = (str, key) => {
	key = key || defaultAESKey
	let keyStr = CryptoJS.enc.Utf8.parse(key)
	let sourceStr = CryptoJS.enc.Utf8.parse(str)
	let encrypted = CryptoJS.AES.encrypt(sourceStr, keyStr, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	})
	return encrypted.toString()
}

const aes_decrypt = (encStr, key) => {
	key = key || defaultAESKey
	let keyStr = CryptoJS.enc.Utf8.parse(key)
	let decrypted = CryptoJS.AES.decrypt(encStr, keyStr, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	})
	return CryptoJS.enc.Utf8.stringify(decrypted).toString()
}

export const cryptoPwd = (pwd) => { 
	return md5_encrypt(md5_encrypt(pwd))
}
