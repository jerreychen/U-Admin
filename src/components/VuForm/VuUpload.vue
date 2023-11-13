<template>
<div class="u-upload">
    <el-upload ref="fileUpload"
		:class="{
			'upload-limited': fileList.length >= limit
		}"
        :action="actionUrl"
		:multiple="multiple"
		:method="method"
		:data="data"
		:name="name"
		:drag="drag"
		:accept="accept"
		:with-credentials="withCredentials"
        :list-type="drag ? undefined : listType"
		:limit="limit"
		:headers="actionHeaders"
		:disabled="disabled"
		:auto-upload="autoUpload"
        :on-preview="handlePictureCardPreview"
		:on-success="handleOnSuccess"
		:on-remove="handleOnRemove"
		:on-error="handleOnError"
		:on-exceed="handleOnExceed"
		:before-upload="handleBeforeUpload"
        v-model:file-list="fileList">
		<template v-if="drag">
			<el-icon class="el-icon--upload"><upload-filled /></el-icon>
			<div class="el-upload__text">
					拖动文件到这或<em>点击选择文件</em>
			</div>
		</template>
		<template v-else>
			<template v-if="listType === 'picture-card'">
				<el-icon><Plus /></el-icon>
			</template>
			<template v-else>
				<el-button type="primary">点击上传文件</el-button>
			</template>
		</template>
		<template #tip v-if="showTips && (uploadTips || tips)">
			<div class="el-upload__tip">{{tips}}{{uploadTips}}</div>
		</template>
    </el-upload>
    
    <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" style="max-width: 100%;" />
    </el-dialog>
</div>
</template>

<script setup>
	import message from '@/utils/message.js'
	
	const store = useStore()
	
	const fileUpload = ref()
	
	const props = defineProps({
		action: { type: String, required: true },
		autoUpload: { type: Boolean, default: true },
		headers: { type: Object, default: () => ({ })},
		modelValue: { type: Array, default: () => ([]) },
		name: { type: String, default: 'file' },
		withCredentials: { type: Boolean, default: false },
		drag: { type: Boolean, default: false },
		method: { type: String, default: 'post' },
		multiple: { type: Boolean, default: false },
		tips: { type: String },
		accept: { type: String },
		fileSize: { type: Number },
		listType: { type: String, default: 'picture-card' },
		disabled: { type: Boolean, default: false },
		limit: { type: Number },
		data: { type: Object, default: ()=>({ }) },
		map: { type: Object, default: () => ({ }) },
		previewable: { type: Boolean, default: true },
		errorMessage: { type: String, default: '文件上传失败！' },
		onUploaded: { type: Function },
		showTips: { type: Boolean, default: true }
	})
	
	const emits = defineEmits(['update:modelValue', 'remove'])
	const fileList = ref(props.modelValue || [])
	const actionHeaders = Object.assign({
		'USER-TOKEN': store.getters.token
	}, props.headers)
	
	const resMap = Object.assign({ 
		code: 'code', 
		data: 'data', 
		message: 'msg'
	}, props.map)
	
	const actionUrl = computed(() => {
		let url = props.action
		
		if(!url.startsWith('/')) {
			url = '/' + url;
		}
		
		if(!url.startsWith(import.meta.env.VITE_APP_BASE_API)) {
			url = `${import.meta.env.VITE_APP_BASE_API}${url}`;
		}
		
		return url;
	})
	
	const uploadTips = ref(computed(() => {
		let str = ''
		if(props.accept) {
			str += `允许上传文件类型（${props.accept}）`
		}
		if(props.limit) {
			str += `最多上传${props.limit}个 `
		}
		if(props.fileSize) {
			str += `支持单个文件最大${props.fileSize}M`
		}
		return str
	}))
	
	const dialogVisible = ref(false)
	const dialogImageUrl = ref('')
	
	// 监听modelValue变化
	watch(() => props.modelValue, (v) => {
		fileList.value = v
	}, { deep: true })
	
	const handlePictureCardPreview = (file) => {
		if(!props.previewable) {
			return 
		}
		dialogImageUrl.value = file.url
		dialogVisible.value = true
	}
	
	const handleOnSuccess = (res, file, files) => {
		const { name, uid } = file
	
		if(props.onUploaded) {
			props.onUploaded.call(fileUpload.value, res, file, files)
			return
		}
	
		if(res[resMap['code']] === 200) {
			let url = res[resMap['data']]
			const index = fileList.value.findIndex(item=> {
				return item.uid === file.uid
			})
			
			if(index < 0) {
				return
			}
			
			fileList.value.splice(index, 1, {
				name, uid, 
				url: url.startsWith('http') ? url : `${import.meta.env.VITE_APP_API_HOST}${url}` 
			})
			emits('update:modelValue', fileList.value)
			return
		}
		
		message('错误提示', res[resMap['message']] || props.errorMessage).notify('error')
		fileUpload.value.handleRemove(file) 
		emits('update:modelValue', fileList.value)
	}
	
	const handleOnRemove = (file) => {
		const index = fileList.value.findIndex(item => {
			return item.uid === file.uid
		})
		
		if(index < 0) {
			return
		}
		
		fileList.value.splice(index, 1);
		emits('remove', file);
	}
	
	const handleOnExceed = () => {
		message('错误提示', `上传文件数量不能超过${props.limit}个！`).notify('error')
	}
	
	const handleOnError = (file) => {
		message('错误提示', props.errorMessage).notify('error')
	}
	
	const handleBeforeUpload = (rawFile) => {
		const { size, name } = rawFile
		// fileSize 单位M（1024 * 1024）
		const { fileSize } = props
		// 如果文件太大，取消上传
		if(size > fileSize * 1024 * 1024) {
			message('错误提示', `文件大小超出，上传失败：${name}`).notify('error')
			return false 
		}
		return true
	}
	
	defineExpose({
		upload() {
			fileUpload.value.submit()
		}
	})
</script>

<style lang="scss" scoped>
	.u-upload {
		width: 100%;
		
		.upload-limited {
			:deep(.el-upload) {
				display: none;
			}
		}
	}
</style>