<template>
	<div class="html-editor">
		<div ref="htmlEditorRef"></div>
	</div>
</template>

<script setup>

	const htmlEditorRef = ref(null)
	
	const emits = defineEmits(['update:modelValue'])
	
	const props = defineProps({
		height: { type: Number, default: 300 },
		placeholder: { type: String },
		modelValue: { type: String }
	})
	
	watch(() => props.modelValue, (v) => {
		if(v) {
			return 
		}
		$(document).ready(()=> {
			$(htmlEditorRef.value).summernote('reset')
		})
	})
	
	onMounted(()=>{
		$(document).ready(()=> {
			$(htmlEditorRef.value).summernote({
				lang: 'zh-CN',
				placeholder: props.placeholder,
				height: props.height,
				callbacks: {
				    onChange: function(contents) {
				       emits('update:modelValue', contents)
				    }
				}
			})
		})
	})
</script>

<style lang="scss" scoped>
	.html-editor {
		width: 100%;
		
		:deep(.note-editable) {
			padding: 0 .5rem !important;
			
			p {
				margin: .5rem 0;
			}
		}
	}
</style>