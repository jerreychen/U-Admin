<template>
    <el-select class="u-form-select"
        v-model="value"
        :clearable="clearable" 
        :size="size"
        :placeholder="placeholder"
        :multiple="multiple"
		:allow-create="allowCreate"
		:remote="!!remote && filterable"
		:remote-method="handleRemote"
		:filterable="allowCreate || filterable"
        :multiple-limit="multipleLimit"
		@change="handleSelectChange"
        :disabled="disabled">
        <el-option
            v-for="(item, index) in selectOptions"
            :key="`u-form-select-option-${index}`"
            :label="isObject(item) ? item[labelKey] : item"
            :value="valueFormatter(isObject(item) ? item[valueKey] : index)" />
    </el-select>
</template>

<script setup>
    const props = defineProps({
            value: { type: [String, Number, Boolean, Object] },
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
			remote: { type: Boolean }
        })
        
    const emits = defineEmits(['update:value', 'create', 'query']);
	
	const selectOptions = ref(props.options)
	
	const handleSelectChange = (v) => {
		// 如果找到
		if(selectOptions.value.find(item => {
			return item[props.valueKey] === v
		})) {
			return;
		}
		
		emits('create', v)
	}
	
	const handleRemote = (queryStr) => {
		if (!queryStr) {
			return;
		}
		
		emits('query', queryStr, selectOptions)
	}
         
	const updateValue = (val) => {
	   context.emit('update:value', val) 
	}
</script>

<style lang="scss" scoped>
    .u-form-select {
        width: 100%;
    }
</style>