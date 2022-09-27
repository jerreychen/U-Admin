export default function(...str) {
	let title = ''
	let	content = ''
	
	if(str.length == 1) {	// Only one param
		content = str[0]
	}
	else if(str.length >= 2) {		// More then one param
		title = str[0]
		content = str[1]
	}
	
	return {
		notify(type) {
			return ElNotification({
				type: type || 'info', 
				title: `${title}`, 
				message: `${content}`
			})
		},
		
		show(type) {
			return ElMessage({
			    showClose: true,
			    message: `${content}`,
			    type: type || 'info',
			  })
		},
		
		alert(type, opts) {
			return ElMessageBox.alert(content, title, Object.assign({
			    confirmButtonText: '确定',
				draggable: true
			}, opts || {}))
		},
		
		confirm(type, opts) {
			return ElMessageBox.confirm(content, title, Object.assign({
			    confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: type || 'info',
				draggable: true
			}, opts || {})).catch(() => { })
		},
		
		prompt(type, opts) {
			return ElMessageBox.prompt(content, title, Object.assign({
			    confirmButtonText: '确定',
				cancelButtonText: '取消',
				draggable: true
			}, opts || {})).catch(() => { })
		}
	}
}