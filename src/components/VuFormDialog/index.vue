<template>
	<VuDialog 
		:visible="visible" 
		:loading="loading"
		:title="title"
		:width="width"
		:showHelp="true"
		@open="handleDialogOpen"
		@opened="handleDialogOpened"
		@confirm="handleDialogConfirm"
		@cancel="handleDialogCancel">
		<VuForm ref="formRef"
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
			:rules="rules"
			:value="value">
			<template v-for="(slotName, slotIndex) in slotList" :key="slotIndex" v-slot:[slotName]="scope">
				<slot :name="slotName" :form="scope.form"/>
			</template>
		</VuForm>
		<template #help>
			<slot name="buttons"></slot>
		</template>
	</VuDialog>
</template>

<script setup>
	const props = defineProps({
		visible: { type: Boolean, default: false },
		title: { type: String },
		disabled: { type: Boolean, default: false },
		fields: { type: Array, required: true },
		value: { type: Object, default: () => ({}) },
		rules: { type: Object, default: () => ({}) },
		loading: { type: Boolean, default: false },
		showMessage: { type: Boolean, default: true },
		inlineMessage: { type: Boolean, default: false },
		showStatusIcon: { type: Boolean, default: false },
		inline: { type: Boolean, default: false },
		size: { type: String, default: 'default' },
		labelPosition: { type: String, default: 'right' },
		labelWidth: { type: String, default: '80px' },
		showLabel: { type: Boolean, default: true },
		showTips: { type: Boolean, default: false },
		width: { type: String, default: '100%' }
	})
	
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
	
	const formRef = ref()
	
	const emits = defineEmits(['submit', 'cancel', 'open', 'opened'])
	
	const handleDialogConfirm = () => {
		// 是否有rules
		if(!Object.keys(props.rules)) {
		    return emits('submit', formRef.value.getValue())
		}
		
		formRef.value.getForm().validate(valid => {
		    if(!valid) {
		        return
		    }
			
		    emits('submit', formRef.value.getValue())
		})
	}
	
	const handleDialogCancel = () => {
		emits('cancel')
	}
	
	const handleDialogOpen = () => {
		emits('open')
	}
	
	const handleDialogOpened = () => {
		emits('opened', formRef.value.getValue())
	}
	
	defineExpose({
		getForm: () => formRef.value.getForm()
	})
</script>

<style lang="scss" scoped>
</style>