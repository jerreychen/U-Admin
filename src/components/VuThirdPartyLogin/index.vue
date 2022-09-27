<template>
<div class="third-party-login">
    <div class="third-party-login_title">
        {{title}}
    </div>
    <el-row class="third-party-login_content" :gutter="5">
        <el-col :span="24 / thirdPartyList.length" 
            align="center"
            v-for="(item, index) in thirdPartyList" 
            :key="`third-party-login-${index}`">
            <el-image class="icon" :src="item.iconUrl" :title="item.title" @click="$emit('click', item.key)"></el-image>
        </el-col>
    </el-row>
</div>
</template>

<script setup>
    import wechartIcon from './icons/wechat.png'
	import weiboIcon from './icons/weibo.png'
	import qqIcon from './icons/qq.png'
	import dingdingIcon from './icons/dingding.png'
    
    defineProps({
        title: { type: String, default: '第三方登录' }
    })
    
    defineEmits(['click'])
    
    const thirdPartyList = reactive([
        { key: 'dingding', iconUrl: dingdingIcon, title: '钉钉', },
		{ key: 'wechat', iconUrl: wechartIcon, title: '微信', },
		//{ key: 'weibo', iconUrl: weiboIcon, title: '微博', },
		//{ key: 'qq', iconUrl: qqIcon, title: 'QQ', }
    ])
    
    
</script>

<style lang="scss" scoped>
.third-party-login {
    .third-party-login_title {
        align-items: center;
        color: #AAAAAA;
        display: flex;
        justify-content: space-around;
        position: relative;
        text-align: center;
        padding: 1rem 0;
        
        &::after,
        &::before {
            background-color: #F0F0F0;
            content: '';
            height: 1px;
            width: 20%;
        }
    }
    .third-party-login_content {
        .icon {
            cursor: pointer;
            height: 36px;
            width: 36px;
        }
    }
}
</style>