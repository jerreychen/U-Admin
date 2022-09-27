<template>
    <el-select class="u-form-select"
        :model-value="modelValue"
        :clearable="clearable" 
        :size="size"
        :placeholder="placeholder"
        :multiple="multiple"
		:allow-create="allowCreate"
		:remote="remote && filterable"
		:filter-method="filterable && handleFilter"
		:remote-method="filterable && handleFilter"
		:filterable="allowCreate || filterable"
        :multiple-limit="multipleLimit"
		@change="handleSelectChange"
        :disabled="disabled"> 
		<el-option
			v-for="(item, index) in options"
			:key="`u-form-select-option-${index}`"
			:label="isObject(item) ? item[labelKey] : item"
			:value="valueFormatter(isObject(item) ? item[valueKey] : index)">
			<template v-if="componentOption" #default>
				<component :is="componentOption" :data="item"></component>
			</template>
		</el-option>
    </el-select>
</template>

<script setup>
    const props = defineProps({
            modelValue: { type: [String, Number, Boolean, Object] },
            valueKey: { type: String, default: 'value' }, // 和 el-select 原 value-key 不一样
            labelKey: { type: String, default: 'label' },
            size: { type: String, default: 'default' },
            placeholder: { type: String },
            clearable: { type: Boolean, default: true },
            disabled: { type: Boolean, default: false },
            multiple: { type: Boolean, default: false },
            multipleLimit: { type: Number, default: 0 },
			allowCreate: { type: Boolean, default: false },
			filterable: { type: Boolean, default: false },
            options: { type: Array, default: () => ([]) },
			valueFormatter: { type: Function, default: (v) => {
					return v;
				},
			},
			remote: { type: Boolean, default: false },
			componentOption: { type: Object }
        })

    const emits = defineEmits(['update:modelValue', 'create', 'query']);
	
	const updateValue = (val) => {
	   emits('update:modelValue', val) 
	}
	
	const handleSelectChange = (v) => {
		updateValue(v)
		// 如果找到
		if(props.options.find(item => {
			return item[props.valueKey] === v
		})) {
			return;
		}
		
		emits('create', v)
	}
	
	const handleFilter = (queryStr) => {
		if (!queryStr) {
			return;
		}
		
		emits('query', queryStr, props.options)
	}
</script>

<style lang="scss" scoped>
    .u-form-select {
        width: 100%;
    }
</style>