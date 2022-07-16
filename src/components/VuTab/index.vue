<template>
	<el-tabs class="u-tab" type="card" v-model="activeIndex">
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

</style>