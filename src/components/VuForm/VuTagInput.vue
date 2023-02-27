<template>
	<div class="u-tag-list d-flex row bottom">
		<div class="el-input__wrapper d-flex row left">
			<el-tag class="margin-right-2"
				v-for="(item, index) in tagList"
				:key="index"
				:type="type"
				:effect="effect"
				:size="size"
				:closable="true"
				@close="handleTagClose(index)"
				:round="rounded">
				{{ item[labelKey] }}
			</el-tag>
		<template v-if="addable">
			<el-input
			    v-if="inputVisible"
				style="width: 140px"
			    ref="inputRef"
			    v-model="inputValue"
			    :size="size"
			    @keyup.enter="handleInputConfirm"
			    @blur="handleInputConfirm">
			</el-input>
			<el-link v-else size="small" class="add-tag-button" :underline="false" @click="showInput">+新增{{name}}</el-link>
		</template>
		
		</div>
	</div>
</template>

<script setup>
	const inputRef = ref()
	
	const props =  defineProps({
		name: { type: String, default: '标签' },
		modelValue: { type: Array, default: () => ([]) },
		labelKey: { type: String, default: 'label' },
		valueKey: { type: String, default: 'value' },
		type: { type: String, default: '' },
		effect: { type: String, default: 'light' },
		size: { type: String, defualt: 'default' },
		addable: { type: Boolean, default: false },
		create: { type: Function, default: (() => {}) },
		rounded: { type: Boolean, default: false }
	})
	
	const tagList = ref(props.modelValue)
	const emits = defineEmits(['update:modelValue', 'create'])
	
	const inputVisible = ref(false)
	const inputValue = ref('')
	
	watch(() => props.modelValue, v => {
		tagList.value = v || []
	})
	
	const showInput = () => {
		inputVisible.value = true
		nextTick(() => {
			inputRef.value.input.focus()
		})
	}
	
	const handleTagClose = (index) => {
		tagList.value.splice(index, 1)
		emits('update:modelValue', tagList.value)
	}
	
	const handleInputConfirm = () => {
		if (inputValue.value) {
			props.create.call(inputRef, inputValue.value)
			
			const item = {}
			item[props.labelKey] = inputValue.value
			item[props.valueKey] = 0 // 新增
			
		    tagList.value.push(item)
			emits('update:modelValue', tagList.value)
		}
		inputVisible.value = false
		inputValue.value = ''
	}
</script>

<style lang="scss" scoped>
	.u-tag-list {
		flex: 1;
		
		.el-input__wrapper {
			flex-wrap: wrap;
			line-height: 30px;
			min-height: 30px;
			width: 100%;
			
			.el-tag {
				margin: 3px 0;
			}
			
			:deep(.el-input__wrapper) {
				line-height: 26px;
				height: 26px;
				margin-left: -8px;
			}
			
			.add-tag-button {
				color: #999;
				font-size: 12px;
			}
		}
	}
</style>