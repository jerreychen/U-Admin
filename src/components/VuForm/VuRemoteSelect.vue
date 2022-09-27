<template>
	<el-select class="u-form-remote-select"
	    :model-value="modelValue"
	    :clearable="clearable" 
	    :size="size"
	    :placeholder="placeholder"
	    :multiple="multiple"
	    :multiple-limit="multipleLimit"
	    :disabled="disabled">
	    <el-option
	        v-for="(item, index) in options"
	        :key="`u-form-select-option-${index}`"
	        :label="isObject(item) ? item[labelKey] : item"
	        :value="isObject(item) ? item[valueKey] : index" />
	</el-select>
</template>

<script setup>
	const props = defineProps({
		query: { type: Function, required: true },
		modelValue: { type: [String, Number, Boolean, Object] },
		valueKey: { type: String, default: 'value' }, // 和 el-select 原 value-key 不一样
		labelKey: { type: String, default: 'label' },
		size: { type: String, default: 'default' },
		placeholder: { type: String },
		clearable: { type: Boolean, default: true },
		disabled: { type: Boolean, default: false },
		multiple: { type: Boolean, default: false },
		multipleLimit: { type: Number, default: 0 },
	})
	
	const options = ref()

	const emits = defineEmits(['update:modelValue'])
	
	const updateValue = (val) => {
	   context.emit('update:modelValue', val) 
	}
	
	onMounted(() => {
		const funcRes = props.query.call()
		if(funcRes instanceof Promise) {
			funcRes.then(dataList => {
				options.value = dataList
			})
		}
		else {
			options.value = funcRes
		}
	})
</script>

<style lang="scss" scoped>
	.u-form-remote-select {
	    width: 100%;
	}
</style>