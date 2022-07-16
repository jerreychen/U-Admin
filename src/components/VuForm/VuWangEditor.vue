<template>
	<div class="u-wang-editor">
		<Toolbar class="u-wang-editor_toolbar"
			:editor="editorRef" 
			:defaultConfig="toolbarConfig"
			:mode="mode" />
		<Editor class="u-wang-editor_textarea"
			:style="`height: ${height}px; overflow-y: hidden;`" 
			v-model="modelValue" 
			:defaultConfig="editorConfig"
			:mode="mode" 
			@onChange="handleChange"
			@onCreated="handleCreated" />
	</div>
</template>

<script setup>
	import '@wangeditor/editor/dist/css/style.css' // 引入 css
	import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
	
	const props = defineProps({
		height: { type: Number, default: 300 },
		placeholder: { type: String },
		modelValue: { type: String },
		mode: { type: String, default: 'default' },
		toolbarConfig: { type: Object, default: () => ({}) },
		config: { type: Object, default: () => ({}) }
	})
	
	const emits = defineEmits(['update:modelValue'])
	
	// 编辑器实例，必须用 shallowRef
	const editorRef = shallowRef()
	const editorConfig = reactive(Object.assign({ 
		placeholder: props.placeholder,
	}, props.config))
	
	const handleCreated = (editor) => {
	  editorRef.value = editor // 记录 editor 实例，重要！
	  
	  const uploadImageConfig = editor.getMenuConfig('uploadImage')
	  // 设置默认值
	  // 小于该值就插入 base64 格式（而不上传）
	  if(!uploadImageConfig.base64LimitSize) {
	  	uploadImageConfig.base64LimitSize = 5 * 1024;
	  }
	}
	
	const handleChange = (editor) => {
		emits('update:modelValue', editor.getHtml())
	}

	// 组件销毁时，也及时销毁编辑器
	onBeforeUnmount(() => {
		const editor = editorRef.value
		if (editor == null) return
		editor.destroy()
	})
</script>

<style lang="scss" scoped>
	.u-wang-editor {
		border: 1px solid var(--el-input-border-color, var(--el-border-color));
		border-radius: 4px;
		
		.u-wang-editor_toolbar {
			border-bottom: 1px solid var(--el-input-border-color, var(--el-border-color));
			border-radius: 4px 4px 0 0;
			
			:deep(.w-e-toolbar) {
				border-radius: 4px 4px 0 0;
			}
		}
		
		.u-wang-editor_textarea {
			border-radius: 0 0 4px 4px;
		}
		
		:deep(.w-e-text-placeholder) {
			top: 10px !important;
		}
	}
</style>
