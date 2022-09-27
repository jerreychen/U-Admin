<template>
	<VuContent :title="corpTitle" :showBack="true">
		<VuFormBox class="margin-bottom-0" ref="corpFormRef"
			:fields="fieldList"
			:value="formValue"
			:rules="fieldRules"
			labelWidth="120px"
			:showTips="true"
			:inline="true"
			:loading="formLoading"
			@submit="handleFormSubmit"
			confirmText="提交&保存"
			:buttonAlignRight="true"
			:buttonFullWidth="true"
			:showCancel="false">
		</VuFormBox>
	</VuContent> 
</template>

<script setup>
	import cache from '@/utils/cache.js';
	import message from '@/utils/message.js';
	import useService from '@/services/index.js';
	import AddressLine from '@/pages/components/form/AddressLine.vue';
	
	const router = useRouter();
	const formLoading = ref(false)
	const bizTypeOpts = ref([])
	cache.dict('biz_type').load().then(dataList => {
		bizTypeOpts.value = dataList;
	})
	const corpFormRef = ref()
	const fieldList = reactive([
		{ name: 'biz_type', label: '企业类型', class: 'w-50', type: 'select', options: bizTypeOpts, valueKey: 'key' },
		{ name: 'title', label: '企业名称', class: 'w-50' },
		{ name: 'code', label: '统一信用代码', class: 'w-50' },
		{ name: 'address', label: '企业地址',
			type: 'component', 
			component: markRaw(AddressLine),
			class: 'w-75' ,
		},
		{ name: 'manager', label: '企业法人姓名', class: 'w-33 margin-right-0' },
		{ name: 'manager_idn', label: '身份证号码', maxLength: 18, class: 'w-33 margin-right-0' },
		{ name: 'manager_tel', label: '联系电话', maxLength: 11, class: 'w-34 margin-right-0' },
		{ name: 'contact', label: '联系人姓名', class: 'w-33 margin-right-0' },
		{ name: 'contact_idn', label: '身份证号码', maxLength: 18, class: 'w-33 margin-right-0' },
		{ name: 'contact_tel', label: '联系电话', maxLength: 11, class: 'w-34 margin-right-0' },
		{ name: 'description', label: '企业简介', type: 'editor', class: 'w-100' }
	])
	const fieldRules = reactive({
		biz_type: { required: true, message: '企业类型必选！' },
		title: { required: true, message: '企业名称必填！' },
		code: [
			{ required: true, message: '企业名称必填！' },
			{ pattern: /\d{6}(\d|\w)12/, message: '企业统一信用代码格式错误！' }
		],
		manager: { required: true, message: '企业法人姓名必填！' },
	})
	const formValue = ref({})
	
	const corpTitle = ref('')
	
	const handleFormSubmit = () => {
		
	}
	
	onMounted(() => {
		const corpId = Number(router.currentRoute.value.params.corpId || 0)
		formValue.value = {}
		corpFormRef.value.getForm().resetFields();
		corpTitle.value = corpId > 0 ? `编辑企业（编号：${corpId}）` : '新建企业';
		if(!corpId) {
			formValue.value = {}
			return
		}
		
		formLoading.value = true
		useService('corp').get({ id: corpId }).then(res => {
			formLoading.value = false
			if(res.code === 200) {
				formValue.value = res.data
			}
		})
	})
</script>

<style lang="scss" scoped>
</style>