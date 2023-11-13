<template>
    <div class="u-x-input w-100">
        <el-input 
			:size="size"
			:input-style="style"
			:clearable="clearable"
			:disabled="disabled"
			:maxlength="maxlength"
            :placeholder="placeholder"
			@input="updateValue"
			:model-value="inputVal"/>
    </div>
</template>

<script setup>
    const props = defineProps({
			replace: { type: RegExp, required: true },
			style: { type: String },
			clearable: { type: Boolean, default: false },
			disabled: { type: Boolean, default: false },
			maxlength: { type: Number, default: 99 },
			size: { type: String, default: 'default' },
			placeholder: { type: String },
            modelValue: { type: [Number, String] }
        });
        
    const emits = defineEmits(['update:modelValue', 'change'])
    
	const inputVal = ref(props.modelValue)

	watch(() => props.modelValue, (v) => {
		const { replace } = props
		inputVal.value =  v.replace(replace,'')
	})
	
	const updateValue = (val) => {
		emits('change', val)
		emits('update:modelValue', val)
	}
</script>

<style>
</style>