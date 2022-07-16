<template>
	<el-header class="header">
	    <div class="toolbar d-flex row middle space-between">
	        <div class="d-flex row middle">
	            <slot />
	        </div>
	        <div class="d-flex row middle">
	            <Toolbar />
	        </div>
	    </div>
	    <div class="breadcrumb d-flex row middle space-between">
	        <VuBreadcrumb class="margin-left-2"></VuBreadcrumb>
			<div class="current-date-time d-flex row middle">
				<el-icon style="margin-right:.25rem;"><Calendar /></el-icon>
				<span>{{currentDateTime}}</span>
			</div>
	    </div>
	</el-header>
</template>

<script setup>
	import Toolbar from './Toolbar.vue';
	
	const currentDateTime = ref()
	setInterval(() => {
		currentDateTime.value = new Date().format('Y-M-D H:I:S 星期Z');
	})
</script>

<style lang="scss" scoped>
	.header {
	    height: 80px;
	    padding: 0;
	               
	    .toolbar {
			background-color: $white;
	        height: 42px;
	    }
	    
	    .breadcrumb {
			background-color: $blue;
			color: #white;
	        height: 38px;
	        overflow-x: auto;
	        overflow-y: hidden;
			
			.current-date-time {
				color: $gray;
				padding-right: .5rem;
			}
			
			:deep(.el-breadcrumb__inner) {
				color: $gray;
			}
	    }
	}
</style>