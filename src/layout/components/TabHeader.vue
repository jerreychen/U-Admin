<template>
	<el-header class="header">
	    <div class="toolbar d-flex row middle space-between">
	        <div class="d-flex row middle">
	            <slot />
				<VuBreadcrumb class="margin-left-2"></VuBreadcrumb>
	        </div>
	        <div class="d-flex row middle">
	            <Toolbar />
	        </div>
	    </div>
	    <div class="navi-tabs padding-x-2 d-flex row middle space-between">
			<div ref="scrollbarRef" class="navi-tab_items margin-right-2">
				<VuNaviTab :data="naviTabItems" @tabAdded="handleTabAdded" @tabActivated="handleTabActivated"></VuNaviTab>
			</div>
			<div class="current-date-time d-flex row middle">
				<el-icon style="margin-right:.25rem;"><Calendar /></el-icon>
				<span>{{currentDateTime}}</span>
			</div>
	    </div>
	</el-header>
</template>

<script setup>
	import Toolbar from './Toolbar.vue';
	
	const scrollbarRef = ref()
	
	const currentDateTime = ref()
	setInterval(() => {
		currentDateTime.value = new Date().format('Y-M-D H:I:S 星期Z');
	})
	
	const naviTabItems = reactive([
		{ name: 'admin_home', title: '控制面板', url: '/home', closable: false, isActive: true }
	])
	
	const handleTabAdded = (width) => {
		// 设置延时
		setTimeout(() => {
			const scrollWidth = Math.max(scrollbarRef.value.scrollWidth, width);
			console.log(scrollWidth, width)
			scrollbarRef.value.scrollLeft = scrollWidth - width
		}, 300)
	}
	
	const handleTabActivated = (width, left) => {
		setTimeout(() => {
			const scrollWidth = Math.max(width, left);
			scrollbarRef.value.scrollLeft = scrollWidth - width
		}, 300)
	}
</script>

<style lang="scss" scoped>
	.header {
	    height: 80px;
	    padding: 0;
	               
	    .toolbar {
			background-color: $white;
	        height: 42px;
			
			.el-breadcrumb { margin-top: 2px; }
	    }
	    
	    .navi-tabs {
			background-color: $white;
			border-top: 1px solid $lightgray;
			color: $white;
	        height: 37px;
			overflow: hidden;
			
			.navi-tab_items {
				max-width: calc(100% - 210px);
				overflow-x: scroll;
				
				&::-webkit-scrollbar {
				    display: none;
				}
			}
			
			.current-date-time {
				color: $dark;
				width: 210px;
			}
	    }
	}
</style>