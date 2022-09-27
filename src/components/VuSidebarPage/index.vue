<template>
	<VuSplitter class="u-sidebar-page"
		:resizable="resizable" 
		:startWidth="sidebarWidth" 
		:maxStartWidth="maxSidebarWidth">
		<template #start>
			<div class="u-sidebar-page_sidebar">
				<slot name="sidebar"></slot>
			</div>
		</template>
		<template #end>
			<div class="u-sidebar-page_content padding-4" :style="{
				'background-color': backgroundColor
			}">
				<slot name="content"></slot>
			</div>
		</template>
	</VuSplitter>
</template>

<script setup>
	const props = defineProps({
		resizable: { type: Boolean, default: true },
		sidebarWidth: { type: Number, default: 250 },
		maxSidebarWidth: { type: Number, default: 800 },
		backgroundColor: { type: String, default: 'transparent' }
	})
</script>

<style lang="scss" scoped>
	.u-sidebar-page {
		:deep(.u-splitter_start) {
			background-color: #fff;
			margin-left: 1px;
			height: 100% !important;
		}
	}
</style>