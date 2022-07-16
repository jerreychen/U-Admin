<template>
    <el-card class="login-form">
        <h2 class="blue-text">未成年人三色危机干预平台</h2>
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
                <el-image class="verify-code" :src="imgVerifyCode"></el-image>
            </template>
        </VuFormBox>
        <VuThirdPartyLogin @click="handleThirdPartyLogin" />
    </el-card>
</template>

<script setup>
import imgVerifyCode from '/@/assets/common/images/verify-code.png'
const store = useStore()
const router = useRouter();

const fieldList =  reactive([
        { name: 'username', label: '用户名', prefix: { type: 'icon', name: 'User' } },
        { name: 'passwd', type: 'password', showPassword: true, label: '密码', prefix: { name: 'Lock' } },
        { name: 'code', label: '验证码', maxLength: 4, prefix: {  name: 'Key' }, suffix: { type: 'slot', slot: 'verifyCode' } },
        { name: 'remember', label: '记住账号密码', type: 'checkbox', style: { 'margin-bottom': 0 } }
    ])

    const formRules = reactive({
        username: [{ required: true, trigger: 'blur', message: '必填项！' }],
		passwd: [{ required: true, trigger: 'blur', message: '必填项！' }],
		code: [{ required: true, trigger: 'blur', message: '必填项！' }]
    })
    const formValue = reactive({
        username: 'admin',
        remember: true
    })

  const loading = ref(false)

    const handleLoginSubmit = (formValue) => {
		loading.value = true
        store.dispatch('user/Login', formValue).then(() => {
			loading.value = false
            router.push('/home')
        })
    }

    const handleThirdPartyLogin = (key) => {
        console.log(key)
    }
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
    
    .verify-code {
        height: 38px;
    }
}
</style>
