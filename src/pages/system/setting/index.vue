<template>
	<VuTab :title="['基础资料', '小程序资料', '支付设置']" class="bg-white" :showBack="true" :showFooter="true">
		<template #0>
			<VuForm ref="basicFormRef" :inlineTips="true" :fields="basicFormFields" :value="formValue" label-width="120px">
			</VuForm>
		</template>
		<template #1>
			<VuForm ref="mpFormRef" :inlineTips="true" :fields="mpFormFields" :value="formValue" label-width="120px">
			</VuForm>
		</template>
		<template #2>
			<VuForm ref="payFormRef" :inlineTips="true" :showTips="true" :fields="payFormFields" :value="formValue" label-width="120px">
			</VuForm>
		</template>
		<template #footer>
			<el-button type="primary">提交保存</el-button>
			<el-button>取消</el-button>
		</template>
	</VuTab>
</template>

<script setup>
	const mpFormRef = ref(null)
	const basicFormRef = ref(null)
	const payFormRef = ref(null)
	const formValue = ref({})
	
	const basicFormFields = ref([
		{ name: 'system_name', label: '系统名称' },
		{ name: 'url', label: '网址' }
	])
	const mpFormFields = ref([
		{ name: 'app_id', label: 'App Id' },
		{ name: 'app_secret', label: 'App Secret' },
		
	])
	const payFormFields = ref([
		{ name: 'merchant_id', label: '商户ID', tips: '商户编号' },
		{ name: 'merchant_secret', label: '商户秘钥', type: 'textarea', tips: '商户秘钥文件内容' }
	])
</script>

<style lang="scss" scoped>
	
</style>