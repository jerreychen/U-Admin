<template>
    <div class="login-page d-flex row middle">
		<div class="flex-item grow fc-white login-desc">
			<div class="bg_login-desc"></div>
		</div>
		<div class="flex-item login-form">
			<LoginForm class=""></LoginForm>
		</div>
	</div>
</template>

<script setup>
    import LoginForm from '/@/pages/components/user/LoginForm.vue'

    const siteName = import.meta.env.VITE_APP_TITLE
	const siteDescription = import.meta.env.VITE_APP_DESCRIPTION
</script>

<style lang="scss" scoped>
	.login-page {
		background: transparent url('/@/assets/common/images/bg_login.jpeg') center center no-repeat;
		background-size: cover;
		height: 100vh;
		padding: 0 5rem;
		
		.login-desc {
			background-color: rgba(255, 255, 255, 0.15);
			border-radius: .25rem;
			height: 529px;
			margin-right: -394px;
			padding-right: 394px ;
			
			.bg_login-desc {
				background: transparent url('/@/assets/common/images/login_img_searates.svg') center center no-repeat;
				background-size: contain;
				height: 100%;
				width: 100%;
			}
		}
	}
</style>