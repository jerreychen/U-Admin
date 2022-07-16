<template>
    <el-card class="login-form">
        <h2 class="blue-text">{{siteTitle}}</h2>
        <VuFormBox class="margin-bottom-0"
            size="large"
            :showLabel="false"
            v-bind:fields="fieldList" 
            :value="formValue"
            :rules="formRules"
            confirmButtonText="登录"
			:loading="loading"
            @submit="handleLoginSubmit"
            :showCancel="false">
            <template #verifyCode>
                <el-image class="verify-code" title="点击刷新验证码" @click="handleRefreshCaptcha" :src="imgVerifyCode"></el-image>
            </template>
        </VuFormBox>
        <VuThirdPartyLogin @click="handleThirdPartyLogin" />
    </el-card>
</template>

<script setup>
	import { getCaptcha } from '/@/services/app.js'
	
	const store = useStore()
	const router = useRouter();
	
	const siteTitle = import.meta.env.VITE_APP_TITLE
	
	const redirectUrl = router.currentRoute.value.params.redirectTo || '/home'	
	const imgVerifyCode = ref('/@/assets/common/images/verify-code.png')

    const loading = ref(false)

	const fieldList =  reactive([
        { name: 'username', label: '用户名', prefix: { type: 'icon', name: 'User' } },
        { name: 'passwd', type: 'password', showPassword: true, label: '密码', prefix: { name: 'Lock' } },
        { name: 'code', label: '验证码', maxLength: 4,
			class: 'verify-code-field',
			prefix: {  name: 'Key' }, 
			suffix: { type: 'slot', slot: 'verifyCode' } ,
		},
        { name: 'remember', label: '记住账号密码', type: 'checkbox', style: { 'margin-bottom': 0 } }
    ])

    const formRules = reactive({
        username: [{ required: true, trigger: 'blur', message: '必填项！' }],
		passwd: [{ required: true, trigger: 'blur', message: '必填项！' }],
		code: [{ required: true, trigger: 'blur', message: '必填项！' }]
    })
	// 从缓存读取
    const formValue = reactive(Object.assign({}, store.getters.userData))

	const getCaptchaCode = () => {
		getCaptcha().then(res => {
			if(res.code === 200) {
				imgVerifyCode.value = res.data
			}
		})
	}
	
    const handleLoginSubmit = (formValue) => {
		loading.value = true
        store.dispatch('user/Login', formValue).then(res => {
			loading.value = false
			if(res.code !== 200) {
				getCaptchaCode();
				return
			}
			store.dispatch('app/refreshMenu').then(res => {
				router.push(redirectUrl)
			})
        })
    }

    const handleThirdPartyLogin = (key) => {
        console.log(key)
    }
	
	const handleRefreshCaptcha = () => {
		getCaptchaCode();
	}
	
	onMounted(()=>{
		getCaptchaCode();
	})
</script>

<style lang="scss" scoped>
.login-form {
    padding: 1rem;
	width: 360px;
    
	.blue-text { color: #1378F6; }
    :deep(.u-form_buttons) {
        .el-button {
            width: 100%;
        } 
    }
    
    :deep(.u-form-wrapper) { 
		.verify-code-field {
			.el-input__wrapper {
				padding-right: 2px !important;
			}
		}
	}
		
	.verify-code {
		border-left: 1px solid var(--el-input-border-color);
		cursor: pointer;
		height: 38px;
		
		.el-image__inner {
			border-radius: 0 4px 4px 0 !important;
		}
	} 
	
    .third-party {
        margin: 1.5rem 0 .5rem;
    }
}
</style>
