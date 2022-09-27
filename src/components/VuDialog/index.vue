<template>
	<el-dialog 
		class="u-dialog" 
		:model-value="visible"
		:title="title"
		:width="width"
		append-to-body
		:close-on-click-modal="false"
		destroy-on-close
		@open="handleDialogOpen"
		@opened="handleDialogOpened"
		@close="handleDialogClosed"
		:before-close="handleBeforeClose"> 
		<div v-loading="loading">
			<VuWaterPrint :zIndex="199" :size="100">
				<slot />
			</VuWaterPrint>
		</div>
		<template #footer v-if="showConfirm || showCancel || showHelp">
			<div class="footer_buttons d-flex row middle space-between">
				<div class="footer_buttons-left">
					<slot name="help" v-if="showHelp" />
				</div>
				<div class="footer_buttons-right">
					<template v-if="showConfirm || showCancel">
						<el-button @click="handleCancelDialog" v-if="showCancel">{{cancelText}}</el-button>
						<el-button type="primary" :icon="confirmIcon" :disabled="loading" @click="handleConfirmDialog" v-if="showConfirm">{{confirmText}}</el-button>
					</template>
				</div>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
	import message from '@/utils/message.js'
	
	const props = defineProps({
		visible: { type: Boolean, default: false },
		loading: { type: Boolean, default: false },
		title: { type: String },
		width: { type: [String, Number], default: '50vw' },
		showConfirm: { type: Boolean, default: true },
		confirmText: { type: String, default: '确定' },
		confirmIcon: { type: String },
		showHelp: { type: Boolean, default: false },
		showCancel: { type: Boolean, default: true },
		cancelText: { type: String, default: '取消' },
		closeMessage: { type: String, default: '' }
	})
	
	const emits = defineEmits(['open', 'opened', 'cancel', 'confirm'])
	 
	const handleCancelDialog = () => {
		emits('cancel')
	}
	
	const handleDialogClosed = () => {
		emits('cancel')
	}
	
	const handleBeforeClose = (done) => {
		if(!props.closeMessage) {
			return done()
		}
		
		message('确认关闭', props.closeMessage).confirm()
			.then(() => { done() })
			.catch(() => {})
	}
	
	const handleDialogOpen = () => {
		emits('open')
	}
	
	const handleDialogOpened = () => {
		emits('opened')
	}
	
	const handleConfirmDialog = () => {
		emits('confirm')
	}
</script>

<style lang="scss">
	.u-dialog {
		
		.el-dialog__body { 
			padding-top: 10px;
			padding-bottom: 10px;
		}
	}
</style>