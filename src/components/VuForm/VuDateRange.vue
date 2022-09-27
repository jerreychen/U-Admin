<template>
	<div class="u-date-range d-flex row middle">
		<el-date-picker
			v-model="startDate"
			:size="size"
			type="date"
			:disabled-date="disabledEndDate"
			:format="format"
			:value-format="valueFormat"
			:disabled="disabled"
			:clearable="clearable"
			:placeholder="startPlaceholder"
			class="date-field"></el-date-picker>
		<el-date-picker
			v-model="endDate"
			:size="size"
			type="date"
			:disabled-date="disabledStartDate"
			:format="format"
			:value-format="valueFormat"
			:disabled="disabled"
			:clearable="clearable"
			:placeholder="endPlaceholder"
			class="date-field"></el-date-picker>
		<div class="separator">{{rangeSeparator}}</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		modelValue: { type: Array, default: () => ([]) },
		rangeSeparator: { type: String, default: '-' },
		size: { type: String, default: 'default' },
		startPlaceholder: { type: String },
		endPlaceholder: { type: String },
		clearable: { type: Boolean, default: true },
		disabled: { type: Boolean, default: false },
		format: { type: String, default: 'YYYY-MM-DD' },
		valueFormat: { type: String, default: 'YYYY-MM-DD' }
	})
	
	const emits = defineEmits(['update:modelValue'])
	
	const startDate = ref()
	const endDate = ref()
	
	watch(() => props.modelValue, (v) => {
		startDate.value = v[0] || '';
		endDate.value = v[1] || '';
	})
	
	const disabledStartDate = (date) => {
		if(!date || !startDate.value) {
			return false;
		}
		
		return date.getTime() < new Date(startDate.value).getTime()
	}
	
	const disabledEndDate = (date) => {
		if(!date || !endDate.value) {
			return false;
		}
		return date.getTime() > new Date(endDate.value).getTime()
	}
	
	watch(startDate, (v) => {
		emits('update:modelValue', [v, endDate.value])
	})
	
	watch(endDate, (v) => {
		emits('update:modelValue', [startDate.value, v])
	})
</script>

<style lang="scss" scoped>
	.u-date-range  {
		position: relative;
		margin-right: - 1.75rem;
		
		.separator {
			position: absolute;
			top: 0;
			right: 50%;
			text-align: center;
			width: 1.75rem;
		}
	}
</style>