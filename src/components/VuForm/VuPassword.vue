<template>
    <div class="u-x-password w-100">
        <el-input
            type="password"
            :clearable="clearable"
            :disabled="disabled"
            :size="size"
            :minlength="minlength"
            :maxlength="maxlength"
            :placeholder="placeholder"
            :show-password="true"
			@input="updateValue"
            :model-value="modelValue">
        </el-input>
        <el-progress class="u-x-password-progress"
            :stroke-width="3" 
            :show-text="false" 
            :percentage="percentage"
            :color="statusList[statusIndex]" />
    </div>
</template>

<script setup>
	/**
	 * WARNING
	 * Input 为受控组件，它 总会显示 Vue 绑定值。
	 * 在正常情况下，input 的输入事件应该被正常响应。 
	 * 它的处理程序应该更新组件的绑定值 (或使用 v-model)。 
	 * 否则，输入框的值将不会改变。
	 * 不支持 v-model 修饰符。
	 */
    const props = defineProps({
		size: { type: String, default: 'default' },
		clearable: { type: Boolean, default: true },
		disabled: { type: Boolean, default: false },
		minlength: { type: Number, default: 6 },
		maxlength: { type: Number },
		placeholder: { type: String },
		modelValue: { type: String } // 不可使用 value 作为名称
	});
        
    const emits = defineEmits(['update:modelValue'])
        
	const { minlength } = toRefs(props)
	
	const percentage = ref(0)
	const statusIndex = ref(0)
	const statusList = ref(['','#f56c6c', '#e6a23c', '#5cb87a'])
	
	watch(() => props.modelValue, (val) => {
		if(!val) {
			percentage.value = 0
			statusIndex.value = 0
			return
		}
		let v = 0;
		// 密码长度
		if(val.length >= minlength.value) { v += 20;  }
		// 密码含有小写字母
		if(/[a-z]+/.test(val)) { v += val.length >= minlength.value ? 20 : 10; }
		// 密码含有大写字母
		if(/[A-Z]+/.test(val)) { v += val.length >= minlength.value ? 20 : 10; }
		// 密码含有数字
		if(/[0-9]+/.test(val)) { v += val.length >= minlength.value ? 20 : 10; }
		// 密码含有非字母、数字的字符
		if(/[^a-zA-Z0-9]+/.test(val)) { v += val.length >= minlength.value ? 20 : 10; }
		
		percentage.value = v
		
		if(v < 50) { statusIndex.value = 1; return }
		if(v < 70) { statusIndex.value = 2; return }
		statusIndex.value = 3;
	}) 
	
	const updateValue = (val) => {
		context.emit('update:modelValue', val)
	}
</script>

<style scoped lang="scss">
    .u-x-password-progress {
        position: absolute;
        width: 100%;
        bottom: -2px;
    }
</style>