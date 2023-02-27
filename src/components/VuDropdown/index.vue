<template>
	<el-dropdown class="u-dropdown"  @command="handleDropdownClick">
		<span class="el-dropdown-link d-flex row middle">
			{{currentLabel}}<el-icon class="el-icon--right"><arrow-down /></el-icon>
		</span>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item 
					:command="item[valueKey]" 
					v-for="item in data">
					{{item[labelKey]}}
				</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown> 
</template>

<script setup>
	const props = defineProps({
		data: { type: Array, default: () => ([]) },
		modelValue: { type: [String, Number] },
		labelKey: { type: String, default: 'label' },
		valueKey: { type: String, default: 'value' }
	})
	
	const emits = defineEmits(['change', 'update:modelValue'])
	
	const currentValue = ref(props.modelValue)
	const currentLabel = computed(() => {
		const { data, labelKey, valueKey } = props
		const cur = data.find(item => {
			return item[valueKey] === currentValue.value
		})
		return cur ? cur[labelKey] : ''
	})
	
	const handleDropdownClick = (e) => {
		const val = currentValue.value
		emits('change', e, val)
		currentValue.value = e
		emits('update:modelValue', e)
	}
</script>

<style lang="scss" scoped>
	
</style>