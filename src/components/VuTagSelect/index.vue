<template>
	<div class="u-check-tag d-flex row middle wrap">
		<div class="u-check-tag_item" 
			v-for="(item, index) in tagItems" :key="index">
			<el-check-tag :checked="item.checked" @change="onTagChange(item)">
				<span>{{item[labelKey]}}</span>
				<el-icon :size="10" v-if="item.checked"><Check /></el-icon>
			</el-check-tag>
		</div>
		<div class="add-tag-wrapper" v-if="addable">
			<el-input
				v-if="inputVisible"
				style="width: 140px"
				ref="inputRef"
				v-model="inputValue"
				size="small"
				@keyup.enter="handleInputConfirm"
				@blur="handleInputConfirm">
			</el-input>
			<el-button v-else size="small" type="primary" plain :underline="false" @click="showInput">+ 新增</el-button>
		</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		items: { type: Array, default: () => ([]) },
		modelValue: { type: Array, default: () => ([]) },
		valueKey: { type: String, default: 'value' },
		labelKey: { type: String, default: 'label' },
		addable: { type: Boolean, default: false }
	})
	
	const emits = defineEmits(['update:modelValue', 'create'])
	
	const inputRef = ref()
	
	const tagItems = ref(props.items)
	const valueRef = ref(props.modelValue)
	
	const inputVisible = ref(false)
	const inputValue = ref('')
	
	
	// 监听 items，初始化数据
	watch(() => props.items, (items) => {
		tagItems.value.empty()
		items.forEach((item, index) => {
			const tag = { }
			tag[props.valueKey] = item[props.valueKey]
			tag[props.labelKey] = item[props.labelKey]
			tagItems.value.push(tag)
		})
	})
	
	watch(() => props.modelValue, (val) => {
		tagItems.value.forEach(tag => {
			tag.checked = val.indexOf(tag[props.valueKey]) >= 0
		})
	})
	
	const onTagChange = (tag) => {
		tag.checked = !tag.checked
		valueRef.value = tagItems.value.filter(item => {
			return item.checked
		}).map(item => {
			return item[props.valueKey]
		})
		emits('update:modelValue', valueRef.value)
	}
	
	const showInput = () => {
		inputVisible.value = true
		nextTick(() => {
			inputRef.value.input.focus()
		})
	}
	
	const handleInputConfirm = () => {
		if (inputValue.value) {
			emits('create', inputValue.value)
		}
		inputVisible.value = false
		inputValue.value = ''
	}
</script>

<style lang="scss" scoped>
	.u-check-tag { 
		width: 100%;
		
		.u-check-tag_item {
			flex-grow: 0;
			flex-shrink: 0;
			margin-bottom: .5rem;
			margin-left: .5rem;
			margin-right: .5rem;
		}
		
		.add-tag-wrapper {
			margin-bottom: .5rem;
		}
	}
</style>