<template>
	<div class="w-100">
		<el-cascader 
			class="w-100"
			:props="cascaderProps" 
			v-model="addrCity"
			:placeholder="config.placeholder || '请选择上级城市'" 
			:size="config.size || 'default'"
			:clearable="config.clearable ?? true"
			:filterable="config.filterable"
			:filter-method="config.filterMethod" 
			:separator="config.separator"
			:debounce="config.debounce || 500"
			@change="handleCascaderChange" />
	</div>
</template>

<script setup>
	import useService from '/@/services/index.js';
	
	const props = defineProps({
		modelValue: { type: Array, default: () => ([]) },
		config: { type: Object, default: () => ({}) }
	})
	
	const addrCity = ref(props.modelValue)
	
	watch(() => props.modelValue, (v) => {
		addrCity.value = v
	})
	
	const emits = defineEmits(['update:modelValue'])
	
	const cascaderProps = Object.assign({
		lazy: true,
		lazy: true,
		lazyLoad: (node, resolve) => {
			const { level, data } = node
			
			if(level === 0) {
				return useService('district').list({ 
					level: 0, parentId: 0 ,
				}).then(res => {
					resolve(res.data.map(item => {
						return {
							id: item.id,
							value: item.code,
							label: item.name,
							leaf: level >= 1,
						}
					}))
				})
			}
			
			//市
			return useService('district').list({ 
				level: 1, parentId: data.id ,
			}).then(res => {
				resolve(res.data.map(item => {
					return {
						id: item.id,
						value: item.code,
						label: item.name,
						leaf: level >= 1,
					}
				}))
			}) 
		}
	}, props.config.props)
	
	const handleCascaderChange = (val) => {
		emits('update:modelValue', val)
	}
</script>

<style lang="scss" scoped>
	
</style>