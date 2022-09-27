<template>
    <div class="u-x-input w-100">
        <el-input 
			:size="size"
			:clearable="clearable"
			:disabled="disabled"
			:maxlength="maxlength"
            :placeholder="placeholder"
			@input="updateValue"
			:model-value="inputVal"/>
    </div>
</template>

<script>
    export default {
        props: {
			replace: { type: RegExp, required: true },
			clearable: { type: Boolean, default: false },
			disabled: { type: Boolean, default: false },
			maxlength: { type: Number, default: 99 },
			size: { type: String, default: 'default' },
			placeholder: { type: String },
            modelValue: { type: [Number, String] }
        },
        
        emits: ['update:modelValue'],
        
        setup(props, context) { 
            const { modelValue, replace } = toRefs(props)
            const inputVal = ref()
			
			watch(modelValue, (v) => {
				inputVal.value =  v.replace(replace.value,'')
			})
			
            const updateValue = (val) => {
                context.emit('update:modelValue', val)
            }
            
            return {
				inputVal,
                updateValue
            }
        }
    }
</script>

<style>
</style>