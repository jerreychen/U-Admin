<template>
	<el-aside class="sidebar" :class="{
	    'hideSidebar': collapsed,
	    'showSidebar': !collapsed
	}" :width="collapsed ? '62px' : '200px'">
	    <div class="logo d-flex row center middle">
	        <el-image src="/@/assets/logo.png" class="icon_logo"></el-image>
			<span class="text-system-name" v-if="!collapsed">U-Admin</span>
	        <span class="version" v-if="!collapsed">{{version}}</span>
	    </div>
		
	    <div class="main-menu">
			<div class="dashboard-home d-flex row middle" @click="goto('/home')">
				<el-icon class="icon-home" :size="18"><House /></el-icon>
				<span class="label-home" v-if="!collapsed">控制面板</span>
			</div>
			<el-scrollbar class="main-menu_list" height="calc(100vh - 92px)">
				<VuMenu :collapsed="collapsed" :data="menuList"></VuMenu>
			</el-scrollbar>
	    </div>
	</el-aside>
</template>

<script setup>
    import useMenu from '/@/utils/menu.js';
	
	const menuList = useMenu();
	
	const props = defineProps({
		collapsed: { type: Boolean, default: false }
	})
	
	const version = import.meta.env.VITE_APP_VERSION
</script>

<style lang="scss" scoped>
	.sidebar {
	    height: calc(100%);
	    position: relative;
		
		.text-system-name {
			color: $blue;
			height: 36px;
			line-height: 36px;
			font-size: 23px;
			font-weight: bold;
			margin-left: 1rem;
			overflow: hidden;
		}
	    
	    &.hideSidebar {
	        transition-duration: 0.3s;  
	        transform: translate3d(-20, 0, 0);
	    }
	    &.showSidebar {
	      transition-duration: 0.3s;
	      transform: translate3d(20, 0, 0);  
	    }
	    
	    .logo { 
	        height: 42px;
	        position: relative;
	        
	        .icon_logo {
	            height: 36px;
	            width: 36px;
	        }
	        .version {
				background-color: $white;
				border: 1px solid $gray;
				border-radius: .25rem;
				color: $gray;
				font-size: 9px;
				padding: 0 3px;
	            position: absolute;
	            right: 1px;
				top: 1px;
	        }
	    }
	    
	    .main-menu {
			.dashboard-home {
				background-color: $blue;
				color: $white;
				cursor: pointer;
				font-size: bold;
				padding:1rem 20px;
				position: relative;
				
				.icon-home {
					width: 24px;
				}
				.label-home {
					height: 1rem;
					padding-left: 5px;
					overflow: hidden;
				}
			}
			
			.main-menu_list {
				:deep(.el-scrollbar__view) {
					overflow-x: hidden;
				}
			}
	    }
	}
</style>