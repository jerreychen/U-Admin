<template>
    <div>
        <div class="padding-top-16 error_code" v-if="pageCode">{{pageCode}}</div>
        <el-image class="padding-top-16" src="/src/assets/common/images/bg_empty.png" v-else></el-image>
        <div class="font-size-6">抱歉，您访问的页面不存在或服务端发生错误！</div>
        <div class="d-flex row center">
            <el-button class="margin-top-6 margin-right-2" type="primary" size="large" @click.native="goto('/home')">返回首页</el-button>
            <el-button class="margin-top-6 margin-left-2" size="large" @click.native="handleGoBack">返回上一页</el-button>
        </div>
    </div>
</template>

<script setup>
    const route = useRoute()
    const pageCode = ref(route.query.code)
    
    const handleGoBack = () => {
        history.go(-1);
    }
</script>

<style scoped lang="scss">
    .error_code {
		color: #444444;
        font-size: 10rem;
        font-weight: bold;
    }
</style>