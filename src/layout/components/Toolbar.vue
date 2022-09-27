<template>
    <div class="toolbar d-flex row middle">
		<div class="search-form margin-right-2">
			<el-autocomplete class="search-form_input" 
				v-model="keywords" 
				@select="handleSelect"
				:fetchSuggestions="handleFetchSuggestions"
				prefix-icon="Search" 
				placeholder="请输入关键字"></el-autocomplete>
		</div>
        
        <VuBadgeIcon tooltip="数据仪表盘" icon="DataAnalysis" />
        
        <VuBadgeIcon tooltip="清空缓存" v-if="showClearCache" icon="BrushFilled" @click="handleClearCacheClick" />
        
		<VuBadgeIcon tooltip="全屏" icon="FullScreen" @click="handleFullscreenClick" />
 		
        <VuBadgeIcon tooltip="消息中心" v-if="showNofication" icon="Bell" :badgeValue="notifyCount" @click="handleNotificationClick" />
        
        <el-dropdown class="toolbar-item" @visible-change="handleVisibleChange" @command="handleAvatarCommand">
            <div class="d-flex row middle space-between">
                <el-avatar :src="avatarUrl" size="small"></el-avatar>
				<span v-if="displayName">{{displayName}}</span>
                <el-icon class="margin-left-1">
                    <component :is="isDropdown ? 'ArrowUp' : 'ArrowDown'" />
                </el-icon>
            </div>
            <template #dropdown>
                <el-dropdown-menu>
                    <!--<el-dropdown-item icon="Postcard" command="ucenter">个人中心</el-dropdown-item>-->
                    <el-dropdown-item icon="User" command="profile">修改资料</el-dropdown-item>
                    <el-dropdown-item icon="Lock" command="change_password">修改密码</el-dropdown-item>
                    <el-dropdown-item icon="SwitchButton" divided command="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
        
        <el-drawer v-model="drawerOpened" title="消息中心" :with-header="true">
            <template #header>
            	<div class="d-flex row middle space-between">
            		<el-link type="primary" :disabled="readAllDisabled" @click="handleReadAllNotify">全部已读</el-link>
            		<span class="flex-item grow">消息中心</span>
            	</div>
            </template>
            <VuList class="notify-list" :data="notifyList">
            </VuList>
        </el-drawer>
    </div>
</template>

<script setup>
	import screenfull from 'screenfull'
	
    import defaultAvatarUrl from '@/assets/common/images/default_avatar.png'

	import message from '@/utils/message.js'
	import storage from '@/utils/storage.js'
	
	const router = useRouter()
	const store = useStore()
	
	const searchPopoverRef = ref(null)
	const displayName = store.getters.displayName
	const keywords = ref()
	const isDropdown = ref(false)
	const drawerOpened = ref(false)
	const notifyCount = ref(0)
	
	const readAllDisabled = ref(false)
	const notifyList = ref([])
	
	const avatarUrl = store.getters.avatarUrl || defaultAvatarUrl
     
	const props = defineProps({
		showSearch: { type: Boolean, default: true },
		showClearCache: { type: Boolean, default: true },
		showNofication: { type: Boolean, default: true }
	})
	
	const handleNotificationClick = () => {
		drawerOpened.value = true
	}
	
	const handleVisibleChange = (visible) => {
		isDropdown.value = visible
	}
	
	const handleAvatarCommand = (command) => {
		switch(command) {
			case 'logout': 
				store.dispatch('user/Logout').then(() => {
					router.push('/login')
				})
			break;
			default:
				router.push({
					name: 'u-admin_' + command
				})
			break;
		}   
	}
	
	const handleFetchSuggestions = () => {
		
	}
	
	const handleDashboardClick = () => {
		
	}
	
	const handleReadAllNotify = () => {
		
	}
	
	const handleFullscreenClick = () => {
		if (!screenfull.isEnabled) {
			message('错误提示', '您的浏览器不支持全屏').notify('error')
			return
		}
		
		screenfull.toggle().catch(() =>{})
	}
	
	const handleClearCacheClick = () => {
		store.dispatch('app/refreshCache').then(res => {
			router.go()
			message('成功提醒', '缓存清理成功！').notify('success')
		})
	}
	
	const handleSelect = () => {
		
	}
	
</script>

<style scoped lang="scss">
    .toolbar {
        height: 100%;
        line-height: 100%;
        
        .toolbar-item {
            cursor: pointer;
            padding: 0 .75rem;
        }
		
		.search-form {
			
			:deep(.el-input__wrapper) {
				box-shadow: none;
			}
		}
		
		.u-list {
			text-align: left;
			
			:deep(.u-list_item) {
				border-bottom: 1px solid $lightgray;
				cursor: pointer;
				padding: 1rem;
				position: relative;
				
				&:hover {
					background-color: $lightgray;
				}
				 
				.unread {
					font-weight: bold;
				} 
			}
		}
    }
</style>