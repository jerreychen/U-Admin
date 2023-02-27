<template>
	<el-row class="u-number-range">
		<el-col :span="11">
			<el-input-number
				:placeholder="startPlaceholder"
				:controls="false"
				:size="size"
				:min="min"
				:max="maxValue"
				:disabled="disabled"
				@blur="updateMinValue"
				v-model="minValue"></el-input-number>
		</el-col>
		<el-col :span="2" align="center">{{separator}}</el-col>
		<el-col :span="11">
			<el-input-number
				:placeholder="endPlaceholder"
				:controls="false"
				:size="size"
				:min="minValue"
				:max="max"
				:disabled="disabled"
				@blur="updateMaxValue"
				v-model="maxValue"></el-input-number>
		</el-col>
	</el-row>
</template>

<script setup>
import { watch } from 'vue';
	const props = defineProps({
		size: { type: String, default: 'default' },
		disabled: { type: Boolean, default: false },
		startPlaceholder: { type: String },
		endPlaceholder: { type: String },
		separator: { type: String, default: '-' },
		min: { type: Number, default: Math.minValue },
		max: { type: Number, default: Math.maxValue },
		modelValue: { type: Object, default: () => ({}) }
	})
	
	const emits = defineEmits(['update:modelValue'])
	
	const minValue = ref(props.modelValue.min)
	const maxValue = ref(props.modelValue.max)
	
	watch(()=>props.modelValue, (v) => {
		minValue.value = v.min
		maxValue.value = v.max
	}, { deep: true })
	
	const updateMinValue = () => {
		emits('update:modelValue', { min: minValue.value, max: maxValue.value })
	}
	
	const updateMaxValue = () => {
		emits('update:modelValue', { min: minValue.value, max: maxValue.value })
	}
	
</script>

<style scoped lang="scss">
	.u-number-range {
		width: 250px;
		
		:deep(.el-input-number) {
			width: 100%;
		}
	}
</style>