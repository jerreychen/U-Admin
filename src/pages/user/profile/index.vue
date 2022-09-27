<template>
	<VuContent title="个人资料" :showBack="true">
		<VuFormBox :fields="fieldList" :showCancel="false"></VuFormBox>
	</VuContent>
</template>

<script setup>
	const fieldList = reactive([
		{ name: 'avatarUrl', label: '头像', type: 'avatar', changeable: true },
		{ name: 'nickname', label: '昵称', style: 'width: 50%' },
		{ name: 'gender', label: '性别', type: 'radio', options: ['男', '女'] },
		{ name: 'city', label: '城市', type: 'select', options: ['温州', '杭州'], style: 'width: 50%' },
		{ name: 'birthday', label: '出生日期', type: 'date', style: 'width: 25%' },
		{ name: 'remarks', label: '备注', type: 'textarea' }
	])
</script>

<style>
</style>