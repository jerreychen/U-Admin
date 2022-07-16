<template>
	<div class="u-sidebar-page" :style="`flex-direction: ${revert ? 'row-reverse':'row'};`">
		<div class="u-sidebar-page_side" 
			:class="{
				'border-right': !revert,
				'border-left': revert
			}">
			<div class="u-sidebar_resize" 
				:style="`min-width: ${sidebarWidth - 1}px;max-width: ${sidebarWidth  * 2}px`"></div>
			<div class="u-sidebar_content u-scrollbar">
				<slot name="sidebar" />
			</div>
		</div>
		<div id="sidebar-page-content" 
			class="u-sidebar-page_content u-scrollbar"
			:style="`width: calc(100% - ${sidebarWidth}px - 1rem)`">
			<slot name="content" />
			<el-backtop :right="30" :bottom="30" target="#sidebar-page-content" />
		</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		revert: { type: Boolean, default: false },
		sidebarWidth: { type: Number, default: 200 }
	})
</script>

<style lang="scss" scoped>
	.u-sidebar-page {
		display: flex;
		height: calc(100vh - 81px);
		margin: -20px;
		position: relative;
		
		.u-sidebar-page_side {
			background-color: $white;
			border-top: 1px solid $lightgray;
			height: 100%;
			position: relative;
			
			.u-sidebar_resize  {
				height: calc(100vh - 82px);
				position: relative;
				opacity: 0;
				overflow:scroll;
				pointer-events: none;
				resize: horizontal;
				z-index: 1;
				
				&::-webkit-scrollbar {
					width: 2px;
					height: inherit;
				}
			}
			
			.u-sidebar_content {
				height: 100%;
				left: 0;
				overflow: auto;
				position: absolute;
				top: 0;
				width: 100%;
				margin-right: 2px;
			}
			
			&.border-right {
				border-right: 1px solid $lightgray;
				box-shadow: 1px 1px 5px rgba(0,0,0,0.05);
			}
			&.border-left {
				border-left: 1px solid $lightgray;
				box-shadow: 1px 1px 5px rgba(0,0,0,0.05);
			}
		}
		
		.u-sidebar-page_content {
			height: calc(100% - 30px);
			overflow: auto;
			padding: 15px;
		}
	}
</style>