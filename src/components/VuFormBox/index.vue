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
				<slot :name="slotName" :form="scope.form" />
			</template>
			<el-form-item class="form-buttons" :class="{'u-form_buttons': !inline }">
				<div class="d-flex space-between full-width">
				  <div class="full-width">
					  <el-button type="primary" @click="submitForm" :loading="loading" v-if="showConfirm">
						  <el-icon v-if="confirmButtonIcon" class="margin-right-2">
							  <component :is="confirmButtonIcon" />
						  </el-icon>
						{{confirmButtonText}}
					  </el-button>
					  <el-button v-if="showCancel" @click="handleCancel">
						{{cancelButtonText}}
					  </el-button>
					  <slot name="buttonLeft" />
				  </div>
				  <div>
					  <slot name="buttonRight" />
				  </div>
			  </div>
			</el-form-item>
		</VuForm>
	</VuContent>
</template>

<script setup>
	import { message } from '/@/utils/common.js'
	
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
		
		confirmButtonIcon: { type: String },
		confirmButtonText: { type: String, default: '确定' },
		cancelButtonText: { type: String, default: '取消' },
		confirmText: { type: String },
		showConfirm: { type: Boolean, default: true },
		showCancel: { type: Boolean, default: true },
	})
	
	const emits = defineEmits(['submit', 'cancel'])
	
	const formRef = ref(null)
	
	const submitForm = () => {
	    // 是否有rules
	    if(!Object.keys(props.rules)) {
	        return emits('submit', formRef.value.formValue)
	    }
	
	    formRef.value.form.validate(valid => {
	        if(!valid) {
	            return
	        }
	
			if(props.confirmText) {
				message('确认？', props.confirmText).confirm().then(() => {
					emits('submit', formRef.value.formValue)
				}).catch(() => {})
				return
			}
			
	        emits('submit', formRef.value.formValue)
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

</script>

<style lang="scss" scoped>
	.u-form {
		.u-form_item {
			:deep(.el-rate__item) {
				align-items: center;
				display: flex;
			}
			.u-form-item_tips {
				color: #999999;
				font-size: .8rem;
				width: 100%;
			}
		}
		
		.u-form_buttons {
			margin-bottom: 0;
			width: 100% !important;
		}
	}
</style>