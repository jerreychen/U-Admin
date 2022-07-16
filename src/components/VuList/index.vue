<template>
	<div class="u-list" :class="{
		'd-flex row middle': flex
	}">
		<template v-if="data.length === 0">
			<div class="list-empty" v-if="showEmpty">
				<slot name="empty">
					<el-empty :image-size="emptyImageSize" :title="emptyText"></el-empty>
				</slot>
			</div>
		</template>
		<template v-else>
			<div class="u-list_item" v-for="(item, index) in data">
				<slot name="item" :item="item" :index="index"></slot>
			</div>
		</template>
		<slot name="more"></slot>
	</div>
</template>

<script setup>
	const props = defineProps({
		showEmpty: { type: Boolean, default: true },
		emptyImageSize: { type: Number },
		emptyText: { type: String, default: '暂无数据' },
		flex: { type: Boolean, default: false },
		data: { type: Array, default: () => ([]) },
	})
</script>

<style lang="scss" scoped>
	.u-list {
		width: 100%;
		
		.u-list_item {
			position: relative;
		}
		
		.list-empty {
			width: 100%;
			:deep(.el-empty) {
				padding: 1rem 0 !important;
			}
		}
	}
</style>