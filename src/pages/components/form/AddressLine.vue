<template>
	<div class="w-100">
		<el-cascader 
			class="w-100"
			:props="cascaderProps" 
			v-model="addrCity"
			:placeholder="config.cityPlaceholder || '请选择城市'" 
			:size="config.size || 'default'"
			:filterable="config.filterable"
			:filter-method="config.filterMethod"
			:separator="config.separator"
			@change="handleCascaderChange"
			:clearable="config.clearable ?? true" />
		<el-input class="margin-top-1"
			v-model="addrLine"
			:clearable="config.clearable ?? true"
			:size="config.size || 'default'"
			@change="handleInputChange"
			:placeholder="config.placeholder || '请输入地址'"></el-input>
	</div>
</template>

<script setup>
	import useService from '/@/services/index.js';
	
	const props = defineProps({
		modelValue: { type: Object, default: () => ({}) },
		config: { type: Object, default: () => ({}) }
	})
	
	const addrCity = ref([])
	const addrLine = ref('')
	const addrVal = ref({})
	
	watch(() => props.modelValue, (v) => {
		console.log(v)
		const { province, city, area, /* street, */ address } = v
		addrCity.value = [`${province}`, `${city}`, `${area}` /*, `${street}`*/]
		addrLine.value = address
	})
	
	const emits = defineEmits(['update:modelValue'])
	
	const cascaderProps = Object.assign({
		lazy: true,
		lazyLoad: (node, resolve) => {
			const { level, data } = node
			//省
			if(level === 0) {
				return  useService('district').list({ 
					level: 0, parentId: 0 ,
				}).then(res => {
					resolve(res.data.map(item => {
						return {
							id: item.id,
							value: item.code,
							label: item.name,
							leaf: level >= 2,
						}
					}))
				})
			}
			
			//市
			if(level === 1) {
				return useService('district').list({ 
					level: 1, parentId: data.id ,
				}).then(res => {
					resolve(res.data.map(item => {
						return {
							id: item.id,
							value: item.code,
							label: item.name,
							leaf: level >= 2,
						}
					}))
				})
			}
			// 镇
			//if(level === 2) {
				return useService('district').list({ 
					level: 2, parentId: data.id ,
				}).then(res => {
					resolve(res.data.map(item => {
						return {
							id: item.id,
							value: item.code,
							label: item.name,
							leaf: level >= 2,
						}
					}))
				})
			//}
			/*
			return getStreetList(data.id).then(res => {
				resolve(res.data.map(item => {
					return {
						id: item.id,
						value: item.code,
						label: item.name,
						leaf: level >= 3,
					}
				}))
			})*/
		}
	}, props.config.props)
	
	const handleCascaderChange = (v) => {
		if(!v) { v = [] }
		addrVal.value.province = v[0] || ''
		addrVal.value.city = v[1] || ''
		addrVal.value.area = v[2] || ''
		//addrVal.value.street = v[3] || ''
		emits('update:modelValue', addrVal.value)
	}
	
	const handleInputChange = (v) => {
		addrVal.value.address = v
		emits('update:modelValue', addrVal.value)
	}
	
</script>

<style lang="scss" scoped>
	
</style>