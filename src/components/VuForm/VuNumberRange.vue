<template>
	<el-row class="u-number-range w-100">
		<el-col :span="11">
			<el-input-number
				:placeholder="startPlaceholder"
				:controls="false"
				:size="size"
				:min="min"
				:max="maxValue"
				:disabled="disabled"
				@input="updateMinValue"
				:model-value="minValue"></el-input-number>
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
				@input="updateMaxValue"
				:model-value="maxValue"></el-input-number>
		</el-col>
	</el-row>
</template>

<script>
	export default {
		props: {
			size: { type: String, default: 'default' },
			disabled: { type: Boolean, default: false },
			startPlaceholder: { type: String },
			endPlaceholder: { type: String },
			separator: { type: String, default: '-' },
			min: { type: Number, default: Math.minValue },
			max: { type: Number, default: Math.maxValue },
			modelValue: { type: Object, default: () => ({}) }
		},
		
		emits: ['update:modelValue'],
		
		setup(props, context) {
			const { modelValue } = toRefs(props)
			
			const minValue = ref(computed(() => modelValue.value.min))
			const maxValue = ref(computed(() => modelValue.value.max))
			
			const updateMinValue = (v) => {
				modelValue.value.min = v
				context.emit('update:modelValue', modelValue.value)
			}
			const updateMaxValue = (v) => {
				modelValue.value.max = v
				context.emit('update:modelValue', modelValue.value)
			}
				
			return {
				minValue, maxValue,
				updateMinValue, updateMaxValue
			}
		}
	}
</script>

<style scoped lang="scss">
	.u-number-range {
		:deep(.el-input-number) {
			width: 100%;
		}
	}
</style>