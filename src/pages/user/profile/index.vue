<template>
	<VuContent title="个人资料" :showBack="true">
		<VuFormBox :fields="fieldList" :value="formValue" :showCancel="false" @submit="handleFormSubmit"></VuFormBox>
	</VuContent>
</template>

<script setup>
	import useService from '@/services/index.js'
	
	const store = useStore()
	
	const formValue = ref({})
	const fieldList = reactive([
		{ name: 'avatarUrl', label: '头像', type: 'avatar', 
			changeable: true ,
			action: '/misc/upload'
		},
		{ name: 'nickname', label: '昵称', style: 'width: 50%' },
		{ name: 'gender', label: '性别', type: 'radio', options: ['男', '女'] },
		{ name: 'city', label: '城市', type: 'select', options: ['温州', '杭州'], style: 'width: 50%' },
		{ name: 'birthday', label: '出生日期', type: 'date', style: 'width: 25%' },
		{ name: 'remarks', label: '备注', type: 'textarea' }
	])
	
	useService('user').post('getInfo', { id: store.getters.userId }).then(res => {
		if(res.code !== 200) {
			return
		}
		
		formValue.value = res.data
	})
	
	const handleFormSubmit = (values) => {
		useService('user').update(values).then(res => {
			if(res.code !== 200) {
				return
			}
			
			message('提示信息', '资料更新成功').notify('success')
		})
	}
</script>

<style>
</style>