<template>
	<el-aside class="sidebar" width="250px">
		<div class="d-flex row h-100">
			<div class="sidebar-column_a">
				<div class="main-menu">
					<div class="dashboard-home d-flex row middle" @click="goto('/home')">
						<el-icon class="icon-home" :size="18"><House /></el-icon>
					</div>
					<el-scrollbar class="main-menu_list" height="calc(100vh - 50px)">
						<VuMenu :collapsed="true" @click="handleMenuItemClick" :firstLevelOnly="true" :data="menuList"></VuMenu>
					</el-scrollbar>
				</div>
			</div>
			<div class="sidebar-column_b flex-item grow">
				<div class="logo d-flex row center middle">
					<el-image src="/src/assets/logo.png" class="icon_logo"></el-image>
					<span class="text-system-name">物流竞价</span>
					<span class="version">{{version}}</span>
				</div>
				<div class="main-menu">
					<el-scrollbar class="main-menu_list" height="calc(100vh - 42px)">
						<VuMenu :parentUrl="parentUrl" :data="subMenuList"></VuMenu>
					</el-scrollbar> 
				</div>
			</div>
		</div>
	</el-aside>
</template>

<script setup>
    import useMenu from '@/utils/menu.js';
	
	const route = useRoute()
	const menuList = useMenu()
	
	const props = defineProps({
		collapsed: { type: Boolean, default: false }
	})
	
	const version = import.meta.env.VITE_APP_VERSION
	
	const subMenuList = ref([])
	const parentUrl = ref('')
	const handleMenuItemClick = (item) => {
		subMenuList.value = item.children;
		parentUrl.value = '/' + item.url;
	}
	
	const loadDefaultMenu = (route) => {
		let pathStr = route.path.substr(1)
		let menu = menuList.find(m => {
			return m.url === pathStr.substr(0, pathStr.indexOf('/'))
		})
		
		if(menu) {
			handleMenuItemClick(menu)
		}
	}
	loadDefaultMenu(route)
	
	watch(route, (r)=> { 
		loadDefaultMenu(r)
	}, {
	    immediate: true
	})
</script>

<style lang="scss" scoped>
	.sidebar {
	    height: calc(100%);
	    position: relative;
		
		.sidebar-column_a {
			width: 64px;
		}
		
		.sidebar-column_b {
			border-color: rgba(200, 200, 200, 0.2);
			border-style: solid;
			border-width: 0 1px;
		}
		
		.text-system-name {
			color: $blue;
			height: 36px;
			line-height: 36px;
			font-size: 23px;
			font-weight: bold;
			margin-left: 1rem;
			overflow: hidden;
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