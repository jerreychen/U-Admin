<template>
	<el-select class="u-form-remote-select"
	    v-model="value"
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
		loadOptions: { type: Function, required: true },
		value: { type: [String, Number, Boolean, Object] },
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
	
	const emits = defineEmits(['update:value'])
	
	const updateValue = (val) => {
	   context.emit('update:value', val) 
	}
	
	onMounted(async () => {
		const result = await props.loadOptions()
		options.value = result.data
	})
</script>

<style lang="scss" scoped>
	.u-form-remote-select {
	    width: 100%;
	}
</style>