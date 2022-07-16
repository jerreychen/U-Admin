<template>
	<div class="u-list" :class="{
		'd-flex row middle': flex
	}">
		<div class="list-empty" v-if="data.length === 0">
			<slot name="empty">
				<el-empty :title="emptyText"></el-empty>
			</slot>
		</div>
		<template v-else>
			<div class="u-list_item" v-for="(item, index) in data">
				<slot name="item" :item="item"></slot>
			</div>
		</template>
		<slot name="more"></slot>
	</div>
</template>

<script setup>
	const props = defineProps({
		emptyText: { type: String, default: '暂无数据' },
		flex: { type: Boolean, default: false },
		data: { type: Array, default: () => ([]) },
	})
</script>

<style lang="scss" scoped>
	.u-list {
		width: 100%;
	}
</style>