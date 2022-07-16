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
		
		alert(type) {
			return ElMessageBox.alert(content, title, {
			    confirmButtonText: '确定',
				draggable: true
			})
		},
		
		confirm(type) {
			return ElMessageBox.confirm(content, title, {
			    confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: type || 'info',
				draggable: true
			}).catch(() => { })
		},
		
		prompt(type, pattern) {
			return ElMessageBox.prompt(content, title, {
			    confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputPattern: pattern || /.+/,
				type: type || 'info',
				draggable: true
			})
		}
	}
}