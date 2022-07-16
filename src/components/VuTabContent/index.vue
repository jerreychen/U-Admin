<template>
	<el-tabs class="u-tab-content" v-model="activeIndex">
		<template v-if="Array.isArray(title)">
			<el-tab-pane v-for="(tabTitle, index) in title" :label="tabTitle" :key="index" :name="index">
				<template #label>
					<div class="u-tab-content_title">{{tabTitle}}</div>
				</template>
				<slot :name="index"></slot>
			</el-tab-pane>
		</template>
		<el-tab-pane name="0" v-else>
			<template #label>
				<div class="u-tab-content_title">{{title}}</div>
			</template>
			<slot />
		</el-tab-pane>
	</el-tabs>
</template>

<script setup>
	const props = defineProps({
		title: { type: [String, Array] },
		addable: { type: Boolean, default: false },
		activeIndex: { type: Number, default: 0 }
	})
	

</script>

<style lang="scss" scoped>
	.u-tab-content {
		background-color: $white;
		
		:deep(.el-tabs__active-bar) {
			width: 100%;
		}
		
		:deep(.el-tabs__nav) {
			padding-left: 1.5rem;
			padding-right: 1.5rem;
			
			.u-tab-content_title {
				padding: 0 1rem;
			}
		}
	}
</style>