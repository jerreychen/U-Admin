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
		
	    <div class="main-menu u-scrollbar">
	        <VuMenu :collapse="collapsed"></VuMenu>
	    </div>
	</el-aside>
</template>

<script setup>
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
			border-right: 1px solid $blue;
	        height: calc(100% - 42px);
	        overflow-x: hidden;
	        overflow-y: auto;
	    }
	    
	}
</style>