<template>
	<VuContent :title="title">
		<VuForm ref="formRef"
			:loading="loading"
			:showMessage="showMessage"
			:inlineMessage="inlineMessage"
			:showStatusIcon="showStatusIcon"
			:inline="inline"
			:size="size"
			:labelPosition="labelPosition"
			:labelWidth="labelWidth"
			:showLabel="showLabel"
			:showTips="showTips"
			:fields="fields" 
			:width="width"
			:value="value"
			:rules="rules">
			<template v-for="(slotName, slotIndex) in slotList" :key="slotIndex" v-slot:[slotName]="scope">
				<slot :name="slotName" :value="scope.value" />
			</template>
			<el-form-item class="form-buttons" :class="{
				'u-form_buttons': !inline || buttonFullWidth,
				'w-100': inline && buttonFullWidth
				}">
				<div class="d-flex row middle w-100 space-between" :class="{ 'reverse': buttonAlignRight }">
				  <div class="d-flex row middle w-100" :class="{ 'reverse': buttonAlignRight }">
					  <el-button type="primary" :icon="confirmIcon" @click="submitForm" :disabled="loading" v-if="showConfirm">
						{{confirmText}}
					  </el-button>
					  <el-button v-if="showCancel" @click="handleCancel" class="margin-x-2">
						{{cancelText}}
					  </el-button>
					  <slot name="buttonLeft" />
				  </div>
				  <div class="d-flex row middle"><slot name="buttonRight" /></div>
			  </div>
			</el-form-item>
		</VuForm>
	</VuContent>
</template>

<script setup>
	import message from '@/utils/message.js'
	
	const props = defineProps({
		title: { type: String },
		fields: { type: Array, required: true },
		value: { type: Object, default: () => ({}) },
        loading: { type: Boolean, default: false },
		rules: { type: Object, default: () => ({}) },
		
		showMessage: { type: Boolean, default: true },
		inlineMessage: { type: Boolean, default: false },
		showStatusIcon: { type: Boolean, default: false },
		inline: { type: Boolean, default: false },
		size: { type: String, default: 'default' },
		labelPosition: { type: String, default: 'right' },
		labelWidth: { type: String, default: '80px' },
		showLabel: { type: Boolean, default: true },
		showTips: { type: Boolean, default: false },
		width: { type: String, default: '100%' },
		buttonFullWidth: { type: Boolean, default: false },
		buttonAlignRight: { type: Boolean, default: false },
		
		confirmIcon: { type: String },
		confirmText: { type: String, default: '确定' },
		cancelText: { type: String, default: '取消' },
		confirmMessage: { type: String },
		showConfirm: { type: Boolean, default: true },
		showCancel: { type: Boolean, default: true },
	})
	
	const emits = defineEmits(['submit', 'cancel'])
	
	const formRef = ref(null)
	
	const submitForm = () => {
	    // 是否有rules
	    if(!Object.keys(props.rules)) {
	        return emits('submit', formRef.value.getValue())
	    }
	
	    formRef.value.form.validate(valid => {
	        if(!valid) {
	            return message('错误提示', '请检查数据是否输入正确！').notify('error')
	        }
	
			if(props.confirmMessage) {
				message('确认？', props.confirmMessage).confirm().then(() => {
					emits('submit', formRef.value.getValue())
				}).catch(() => {})
				return
			}
			
	        emits('submit', formRef.value.getValue())
	    })
	}
	
	const slotList = computed(()=>{ 
		const slots = []
		
		props.fields.filter(field => {
			return field.type === 'slot' || field.prefix && field.prefix.type === 'slot' || field.suffix && field.suffix.type === 'slot'
		}).map(field => {
			if(field.type === 'slot') {
				slots.push(field.slot)
			}
			else {
				if(field.prefix && field.prefix.type === 'slot'){
					slots.push(field.prefix.slot)
				}
				
				if(field.suffix && field.suffix.type === 'slot'){
					slots.push(field.suffix.slot)
				}
			}
		})
		
		return slots;
	})
	
	const handleCancel = () => {
	    formRef.value.form.resetFields()
	    emits('cancel')
	}
	
	defineExpose({
		getForm: () => formRef.value.getForm()
	})
</script>

<style lang="scss" scoped>
	.u-form {
		.u-form_item {
			:deep(.el-rate__item) {
				align-items: center;
				display: flex;
			}
		}
		
		.u-form_buttons {
			margin-bottom: 0;
			width: 100% !important;
		}
	}
</style>