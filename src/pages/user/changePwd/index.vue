<template>
	<VuContent title="修改密码" :showBack="true">
		<div class="change-pwd-form">
			<VuFormBox :fields="fieldList" :showCancel="false"></VuFormBox>
		</div>
	</VuContent>
</template>

<script setup>
    const fieldList = reactive([
        { name: 'oldPwd', label: '旧密码', type: 'password', showPassword: true },
        { name: 'newPwd', label: '新密码', type: 'password', showPassword: true },
        { name: 'confirmNewPwd', label: '确认密码', type: 'password', showPassword: true }
    ])
</script>

<style scoped>
    .change-pwd-form {
        width: 360px;
    }
</style>