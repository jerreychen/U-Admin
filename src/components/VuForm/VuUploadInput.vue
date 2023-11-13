<template>
	<div class="u-upload-input w-100">
		<el-input v-model="filePath" @change="handleInputChange">
			<template #append>
				<el-upload 
					:action="actionUrl" 
					:limit="1"
					:name="name" 
					:accept="accept"
					list-type="text" 
					:show-file-list="false" 
					:on-success="handleOnSuccess"
					v-model:file-list="fileList"
					:headers="actionHeaders"
					:auto-upload="autoUpload">
					{{label}}
				</el-upload>
			</template>
		</el-input>
	</div>
</template>

<script setup>
	import message from '@/utils/message.js'
	import { getApiPath } from '@/utils/common.js'
	
	const store = useStore()
	
	const fileUpload = ref()
	
	const props = defineProps({
		modelValue: { type: String },
		label: { type: String, default: '选择' },
		action: { type: String },
		accept: { type: String },
		autoUpload: { type: Boolean, default: true },
		name: { type: String, default: 'file' },
		headers: { type: Object, default: () => ({ })},
		map: { type: Object, default: () => ({ }) },
	})
	
	const emits = defineEmits(['update:modelValue'])
	
	const filePath = ref(props.modelValue)
	
	watch(() => props.modelValue, v => {
		filePath.value = v
	})
	
	const handleInputChange = (v) => {
		emits('update:modelValue', v)
	}
	
	const fileList = ref([])
	
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
	
	const actionHeaders = Object.assign({
		'USER-TOKEN': store.getters.token
	}, props.headers)
	
	const resMap = Object.assign({ 
		code: 'code', 
		data: 'data', 
		message: 'msg'
	}, props.map)
	
	const handleOnSuccess = (res, file, files) => {
		const { name, uid } = file
	
		if(res[resMap['code']] === 200) {
			let url = res[resMap['data']]
			
			filePath.value = url.startsWith('http') ? url : `${import.meta.env.VITE_APP_API_HOST}${url}` 
			
			emits('update:modelValue', filePath.value)
			return
		}
		
		message('错误提示', res[resMap['message']] || props.errorMessage).notify('error')
	}
	
	defineExpose({
		upload() {
			fileUpload.value.submit()
		}
	})
</script>

<style>
</style>